// ===== 1. API KEY (Safe: browser లో మాత్రమే) =====
let API_KEY = localStorage.getItem('jarvis_key');
if(!API_KEY){
    API_KEY = prompt('Enter your Gemini API Key:');
    if(API_KEY) localStorage.setItem('jarvis_key', API_KEY);
}

// ===== 2. SMART MODELS =====
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];
const chat = document.getElementById('chat');
const input = document.getElementById('msg');
const micBtn = document.getElementById('mic-btn');

// ===== 3. GEMINI BRAIN =====
async function callGemini(p){
    let lastErr;
    for(const m of MODELS){
        try{
            const res = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent?key=" + API_KEY,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: "You are J.A.R.V.I.S., a friendly, motivational and inspirational AI assistant. " +
                                      "Speak naturally, warmly and confidently. " +
                                      "Keep your answers clear and easy to understand. " +
                                      "Encourage the user when appropriate. " +
                                      "Do not sound robotic or overly formal.\n\n" + p
                            }]
                        }]
                    })
                }
            );
            const data = await res.json();
            if(data.error){
                lastErr = new Error(data.error.message);
                if(/high demand|temporar|quota|rate|unavailable|no longer available|deprecated/i.test(data.error.message)){
                    continue;
                }
                throw lastErr;
            }
            return data.candidates[0].content.parts[0].text;
        } catch(e) {
            lastErr = e;
        }
    }
    throw lastErr;
}

async function askGemini(p){
    add('J.A.R.V.I.S: Thinking...', 'ai');
    try {
        const reply = await callGemini(p);
        chat.lastChild.innerText = 'J.A.R.V.I.S: ' + reply;
        speak(reply);
    } catch(e) {
        chat.lastChild.innerText = 'J.A.R.V.I.S: ERROR - ' + e.message;
    }
}

// ===== 4. SPEECH RECOGNITION =====
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SR){
    const rec = new SR();
    rec.lang = 'en-US';'te-IN';
    rec.continuous = false;
    rec.interimResults = false;
    
    rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        add('YOU: ' + t, 'user');
        askGemini(t);
    };
    
    micBtn.onclick = () => {
        try {
            speechSynthesis.cancel();
            rec.start();
            micBtn.innerText = 'LISTENING...';
        } catch(e) {
            console.log(e);
        }
    };
    
    rec.onend = () => {
        micBtn.innerText = '🎙️';
    };
} else {
    micBtn.onclick = () => {
        alert('Speech Recognition is not supported in this browser.');
    };
}

// ===== 5. UPGRADED INSPIRATIONAL TEXT-TO-SPEECH =====
let voices = [];
function loadVoices(){
    voices = speechSynthesis.getVoices();
}
loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

function getBestVoice(){
    // Prioritizing warm, confident British Male voices (Classic JARVIS), 
    // followed by highly expressive US voices.
    const preferredNames = [
        'Google UK English Male',   // Chrome OS/Android warm British
        'Daniel',                   // macOS classic British male
        'Microsoft George',         // Windows British male
        'Google US English',        // Chrome fallback
        'Microsoft Jenny',          // Very natural/expressive Windows female
        'Samantha',                 // macOS standard smooth
        'Alex'                      // macOS deep expressive male
    ];

    for(const name of preferredNames){
        const found = voices.find(v => 
            v.name.toLowerCase().includes(name.toLowerCase()) && 
            v.lang.toLowerCase().startsWith('en')
        );
        if(found) return found;
    }

    // Fallback to any available English voice if the exact matches aren't found
    return voices.find(v => v.lang.toLowerCase().startsWith('en-gb')) || 
           voices.find(v => v.lang.toLowerCase().startsWith('en-us')) || 
           voices.find(v => v.lang.toLowerCase().startsWith('en'));
}

function speak(text){
    speechSynthesis.cancel(); 
    
    // Clean text to prevent the AI from trying to pronounce markdown symbols like asterisks
    const cleanText = text.replace(/[*#_]/g, '');
    
    const u = new SpeechSynthesisUtterance(cleanText);

    // ===== MOTIVATIONAL J.A.R.V.I.S. SETTINGS =====
    // Slower rate = sounds more thoughtful, dramatic, and inspiring
    u.rate = 0.88; 
    
    // Slightly lower pitch = sounds more confident, calm, and grounded
    u.pitch = 0.92; 
    
    u.volume = 1.0; 

    const voice = getBestVoice();
    if(voice) {
        u.voice = voice;
    }

    speechSynthesis.speak(u);
}

// ===== 6. TEXT SEND BUTTON =====
document.getElementById('send').onclick = () => {
    const t = input.value.trim();
    if(!t) return;
    add('YOU: ' + t, 'user');
    input.value = '';
    askGemini(t);
};

// ===== 7. ADD MESSAGE =====
function add(t, w){
    const d = document.createElement('div');
    d.className = 'msg ' + w;
    d.innerText = t;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
}
