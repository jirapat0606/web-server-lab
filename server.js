const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    
    const htmlOutput = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pixel Space Server</title>
        <style>
            * { 
                box-sizing: border-box; 
                margin: 0; 
                padding: 0;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            }

            body {
                font-family: 'Press Start 2P', 'Courier New', monospace;
                min-height: 100vh;
                background: linear-gradient(180deg, #0a0e27 0%, #1a1a3e 50%, #0d0d1f 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
                color: #00ff88;
                text-shadow: 0 0 10px #00ff88, 0 0 20px #0088ff;
            }

            /* Pixel stars background */
            .stars {
                position: fixed;
                inset: 0;
                pointer-events: none;
            }

            .star {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffff00;
                box-shadow: 0 0 8px #ffff00;
                animation: starTwinkle 3s infinite;
            }

            @keyframes starTwinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }

            /* Pixel grid background */
            .grid-bg {
                position: fixed;
                inset: 0;
                background-image: 
                    linear-gradient(0deg, transparent 24%, rgba(0, 255, 136, 0.05) 25%, rgba(0, 255, 136, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.05) 75%, rgba(0, 255, 136, 0.05) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(0, 255, 136, 0.05) 25%, rgba(0, 255, 136, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.05) 75%, rgba(0, 255, 136, 0.05) 76%, transparent 77%, transparent);
                background-size: 60px 60px;
                pointer-events: none;
                z-index: 1;
            }

            /* Pixel planet */
            .pixel-planet {
                position: absolute;
                width: 120px;
                height: 120px;
                background: linear-gradient(135deg, #ff6600 0%, #ff3300 50%, #990033 100%);
                clip-path: polygon(
                    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
                );
                filter: drop-shadow(0 0 20px #ff6600) drop-shadow(0 0 40px #ff3300);
                animation: planetFloat 4s ease-in-out infinite;
                top: -60px;
                right: -60px;
                opacity: 0.8;
            }

            @keyframes planetFloat {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(-20px, 20px); }
            }

            /* Pixel meteor/asteroid */
            .pixel-meteor {
                position: absolute;
                width: 16px;
                height: 16px;
                background: linear-gradient(135deg, #ffff00, #ff8800);
                clip-path: polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%);
                animation: meterMove 6s linear infinite;
                filter: drop-shadow(0 0 10px #ffff00);
            }

            @keyframes meterMove {
                0% { transform: translate(-200px, -200px) rotate(0deg); }
                100% { transform: translate(200px, 200px) rotate(360deg); }
            }

            /* Main pixel card container */
            .pixel-card {
                position: relative;
                z-index: 10;
                width: min(700px, 95%);
                background: linear-gradient(180deg, #1a3a52 0%, #0f2540 100%);
                border: 4px solid #00ff88;
                box-shadow: 
                    0 0 0 2px #0088ff,
                    0 0 30px #00ff88,
                    0 0 60px #0088ff,
                    inset 0 0 20px rgba(0, 255, 136, 0.1);
                padding: 2rem;
                position: relative;
            }

            /* Pixel corner decorations */
            .corner {
                position: absolute;
                width: 20px;
                height: 20px;
                border: 3px solid #00ff88;
            }

            .corner-tl { top: -4px; left: -4px; border-right: none; border-bottom: none; }
            .corner-tr { top: -4px; right: -4px; border-left: none; border-bottom: none; }
            .corner-bl { bottom: -4px; left: -4px; border-right: none; border-top: none; }
            .corner-br { bottom: -4px; right: -4px; border-left: none; border-top: none; }

            /* Header */
            .pixel-header {
                text-align: center;
                margin-bottom: 1.5rem;
                border-bottom: 3px dashed #00ff88;
                padding-bottom: 1rem;
            }

            .pixel-header h1 {
                font-size: 1.2rem;
                color: #00ff88;
                text-shadow: 0 0 10px #00ff88, 0 0 20px #0088ff;
                letter-spacing: 2px;
                margin-bottom: 0.5rem;
            }

            .pixel-header .subtitle {
                font-size: 0.6rem;
                color: #0088ff;
                letter-spacing: 1px;
                text-shadow: 0 0 5px #0088ff;
            }

            /* Pixel info table */
            .pixel-info {
                background: linear-gradient(180deg, rgba(0, 255, 136, 0.05), rgba(0, 136, 255, 0.05));
                border: 2px solid #0088ff;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 0.8rem;
                border-bottom: 2px dotted #00ff88;
                font-size: 0.7rem;
            }

            .info-row:last-child {
                border-bottom: none;
            }

            .info-label {
                color: #0088ff;
                font-weight: bold;
                text-shadow: 0 0 5px #0088ff;
            }

            .info-value {
                color: #00ff88;
                font-weight: bold;
                text-shadow: 0 0 10px #00ff88;
            }

            /* Pixel status indicator */
            .status-indicator {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: linear-gradient(90deg, #00ff88, #00ff66);
                color: #0a0e27;
                padding: 0.4rem 0.8rem;
                border: 2px solid #00ff88;
                box-shadow: 0 0 15px #00ff88;
                font-size: 0.65rem;
                font-weight: bold;
            }

            .pixel-dot {
                width: 8px;
                height: 8px;
                background: #00ff88;
                box-shadow: 0 0 10px #00ff88;
                animation: dotBlink 0.5s step-end infinite;
            }

            @keyframes dotBlink {
                0%, 49% { opacity: 1; }
                50%, 100% { opacity: 0.3; }
            }

            /* Pixel footer */
            .pixel-footer {
                text-align: center;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 2px dashed #0088ff;
                font-size: 0.6rem;
                color: #0088ff;
                text-shadow: 0 0 5px #0088ff;
            }

            .divider {
                display: inline-block;
                margin: 0 0.5rem;
                color: #00ff88;
            }

            /* Pixel transition effect */
            @keyframes pixelGlitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }

            .pixel-card:hover {
                animation: pixelGlitch 0.3s infinite;
            }

            /* Responsive */
            @media (max-width: 600px) {
                .pixel-card {
                    padding: 1rem;
                }
                .pixel-header h1 {
                    font-size: 0.9rem;
                }
                .info-row {
                    flex-direction: column;
                    gap: 0.3rem;
                }
            }

            /* Import pixel font */
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        </style>
    </head>
    <body>
        <div class="grid-bg"></div>
        <div class="stars" id="starsContainer"></div>
        
        <div class="pixel-planet"></div>
        <div class="pixel-meteor" style="top: 20%; left: 10%; animation-delay: 0s;"></div>
        <div class="pixel-meteor" style="top: 40%; right: 15%; animation-delay: 2s;"></div>
        <div class="pixel-meteor" style="bottom: 30%; left: 5%; animation-delay: 4s;"></div>

        <main class="pixel-card">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>

            <div class="pixel-header">
                <h1>⬢ PIXEL SERVER ⬢</h1>
                <div class="subtitle">> SPACE STATION ONLINE</div>
            </div>

            <div class="pixel-info">
                <div class="info-row">
                    <span class="info-label">รหัสนักศึกษา</span>
                    <span class="info-value">69319011594</span>
                </div>
                <div class="info-row">
                    <span class="info-label">ชื่อ-นามสกุล</span>
                    <span class="info-value">[YOUR NAME]</span>
                </div>
                <div class="info-row">
                    <span class="info-label">สาขา / ชั้นปี</span>
                    <span class="info-value">[YOUR INFO]</span>
                </div>
                <div class="info-row">
                    <span class="info-label">โปรเจค</span>
                    <span class="info-value">PIXEL WEB SERVER</span>
                </div>
                <div class="info-row">
                    <span class="info-label">สถานะ</span>
                    <span class="info-value">
                        <span class="status-indicator">
                            <span class="pixel-dot"></span> ONLINE
                        </span>
                    </span>
                </div>
            </div>

            <div class="pixel-footer">
                <span>⚡ PORT: ${PORT}</span>
                <span class="divider">|</span>
                <span>⏰ ${new Date().toLocaleString('th-TH')}</span>
            </div>
        </main>

        <script>
            // Generate random stars
            const starsContainer = document.getElementById('starsContainer');
            function createStars() {
                for (let i = 0; i < 50; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    star.style.left = Math.random() * 100 + '%';
                    star.style.top = Math.random() * 100 + '%';
                    star.style.animationDelay = Math.random() * 3 + 's';
                    starsContainer.appendChild(star);
                }
            }
            createStars();

            // Pixel scanline effect
            const style = document.createElement('style');
            style.textContent = \`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            \`;
            document.head.appendChild(style);
        </script>
    </body>
    </html>
    `;
    
    res.end(htmlOutput);
});

server.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
