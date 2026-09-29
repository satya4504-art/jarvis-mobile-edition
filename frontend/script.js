<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Assistant Tools</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #f4f4f9;
            color: #333;
        }
        h2 { color: #2c3e50; }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        input[type="text"] {
            width: 70%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            padding: 10px 15px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px 2px;
        }
        button:hover { background-color: #2980b9; }
        #output {
            margin-top: 15px;
            padding: 10px;
            background: #eef2f3;
            border-left: 4px solid #3498db;
            white-space: pre-wrap;
            min-height: 40px;
        }
        .preset-buttons { margin-top: 10px; }
    </style>
</head>
<body>

    <div class="card">
        <h2>AI Assistant Tools Console</h2>
        <p>Type a command or use the preset buttons below:</p>
        
        <input type="text" id="commandInput" placeholder="e.g., time, weather, play lofi...">
        <button onclick="processCommand()">Send</button>

        <div class="preset-buttons">
            <p><strong>Quick Test Presets:</strong></p>
            <button onclick="runTest('time')">Time</button>
            <button onclick="runTest('weather')">Weather</button>
            <button onclick="runTest('set timer for 5 seconds')">Timer (5s)</button>
            <button onclick="runTest('translate hello world')">Translate</button>
            <button onclick="runTest('play telugu songs')">YouTube</button>
        </div>

        <h3>Output:</h3>
        <div id="output">Results will appear here...</div>
    </div>

<script>
    // Dummy speech synthesis function to prevent errors
    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        } else {
            console.log("Speech synthesis not supported.");
        }
    }

    // ===== 3. TOOLS (THE HANDS) — 15 TOOLS =====
    async function handleTools(text) {
        const t = text.toLowerCase();
        
        // 1. Time
        if (/\btime\b/.test(t) || t.includes('టైమ్') || t.includes('సమయం '))
            return 'The time is ' + new Date().toLocaleTimeString() + ', Boss.';
        
        // 2. Weather
        if (t.includes('weather') || t.includes('వాతావరణం ')) {
            return await new Promise(res => {
                if (!navigator.geolocation) {
                    return res('Geolocation is not supported by your browser, Boss.');
                }
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
            setTimeout(() => speak(`టైమర్ పూర్తయింది! ${amount} ${unit} అయ్యాయి.`), duration);
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
                window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), '_blank');
                return 'Searching YouTube for ' + q + ', Boss.'; 
            }
        }
        
        return null; // Tool match కాకపోతే Gemini Brain కి వెళ్తుంది
    }

    // UI Helper Functions
    async function processCommand() {
        const input = document.getElementById('commandInput').value;
        const outputDiv = document.getElementById('output');
        
        if (!input.trim()) return;
        
        outputDiv.innerText = "Processing...";
        const result = await handleTools(input);
        
        if (result === null) {
            outputDiv.innerText = "Tool match కాకపోతే Gemini Brain కి వెళ్తుంది (No tool matched).";
        } else {
            outputDiv.innerText = result;
        }
    }

    async function runTest(cmd) {
        document.getElementById('commandInput').value = cmd;
        await processCommand();
    }
</script>

</body>
</html>
