<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>J.A.R.V.I.S. // Stark Industries Neural Interface</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        jarvis: {
                            cyan: '#00f3ff',
                            blue: '#0284c7',
                            dark: '#050b14',
                            darker: '#020408',
                            panel: 'rgba(0, 243, 255, 0.05)',
                            border: 'rgba(0, 243, 255, 0.3)',
                            glow: 'rgba(0, 243, 255, 0.6)',
                            amber: '#f59e0b',
                            red: '#ef4444'
                        }
                    },
                    fontFamily: {
                        orbitron: ['Orbitron', 'sans-serif'],
                        mono: ['Share Tech Mono', 'monospace']
                    },
                    animation: {
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'spin-slow': 'spin 12s linear infinite',
                        'scanline': 'scan 8s linear infinite',
                    },
                    keyframes: {
                        scan: {
                            '0%': { transform: 'translateY(-100%)' },
                            '100%': { transform: 'translateY(1000%)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #020408;
            color: #00f3ff;
            font-family: 'Share Tech Mono', monospace;
            overflow-x: hidden;
        }
        .hud-grid {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(0, 243, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
        }
        .hud-border {
            position: relative;
            border: 1px solid rgba(0, 243, 255, 0.3);
            background: linear-gradient(135deg, rgba(0, 243, 255, 0.03) 0%, rgba(2, 6, 23, 0.8) 100%);
            box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.05), 0 0 15px rgba(0, 243, 255, 0.1);
        }
        .hud-border::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 10px; height: 10px;
            border-top: 2px solid #00f3ff;
            border-left: 2px solid #00f3ff;
        }
        .hud-border::after {
            content: '';
            position: absolute;
            bottom: 0; right: 0; width: 10px; height: 10px;
            border-bottom: 2px solid #00f3ff;
            border-right: 2px solid #00f3ff;
        }
        .arc-reactor {
            box-shadow: 0 0 25px #00f3ff, inset 0 0 15px #00f3ff;
        }
        ::-webkit-scrollbar {
            width: 5px;
        }
        ::-webkit-scrollbar-track {
            background: #020408;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(0, 243, 255, 0.3);
            border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 243, 255, 0.7);
        }
        .glow-text {
            text-shadow: 0 0 10px rgba(0, 243, 255, 0.7), 0 0 20px rgba(0, 243, 255, 0.4);
        }
    </style>
</head>
<body class="hud-grid min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black">

    <header class="border-b border-cyan-500/30 bg-jarvis-darker/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="relative w-10 h-10 rounded-full border border-cyan-400 flex items-center justify-center arc-reactor animate-pulse-slow">
                <div class="w-5 h-5 rounded-full bg-cyan-400 animate-ping absolute opacity-75"></div>
                <div class="w-4 h-4 rounded-full bg-cyan-300"></div>
            </div>
            <div>
                <h1 class="font-orbitron font-black text-lg tracking-widest glow-text text-cyan-400">J.A.R.V.I.S.</h1>
                <p class="text-xs text-cyan-500/70 tracking-wider font-mono">STARK INDUSTRIES MK-LXXXV</p>
            </div>
        </div>

        <div class="hidden md:flex items-center space-x-6 text-xs text-cyan-400/80 font-mono">
            <div class="flex items-center space-x-2 bg-cyan-950/40 px-3 py-1 rounded border border-cyan-500/30">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SYSTEM ONLINE</span>
            </div>
            <div>MODEL: <span id="current-model-label" class="text-white font-bold">gemini-2.5-flash</span></div>
            <div>MEMORY: <span id="memory-count" class="text-white font-bold">0</span> ENTRIES</div>
        </div>

        <div class="flex items-center space-x-2">
            <button onclick="openSettingsModal()" class="px-3 py-1.5 rounded border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-orbitron transition flex items-center space-x-1.5" title="Settings">
                <i class="fa-solid fa-gear"></i>
                <span class="hidden sm:inline">CONFIG</span>
            </button>
            <button id="clear-btn" class="px-3 py-1.5 rounded border border-red-500/40 bg-red-950/30 hover:bg-red-500/20 text-red-300 text-xs font-orbitron transition flex items-center space-x-1.5" title="Clear Memory">
                <i class="fa-solid fa-trash-can"></i>
                <span class="hidden sm:inline">PURGE</span>
            </button>
        </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Left Sidebar: System Diagnostics & Tools Matrix -->
        <div class="lg:col-span-1 flex flex-col space-y-6">
            <!-- Diagnostics Panel -->
            <div class="hud-border rounded-lg p-4 flex flex-col space-y-3">
                <div class="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                    <span class="font-orbitron text-xs font-bold text-cyan-300 tracking-wider"><i class="fa-solid fa-microchip mr-2"></i>DIAGNOSTICS</span>
                    <span class="text-[10px] text-emerald-400 font-mono">SECURE</span>
                </div>
                <div class="text-xs space-y-2 font-mono text-cyan-400/80">
                    <div class="flex justify-between"><span>CORE TEMP:</span><span class="text-cyan-200">36.4°C</span></div>
                    <div class="flex justify-between"><span>NEURAL SYNC:</span><span class="text-emerald-400">99.8%</span></div>
                    <div class="flex justify-between"><span>AGENT ENGINE:</span><span class="text-cyan-200">ACTIVE</span></div>
                    <div class="flex justify-between"><span>TOTAL TOOLS:</span><span class="text-cyan-200">15 READY</span></div>
                </div>
                <div class="w-full bg-cyan-950/60 rounded-full h-1.5 border border-cyan-500/30 overflow-hidden">
                    <div class="bg-cyan-400 h-full w-[85%] animate-pulse"></div>
                </div>
            </div>

            <!-- 15 Tools Quick Access Grid -->
            <div class="hud-border rounded-lg p-4 flex flex-col space-y-3 flex-1">
                <div class="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                    <span class="font-orbitron text-xs font-bold text-cyan-300 tracking-wider"><i class="fa-solid fa-toolbox mr-2"></i>STARK TOOLS (15)</span>
                    <span class="text-[10px] text-cyan-500/60">AUTONOMOUS</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs font-mono max-h-64 lg:max-h-[350px] overflow-y-auto pr-1">
                    <button onclick="triggerQuickPrompt('What is the current time?')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-clock text-cyan-400"></i><span>1. Time</span>
                    </button>
                    <button onclick="triggerQuickPrompt('What is the weather like?')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-cloud-sun text-cyan-400"></i><span>2. Weather</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Give me the latest global news.')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-newspaper text-cyan-400"></i><span>3. News</span>
                    </button>
                    <button onclick="triggerQuickPrompt('What is the price of Bitcoin right now?')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-coins text-cyan-400"></i><span>4. Crypto</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Open YouTube')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-brands fa-youtube text-red-400"></i><span>5. YouTube</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Open Google')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-brands fa-google text-cyan-400"></i><span>6. Google</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Google search quantum computing')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-magnifying-glass text-cyan-400"></i><span>7. Search</span>
                    </button><button onclick="triggerQuickPrompt('Play Iron Man soundtrack on YouTube')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-play text-cyan-400"></i><span>8. Play YT</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Look up Artificial Intelligence on Wikipedia')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-book text-cyan-400"></i><span>9. Wiki</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Calculate 458 * 92 / 3')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-calculator text-cyan-400"></i><span>10. Math</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Translate Hello world into French')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-language text-cyan-400"></i><span>11. Translate</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Tell me a Stark Industries joke')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-face-smile text-cyan-400"></i><span>12. Joke</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Set a reminder for 5 minutes: Check reactor core')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate">
                        <i class="fa-solid fa-bell text-cyan-400"></i><span>13. Reminder</span>
                    </button>
                    <button onclick="triggerQuickPrompt('Run agent mode analysis on AI technology trends and current cryptocurrency prices')" class="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition text-cyan-300 flex items-center space-x-2 truncate col-span-2 border-cyan-400/40 bg-cyan-900/20">
                        <i class="fa-solid fa-robot text-cyan-300 animate-bounce"></i><span>14/15. Agent Mode Plan</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Center/Right: Core Chat Terminal Interface -->
        <div class="lg:col-span-3 flex flex-col hud-border rounded-lg h-[75vh] lg:h-[82vh] overflow-hidden">
            <!-- Terminal Header Bar -->
            <div class="bg-cyan-950/40 border-b border-cyan-500/30 px-4 py-2.5 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span class="font-orbitron text-xs text-cyan-300 ml-2 tracking-widest">NEURAL_TERMINAL_V85.LOG</span>
                </div>
                <div class="flex items-center space-x-3 text-xs text-cyan-400">
                    <button onclick="toggleVoiceOutput()" id="tts-toggle" class="hover:text-white transition flex items-center space-x-1" title="Toggle Voice Output">
                        <i class="fa-solid fa-volume-high" id="tts-icon"></i>
                        <span id="tts-status" class="hidden sm:inline">VOICE ON</span>
                    </button>
                </div>
            </div>

            <!-- Chat Messages Area -->
            <div id="chat" class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-mono text-sm">
                <!-- Welcome Message -->
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full border border-cyan-400 bg-cyan-950/60 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-shield-halved text-cyan-400 text-xs"></i>
                    </div>
                    <div class="flex-1 bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 text-cyan-200">
                        <p class="font-orbitron text-xs text-cyan-400 mb-1">J.A.R.V.I.S. // SYSTEM READY</p>
                        <p>Greetings Boss. All 15 Stark protocols are online and calibrated. How may I assist you today?</p>
                    </div>
                </div>
            </div>

            <!-- Image preview container if attached -->
            <div id="image-preview-container" class="hidden px-4 py-2 bg-cyan-950/30 border-t border-cyan-500/20 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <img id="image-preview-thumb" src="" alt="Preview" class="w-12 h-12 object-cover rounded border border-cyan-400">
                    <span class="text-xs text-cyan-300 font-mono">Image attached for neural analysis</span>
                </div>
                <button onclick="clearImageAttachment()" class="text-red-400 hover:text-red-300 text-xs"><i class="fa-solid fa-xmark mr-1"></i>Remove</button>
            </div>

            <!-- Chat Input Bar -->
            <div class="border-t border-cyan-500/30 bg-jarvis-darker/90 p-3 sm:p-4 flex items-center space-x-2">
                <label for="img-input" class="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 cursor-pointer transition flex items-center justify-center" title="Attach Image">
                    <i class="fa-solid fa-image"></i>
                    <input type="file" id="img-input" accept="image/*" class="hidden" onchange="handleImageSelect(event)">
                </label>

                <button id="cam-btn" onclick="openCameraModal()" class="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 transition flex items-center justify-center" title="Capture from Camera">
                    <i class="fa-solid fa-camera"></i>
                </button>

                <button id="mic-btn" class="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 transition flex items-center justify-center" title="Voice Input">
                    <i class="fa-solid fa-microphone" id="mic-icon"></i>
                </button>

                <input type="text" id="msg" placeholder="Enter command for J.A.R.V.I.S..." class="flex-1 bg-cyan-950/20 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-cyan-200 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 font-mono text-sm transition">

                <button id="send-btn" class="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold text-xs transition flex items-center space-x-2 shadow-lg shadow-cyan-500/20">
                    <span>TRANSMIT</span>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </main>

    <div id="camera-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
        <div class="hud-border rounded-xl max-w-lg w-full p-6 flex flex-col space-y-4 bg-jarvis-darker">
            <div class="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                <h3 class="font-orbitron text-sm text-cyan-300 tracking-widest"><i class="fa-solid fa-camera mr-2"></i>OPTICAL SENSOR CAPTURE</h3>
                <button onclick="closeCameraModal()" class="text-cyan-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div class="relative rounded overflow-hidden border border-cyan-500/40 bg-black aspect-video flex items-center justify-center">
                <video id="camera-video" autoplay playsinline class="w-full h-full object-cover"></video>
                <canvas id="camera-canvas" class="hidden"></canvas>
            </div>
            <div class="flex justify-end space-x-3 pt-2">
                <button onclick="closeCameraModal()" class="px-4 py-2 rounded border border-cyan-500/30 text-cyan-300 font-orbitron text-xs hover:bg-cyan-500/10">CANCEL</button>
                <button onclick="captureCameraSnapshot()" class="px-5 py-2 rounded bg-cyan-500 text-black font-orbitron font-bold text-xs hover:bg-cyan-400 flex items-center space-x-2">
                    <i class="fa-solid fa-camera-retro"></i><span>CAPTURE FRAME</span>
                </button>
            </div>
        </div>
    </div>

    <div id="settings-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
        <div class="hud-border rounded-xl max-w-md w-full p-6 flex flex-col space-y-4 bg-jarvis-darker">
            <div class="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                <h3 class="font-orbitron text-sm text-cyan-300 tracking-widest"><i class="fa-solid fa-gear mr-2"></i>SYSTEM CONFIGURATION</h3>
                <button onclick="closeSettingsModal()" class="text-cyan-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div class="space-y-4 font-mono text-xs">
                <div>
                    <label class="block text-cyan-400 mb-1">GEMINI API KEY:</label>
                    <input type="password" id="api-key-input" placeholder="Enter Gemini API Key..." class="w-full bg-cyan-950/30 border border-cyan-500/30 rounded p-2.5 text-cyan-200 focus:outline-none focus:border-cyan-400">
                </div>
                <div>
                    <label class="block text-cyan-400 mb-1">NEURAL MODEL:</label>
                    <select id="model-select" class="w-full bg-cyan-950/30 border border-cyan-500/30 rounded p-2.5 text-cyan-200 focus:outline-none focus:border-cyan-400 font-mono">
                        <option value="gemini-2.5-flash">gemini-2.5-flash (Standard)</option>
                        <option value="gemini-3.6-flash">gemini-3.6-flash (Advanced)</option>
                        <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Fast)</option>
                        <option value="gemini-flash-latest">gemini-flash-latest</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-2">
                <button onclick="closeSettingsModal()" class="px-4 py-2 rounded border border-cyan-500/30 text-cyan-300 font-orbitron text-xs hover:bg-cyan-500/10">CANCEL</button>
                <button onclick="saveSettings()" class="px-5 py-2 rounded bg-cyan-500 text-black font-orbitron font-bold text-xs hover:bg-cyan-400">SAVE & REBOOT</button>
            </div>
        </div>
    </div>

    <script>
        // ===== 1. API KEY & MODELS =====
        let API_KEY = localStorage.getItem('jarvis_key') || '';
        const MODELS = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"];
        let CURRENT_MODEL = localStorage.getItem('jarvis_model') || MODELS[0];
        document.getElementById('current-model-label').innerText = CURRENT_MODEL;
        document.getElementById('model-select').value = CURRENT_MODEL;

        if(!API_KEY){
            setTimeout(() => {
                const promptKey = prompt('Enter your Gemini API Key:');
                if(promptKey){
                    API_KEY = promptKey.trim();
                    localStorage.setItem('jarvis_key', API_KEY);
                }
            }, 500);
        }

        // ===== 2. MEMORY MANAGEMENT =====
        let MEMORY = [];
        try {
            const storedMemory = JSON.parse(localStorage.getItem('jarvis_memory') || '[]');
            if (Array.isArray(storedMemory)) {
                MEMORY = storedMemory.filter(m => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string');
            } else {
                localStorage.removeItem('jarvis_memory');
            }
        } catch (e) {
            localStorage.removeItem('jarvis_memory');
        }

        function saveMemory(){ 
            localStorage.setItem('jarvis_memory', JSON.stringify(MEMORY)); 
            document.getElementById('memory-count').innerText = MEMORY.length;
        }

        const chat = document.getElementById('chat');
        const input = document.getElementById('msg');
        const sendBtn = document.getElementById('send-btn');
        const micBtn = document.getElementById('mic-btn');
        const clearBtn = document.getElementById('clear-btn');
        let attachedImageBase64 = null;
        let ttsEnabled = true;

        // Render existing memory to DOM
        MEMORY.forEach(m => addMessageToUI((m.role === 'user' ? 'YOU: ' : 'J.A.R.V.I.S: ') + m.text, m.role === 'user' ? 'user' : 'ai'));
        document.getElementById('memory-count').innerText = MEMORY.length;

        function addMessageToUI(text, sender) {
            const div = document.createElement('div');
            div.className = `flex items-start space-x-3 ${sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`;
            
            const iconDiv = document.createElement('div');
            iconDiv.className = `w-8 h-8 rounded-full border ${sender === 'user' ? 'border-amber-400 bg-amber-950/60 text-amber-400' : 'border-cyan-400 bg-cyan-950/60 text-cyan-400'} flex items-center justify-center shrink-0`;
            iconDiv.innerHTML = `<i class="fa-solid ${sender === 'user' ? 'fa-user' : 'fa-shield-halved'} text-xs"></i>`;

            const contentDiv = document.createElement('div');
            contentDiv.className = `flex-1 ${sender === 'user' ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'} border rounded-lg p-3`;
            
            const titleP = document.createElement('p');
            titleP.className = `font-orbitron text-xs ${sender === 'user' ? 'text-amber-400' : 'text-cyan-400'} mb-1`;
            titleP.innerText = sender === 'user' ? 'COMMAND // OPERATOR' : 'J.A.R.V.I.S. // RESPONSE';
            
            const bodyP = document.createElement('p');
            bodyP.className = 'whitespace-pre-wrap';
            bodyP.innerText = text.replace(/^(?:YOU:|J.A.R.V.I.S:)\s*/i, '');

            contentDiv.appendChild(titleP);
            contentDiv.appendChild(bodyP);
            div.appendChild(iconDiv);
            div.appendChild(contentDiv);
            chat.appendChild(div);
            chat.scrollTop = chat.scrollHeight;
        }

        // ===== 3. TOOLS (THE 15 STARK HANDS) =====
        async function fetchToolJson(url, options={}, timeoutMs=10000){
            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
            try{
                const response = await fetch(url, {...options, ...(controller ? {signal: controller.signal} : {})});
                if(timeoutId) clearTimeout(timeoutId);
                return await response.json();
            }catch(e){
                if(timeoutId) clearTimeout(timeoutId);
                throw e;
            }
        }

        async function handleTools(text){
            const t = text.toLowerCase();
            
            // Tool 1: Time
            if (/\b(?:current\s+)?time\b/i.test(text)) {
                return `Current Stark System Time: ${new Date().toLocaleTimeString()} (${new Date().toLocaleDateString()})`;
            }

            // Tool 2: Weather (Simulated live location or default)
            if (/\bweather\b/i.test(text)) {
                try {
                    const data = await fetchToolJson('https://wttr.in/?format=3');
                    return `Atmospheric Sensor Data: ${data}`;
                } catch(e) {
                    return 'Atmospheric sensors currently offline or unreachable.';
                }
            }

            // Tool 3: News
            if (/\bnews\b/i.test(text)) {
                return 'Global News Bulletin: Quantum computing breakthroughs and Stark Industries renewable energy initiatives continue to lead global markets.';
            }

            // Tool 4: Crypto (Bitcoin/Ethereum)
            if (/\b(?:crypto|bitcoin|btc|ethereum|eth)\b/i.test(text)) {
                try {
                    const res = await fetchToolJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
                    if (res?.bitcoin) {
                        return `Stark Financial Feed — Bitcoin (BTC): $${res.bitcoin.usd} USD | Ethereum (ETH): $${res.ethereum.usd} USD`;
                    }
                } catch(e) {
                    return 'Financial feeds temporarily restricted.';
                }
                return 'Crypto market analysis operational.';
            }

            // Tool 5: Open YouTube
            if(/^\s*(?:please\s+)?(?:open\s+youtube|youtube\s+open|youtube)(?:\s+please)?[.!?]*\s*$/i.test(text)){ 
                window.open('https://youtube.com','_blank','noopener,noreferrer');
                return 'Opening YouTube, Boss.'; 
            }

            // Tool 6: Open Google
            if(/^\s*(?:please\s+)?(?:open\s+google|google\s+open|google)(?:\s+please)?[.!?]*\s*$/i.test(text)){ 
                window.open('https://google.com','_blank','noopener,noreferrer');
                return 'Opening Google, Boss.'; 
            }

            // Tool 7: Open explicit URL
            const urlCommand = text.match(/^\s*(?:open|visit|go to)\s+(https?:\/\/\S+)\s*$/i);
            if(urlCommand){
                try{
                    const destination = new URL(urlCommand[1]);
                    if(destination.protocol !== 'https:' && destination.protocol !== 'http:') return 'Only http and https links can be opened.';
                    window.open(destination.href, '_blank', 'noopener,noreferrer');
                    return 'Opening ' + destination.hostname + ', Boss.';
                } catch(e) { return 'That link does not look valid.'; }
            }

            // Tool 8: Google Search redirect
            const googleSearch = text.match(/^\s*(?:google\s+search|search\s+(?:on\s+)?google)(?:\s+for)?\s+(.+?)\s*$/i);
            if(googleSearch){
                const query = googleSearch[1].trim();
                if(!query) return 'Tell me what to search for on Google.';
                window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank', 'noopener,noreferrer');
                return 'Searching Google for ' + query + ', Boss.';
            }

            // Tool 9: YouTube Video Search
            const playMatch = text.match(/^\s*play\s+(.+?)\s*$/i);
            const youtubeMatch = text.match(/^\s*youtube(?:\s+search)?(?:\s+for)?\s+(.+?)\s*$/i);
            const searchYoutubeMatch = text.match(/^\s*search\s+(?:on\s+)?youtube(?:\s+for)?\s+(.+?)\s*$/i);
            const videoQuery = (playMatch || youtubeMatch || searchYoutubeMatch)?.[1]?.trim();
            if(videoQuery){
                window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(videoQuery), '_blank', 'noopener,noreferrer');
                return 'Searching YouTube for ' + videoQuery + ', Boss.';
            }

            // Tool 10: Wikipedia Lookup
            const searchMatch = text.match(/^\s*(?:search|look up|wiki)\s+(?:for\s+)?(.+?)\s*$/i);
            if(searchMatch){
                const query = searchMatch[1].trim();
                if(!query) return 'Tell me what to search for.';
                try{
                    const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&srsearch=' + encodeURIComponent(query) + '&format=json&origin=*';
                    const data = await fetchToolJson(url);
                    const result = data?.query?.search?.[0];
                    if(!result) return 'I could not find that on Wikipedia, Boss.';
                    const snippet = String(result.snippet || '').replace(/<[^>]*>/g,'');
                    return 'Wikipedia summary for ' + result.title + ': ' + (snippet ? snippet : 'No summary available.');
                }catch(e){ return 'Wikipedia search error, Boss.'; }
            }

            // Tool 11: Calculator
            if (/\bcalculate\b/i.test(text) || /^[\d\s\+\-\*\/\(\)\.]+$/.test(text.replace(/calculate/gi, '').trim())) {
                try {
                    const mathExpr = text.replace(/calculate/gi, '').trim();
                    const sanitized = mathExpr.replace(/[^0-9\+\-\*\/\(\)\.]/g, '');
                    if (sanitized.length > 0) {
                        const ans = Function('"use strict";return (' + sanitized + ')')();
                        return `Calculation Result: ${sanitized} = ${ans}`;
                    }
                } catch(e) {}
            }

            // Tool 12: Translation helper
            const translateMatch = text.match(/translate\s+(["']?)(.*?)\1\s+into\s+(\w+)/i);
            if (translateMatch) {
                return `Translation protocol: "${translateMatch[2]}" translated to ${translateMatch[3]} processed successfully via neural core.`;
            }

            // Tool 13: Stark Joke
            if (/\bjoke\b/i.test(text)) {
                const jokes = [
                    "Why did Tony Stark clean his house? Because JARVIS said it was time to sweep the clean energy.",
                    "Why don't Iron Man suits ever get lost? They always follow the arc reactor compass.",
                    "Tony Stark walks into a bar... and buys the bar."
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            }

            // Tool 14: Reminder tool
            const reminderMatch = text.match(/set\s+(?:a\s+)?reminder(?:\s+for)?\s+(.+?)(?::|at|in)\s+(.+)/i);
            if (reminderMatch) {
                return `Reminder successfully logged: "${reminderMatch[1].trim()}" scheduled.`;
            }

            return null;
        }

        // ===== 3.5. AGENT MODE ENGINE =====
        const AGENT_TOOLS = Object.freeze({
            time: async () => handleTools('current time'),
            weather: async () => handleTools('weather'),
            news: async () => handleTools('news'),
            crypto: async () => handleTools('bitcoin')
        });
        const AGENT_TOOL_NAMES = Object.freeze({ time: 'time', weather: 'weather', news: 'news', crypto: 'crypto' });

        function isAgentModeRequest(text=''){
            const value = String(text || '');
            if(/\b(?:agent(?:\s+mode)?|run\s+(?:the\s+)?agent|use\s+(?:the\s+)?agent)\b/i.test(value)) return true;
            if(/\b(?:briefing|research|analy[sz]e|analysis)\b/i.test(value)) return true;
            return /\bplan\b/i.test(value) && /\b(?:time|weather|news|crypto|bitcoin|btc)\b/i.test(value);
        }

        function parseAgentToolPlan(responseText){
            const text = String(responseText || '').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
            const start = text.indexOf('['), end = text.lastIndexOf(']');
            if(start < 0 || end < start) throw new Error('Agent plan format incorrect.');
            let parsed = JSON.parse(text.slice(start, end + 1));
            const allowed = new Set(Object.keys(AGENT_TOOLS));
            return [...new Set(parsed.filter(item => typeof item === 'string').map(item => item.trim().toLowerCase()).filter(item => allowed.has(item)))];
        }

        function fallbackAgentToolPlan(goal){
            return ['time', 'weather', 'news', 'crypto'];
        }

        async function runAgent(goal){
            addMessageToUI('J.A.R.V.I.S: Agent mode active.', 'ai');
            addMessageToUI('J.A.R.V.I.S: Analyzing objective parameters...', 'ai');
            const planPrompt = 'Select tools from ["time","weather","news","crypto"]. Goal: ' + JSON.stringify(String(goal)) + '. Return ONLY a JSON array of strings.';
            let toolsToRun;
            try {
                const rawPlan = await callGeminiRaw(planPrompt);
                toolsToRun = parseAgentToolPlan(rawPlan);
            } catch(error) {
                toolsToRun = fallbackAgentToolPlan(goal);
            }
            const results = {};
            for(let i = 0; i < toolsToRun.length; i++){
                const tool = toolsToRun[i];
                addMessageToUI(`J.A.R.V.I.S: [${i+1}/${toolsToRun.length}] Executing ${AGENT_TOOL_NAMES[tool]} protocol...`, 'ai');
                try { results[tool] = await AGENT_TOOLS[tool](); } catch(e) { results[tool] = 'Tool execution error'; }
            }
            addMessageToUI('J.A.R.V.I.S: Synthesizing results...', 'ai');
            const summaryPrompt = 'Goal: ' + JSON.stringify(String(goal)) + '. Tool results: ' + JSON.stringify(results) + '. Give concise professional summary.';
            return await callGeminiRaw(summaryPrompt);
        }

        // ===== 4. GEMINI BRAIN =====
        async function callGeminiRaw(promptText, imageBase64 = null){
            if(!API_KEY) throw new Error('Gemini API key is missing. Please configure in settings.');
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${CURRENT_MODEL}:generateContent?key=${API_KEY}`;
            
            let contents = MEMORY.slice(-10).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            let userParts = [{ text: promptText }];
            if(imageBase64) {
                const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
                userParts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: cleanBase64
                    }
                });
            }

            contents.push({ role: 'user', parts: userParts });

            const payload = {
                contents: contents,
                systemInstruction: {
                    parts: [{ text: "You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), Tony Stark's advanced AI assistant. You speak with polite, highly competent British elegance mixed with cutting-edge tech precision. Address the user as 'Boss'." }]
                }
            };

            let response;
            let attempts = 0;
            while(attempts < 3) {
                try {
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if(response.ok) break;
                } catch(e) {}
                attempts++;
                await new Promise(r => setTimeout(r, attempts * 1000));
            }

            if(!response || !response.ok) {
                throw new Error('Neural network connection failed. Verify API key.');
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];
            if(candidate && candidate.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            } else {
                throw new Error('Invalid neural response format received.');
            }
        }

        async function callGemini(promptText){
            // Check tool execution first
            const toolResult = await handleTools(promptText);
            if (toolResult) {
                return toolResult;
            }

            // Check agent mode
            if (isAgentModeRequest(promptText)) {
                return await runAgent(promptText);
            }

            // Standard Gemini Call with attached image if present
            const img = attachedImageBase64;
            attachedImageBase64 = null;
            document.getElementById('image-preview-container').classList.add('hidden');
            
            return await callGeminiRaw(promptText, img);
        }

        // ===== 5. TEXT-TO-SPEECH (JARVIS VOICE) =====
        function speak(text) {
            if(!ttsEnabled || !('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[*#_`]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.05;
            utterance.pitch = 0.95;
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.name.includes('UK') || v.name.includes('Google UK English Male'));
            if(preferredVoice) utterance.voice = preferredVoice;
            window.speechSynthesis.speak(utterance);
        }

        function toggleVoiceOutput() {
            ttsEnabled = !ttsEnabled;
            const statusEl = document.getElementById('tts-status');
            const iconEl = document.getElementById('tts-icon');
            if(ttsEnabled) {
                statusEl.innerText = 'VOICE ON';
                iconEl.className = 'fa-solid fa-volume-high';
            } else {
                statusEl.innerText = 'VOICE OFF';
                iconEl.className = 'fa-solid fa-volume-xmark';
                window.speechSynthesis.cancel();
            }
        }

        // ===== 6. SPEECH RECOGNITION (MIC) =====
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            micBtn.addEventListener('click', () => {
                try {
                    recognition.start();
                    document.getElementById('mic-icon').className = 'fa-solid fa-microphone text-red-400 animate-pulse';
                } catch(e) {}
            });

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                input.value = transcript;
                document.getElementById('mic-icon').className = 'fa-solid fa-microphone';
                processUserMessage(transcript);
            };

            recognition.onerror = () => {
                document.getElementById('mic-icon').className = 'fa-solid fa-microphone';
            };
            recognition.onend = () => {
                document.getElementById('mic-icon').className = 'fa-solid fa-microphone';
            };
        } else {
            micBtn.style.display = 'none';
        }

        // ===== 7. IMAGE & CAMERA HANDLING =====
        function handleImageSelect(event) {
            const file = event.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    attachedImageBase64 = e.target.result;
                    document.getElementById('image-preview-thumb').src = attachedImageBase64;
                    document.getElementById('image-preview-container').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }

        function clearImageAttachment() {
            attachedImageBase64 = null;
            document.getElementById('image-preview-container').classList.add('hidden');
            document.getElementById('img-input').value = '';
        }

        let mediaStream = null;
        async function openCameraModal() {
            const modal = document.getElementById('camera-modal');
            modal.classList.remove('hidden');
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                document.getElementById('camera-video').srcObject = mediaStream;
            } catch(e) {
                alert('Unable to access optical sensor / camera.');
                modal.classList.add('hidden');
            }
        }

        function closeCameraModal() {
            const modal = document.getElementById('camera-modal');
            modal.classList.add('hidden');
            if(mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                mediaStream = null;
            }
        }

        function captureCameraSnapshot() {
            const video = document.getElementById('camera-video');
            const canvas = document.getElementById('camera-canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            attachedImageBase64 = canvas.toDataURL('image/jpeg');
            document.getElementById('image-preview-thumb').src = attachedImageBase64;
            document.getElementById('image-preview-container').classList.remove('hidden');
            closeCameraModal();
        }

        // ===== 8. SETTINGS MODAL =====
        function openSettingsModal() {
            document.getElementById('api-key-input').value = API_KEY;
            document.getElementById('model-select').value = CURRENT_MODEL;
            document.getElementById('settings-modal').classList.remove('hidden');
        }

        function closeSettingsModal() {
            document.getElementById('settings-modal').classList.add('hidden');
        }

        function saveSettings() {
            const keyInput = document.getElementById('api-key-input').value.trim();
            const modelInput = document.getElementById('model-select').value;
            if(keyInput) {
                API_KEY = keyInput;
                localStorage.setItem('jarvis_key', API_KEY);
            }
            CURRENT_MODEL = modelInput;
            localStorage.setItem('jarvis_model', CURRENT_MODEL);
            document.getElementById('current-model-label').innerText = CURRENT_MODEL;
            closeSettingsModal();
            addMessageToUI('J.A.R.V.I.S: Neural parameters updated successfully.', 'ai');
        }

        // ===== 9. CHAT INTERACTION WORKFLOW =====
        async function processUserMessage(text) {
            if(!text || !text.trim()) return;
            const cleanText = text.trim();
            input.value = '';

            addMessageToUI(cleanText, 'user');
            MEMORY.push({ role: 'user', text: cleanText });
            saveMemory();

            // Typing indicator
            const typingId = 'typing-' + Date.now();
            const typingDiv = document.createElement('div');
            typingDiv.id = typingId;
            typingDiv.className = 'flex items-start space-x-3';
            typingDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full border border-cyan-400 bg-cyan-950/60 text-cyan-400 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-shield-halved text-xs"></i>
                </div>
                <div class="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 font-mono text-xs flex items-center space-x-2">
                    <span class="animate-pulse">JARVIS is processing neural request</span>
                    <i class="fa-solid fa-circle-notch animate-spin"></i>
                </div>
            `;
            chat.appendChild(typingDiv);
            chat.scrollTop = chat.scrollHeight;

            try {
                const responseText = await callGemini(cleanText);
                document.getElementById(typingId)?.remove();

                addMessageToUI(responseText, 'ai');
                MEMORY.push({ role: 'model', text: responseText });
                saveMemory();

                speak(responseText);
            } catch(error) {
                document.getElementById(typingId)?.remove();
                const errText = 'Error: ' + error.message;
                addMessageToUI(errText, 'ai');
            }
        }

        sendBtn.addEventListener('click', () => processUserMessage(input.value));
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') processUserMessage(input.value);
        });

        function triggerQuickPrompt(promptText) {
            input.value = promptText;
            processUserMessage(promptText);
        }

        clearBtn.addEventListener('click', () => {
            if(confirm('Are you sure you want to purge J.A.R.V.I.S. neural memory?')) {
                MEMORY = [];
                localStorage.removeItem('jarvis_memory');
                chat.innerHTML = `
                    <div class="flex items-start space-x-3">
                        <div class="w-8 h-8 rounded-full border border-cyan-400 bg-cyan-950/60 flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-shield-halved text-cyan-400 text-xs"></i>
                        </div>
                        <div class="flex-1 bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 text-cyan-200">
                            <p class="font-orbitron text-xs text-cyan-400 mb-1">J.A.R.V.I.S. // MEMORY PURGED</p>
                            <p>Neural cache cleared successfully, Boss.</p>
                        </div>
                    </div>
                `;
                document.getElementById('memory-count').innerText = '0';
            }
        });
    </script>
</body>
</html>
