<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>J.A.R.V.I.S. Voice Assistant</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: #1e293b;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            max-width: 500px;
            width: 90%;
        }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 50px;
            cursor: pointer;
            transition: background 0.3s, transform 0.1s;
            margin-top: 20px;
        }
        button:hover { background: #2563eb; }
        button:active { transform: scale(0.98); }
        button.listening { background: #ef4444; animation: pulse 1.5s infinite; }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .output { margin-top: 25px; font-size: 16px; line-height: 1.5; min-height: 60px; }
        .label { color: #94a3b8; font-size: 14px; }
    </style>
</head>
<body>

    <div class="container">
        <h2>J.A.R.V.I.S. Assistant</h2>
        <p class="label">Click the button and speak your command, Boss.</p>
        <button id="micBtn" onclick="toggleListening()">Start Listening</button>
        <div class="output">
            <div><strong>You said:</strong> <span id="userText">-</span></div>
            <div style="margin-top: 10px;"><strong>J.A.R.V.I.S.:</strong> <span id="jarvisText">-</span></div>
        </div>
    </div>

    <script>
        // ===== CONFIGURATION =====
        const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your valid API key

        // ===== 1. SPEECH SYNTHESIS (THE VOICE) =====
        function speak(text) {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }

        // ===== 2. TOOLS (THE HANDS) =====
        async function handleTools(text) {
            const t = text.toLowerCase();
            
            // 1. Time
            if (/\btime\b/.test(t) || t.includes('టైమ్') || t.includes('సమయం')) {
                return 'The time is ' + new Date().toLocaleTimeString() + ', Boss.';
            }
            
            // 2. Weather
            if (t.includes('weather') || t.includes('వాతావరణం')) {
                return await new Promise(res => {
                    navigator.geolocation.getCurrentPosition(async p => {
                        try {
                            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}&current_weather=true`);
                            const d = await r.json();
                            res(`It is ${d.current_weather.temperature} degrees Celsius now, Boss.`);
                        } catch (e) { 
                            res('Weather service error, Boss.'); 
                        }
                    }, () => res('I need location permission for weather, Boss.'));
                });
            }
            
            // 3. Timer
            const m = t.match(/(\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)/i);
            if ((t.includes('timer') || t.includes('టైమర్')) && m) {
                const amount = parseInt(m[1]);
                const unit = m[2].toLowerCase();
                const factor = /^(hours?|hrs?|h)/.test(unit) ? 3600000 : /^(seconds?|secs?|s)/.test(unit) ? 1000 : 60000;
                const duration = amount * factor;
                setTimeout(() => speak(`టైమర్ పూర్తి! ${amount} ${unit} అయ్యాయి.`), duration);
                return `Timer set for ${amount} ${unit}.`;
            }
            
            // 4. Translate
            if (t.includes('translate')) {
                const q = text.replace(/translate (this )?/i, '').trim() || 'hello';
                try {
                    const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(q) + '&langpair=en|te');
                    const d = await r.json(); 
                    return 'In Telugu: ' + d.responseData.translatedText;
                } catch (e) { 
                    return 'Translate error, Boss.'; 
                }
            }
            
            // 5. YouTube Play
            if (t.includes('play ') || t.includes('youtube ')) {
                const q = text.replace(/play |youtube (search )?/i, '').trim();
                if (q) {
                    window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(q));
                    return 'Searching YouTube for ' + q + ', Boss.';
                }
            }
            
            return null; // Tool match కాకపోతే Gemini Brain కి వెళ్తుంది
        }

        // ===== 3. GEMINI BRAIN (FALLBACK) =====
        async function askGemini(prompt) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                const data = await response.json();
                return data.candidates[0].content.parts[0].text;
            } catch (error) {
                console.error("Gemini API Error:", error);
                return "Sorry Boss, I encountered an error connecting to my brain.";
            }
        }

        // ===== 4. COMMAND PROCESSOR =====
        async function processCommand(inputText) {
            document.getElementById('userText').innerText = inputText;
            
            // Step A: Check local tools first
            let responseText = await handleTools(inputText);
            
            // Step B: If no tool matched, route to Gemini API
            if (!responseText) {
                responseText = await askGemini(inputText);
            }
            
            document.getElementById('jarvisText').innerText = responseText;
            speak(responseText);
        }

        // ===== 5. SPEECH RECOGNITION FLOW =====
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isListening = false;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isListening = true;
                const btn = document.getElementById('micBtn');
                btn.innerText = "Listening...";
                btn.classList.add('listening');
            };

            recognition.onresult = async (event) => {
                const speechText = event.results[0][0].transcript;
                await processCommand(speechText);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
            };

            recognition.onend = () => {
                isListening = false;
                const btn = document.getElementById('micBtn');
                btn.innerText = "Start Listening";
                btn.classList.remove('listening');
            };
        } else {
            alert("Speech Recognition API is not supported in this browser. Try Google Chrome.");
        }

        function toggleListening() {
            if (!recognition) return;
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        }
    </script>
</body>
</html>
