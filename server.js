const http = require('http');

// Render จะกำหนด Port มาให้ผ่าน process.env.PORT อัตโนมัติ
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // ตั้งค่า Header ให้ตอบกลับเป็น HTML และรองรับภาษาไทย (UTF-8)
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    
    // หน้าตาหน้าเว็บธีมอวกาศ
    const htmlOutput = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Server Assignment - Space Theme</title>
        <style>
            /* Reset */
            * { box-sizing: border-box; margin: 0; padding: 0; }

            /* ฟอนต์ระบบ (ไทย/อังกฤษ) */
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial;
                min-height: 100vh;
                color: #e6f0ff;
                display: flex;
                align-items: center;
                justify-content: center;
                background: radial-gradient(ellipse at 10% 20%, rgba(20,30,80,0.8) 0%, rgba(5,5,25,0.95) 35%, rgba(0,0,15,1) 100%);
                overflow: hidden;
                position: relative;
            }

            /* Deep space background */
            body::before {
                content: "";
                position: fixed;
                inset: 0;
                background: 
                    radial-gradient(circle at 20% 30%, rgba(100, 50, 200, 0.15), transparent 25%),
                    radial-gradient(circle at 80% 70%, rgba(20, 150, 200, 0.12), transparent 30%),
                    radial-gradient(circle at 50% 50%, rgba(150, 100, 255, 0.08), transparent 40%);
                pointer-events: none;
                z-index: 0;
                animation: cosmicPulse 20s ease-in-out infinite;
            }

            @keyframes cosmicPulse {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1.2; }
            }

            /* Starfield - Dense */
            .stars {
                position: fixed;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            .stars::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image: 
                    radial-gradient(2px 2px at 20px 30px, #eee, rgba(238,238,238,0)),
                    radial-gradient(2px 2px at 60px 70px, #fff, rgba(255,255,255,0)),
                    radial-gradient(1px 1px at 50px 50px, #ddd, rgba(221,221,221,0)),
                    radial-gradient(1px 1px at 130px 80px, #fff, rgba(255,255,255,0)),
                    radial-gradient(2px 2px at 90px 10px, #eee, rgba(238,238,238,0));
                background-repeat: repeat;
                background-size: 200px 200px;
                animation: twinkleStar 5s linear infinite;
            }

            .stars::after {
                content: "";
                position: absolute;
                inset: 0;
                background-image: 
                    radial-gradient(1px 1px at 10px 20px, #fff, rgba(255,255,255,0)),
                    radial-gradient(1px 1px at 40px 60px, #eee, rgba(238,238,238,0)),
                    radial-gradient(2px 2px at 130px 40px, #fff, rgba(255,255,255,0)),
                    radial-gradient(1px 1px at 90px 100px, #ddd, rgba(221,221,221,0)),
                    radial-gradient(1px 1px at 180px 20px, #fff, rgba(255,255,255,0));
                background-repeat: repeat;
                background-size: 250px 250px;
                animation: twinkleStar 7s linear infinite reverse;
            }

            @keyframes twinkleStar {
                0% { opacity: 0.5; }
                50% { opacity: 1; }
                100% { opacity: 0.5; }
            }

            /* Nebula gradient */
            .nebula {
                position: fixed;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2;
            }

            .nebula::before {
                content: "";
                position: absolute;
                inset: -50%;
                background:
                    radial-gradient(ellipse 800px 400px at 20% 30%, rgba(138, 43, 226, 0.25), transparent 30%),
                    radial-gradient(ellipse 900px 500px at 80% 60%, rgba(30, 144, 255, 0.2), transparent 35%),
                    radial-gradient(ellipse 600px 600px at 50% 50%, rgba(0, 191, 255, 0.15), transparent 40%),
                    radial-gradient(ellipse 700px 300px at 70% 20%, rgba(255, 20, 147, 0.12), transparent 35%);
                filter: blur(60px);
                mix-blend-mode: screen;
                animation: floatNebula 40s ease-in-out infinite;
            }

            @keyframes floatNebula {
                0% { transform: translateY(0) translateX(0) rotate(0deg); }
                33% { transform: translateY(-30px) translateX(20px) rotate(2deg); }
                66% { transform: translateY(20px) translateX(-30px) rotate(-2deg); }
                100% { transform: translateY(0) translateX(0) rotate(0deg); }
            }

            /* Meteors/Shooting Stars */
            .meteor-container {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 3;
            }

            .meteor {
                position: absolute;
                width: 2px;
                height: 50px;
                background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(100,200,255,0), rgba(100,200,255,0));
                box-shadow: 0 0 15px rgba(100,200,255,0.8);
                animation: shootMeteor linear infinite;
            }

            @keyframes shootMeteor {
                0% {
                    opacity: 1;
                    transform: translateX(0) translateY(0) rotate(-45deg);
                }
                100% {
                    opacity: 0;
                    transform: translateX(500px) translateY(500px) rotate(-45deg);
                }
            }

            /* Main card (glass panel) */
            .card {
                position: relative;
                z-index: 10;
                width: min(820px, 92%);
                background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 
                    0 8px 40px rgba(0,0,0,0.8), 
                    0 1px 0 rgba(255,255,255,0.05) inset,
                    0 0 40px rgba(138, 43, 226, 0.15);
                border: 1.5px solid rgba(138, 43, 226, 0.3);
                backdrop-filter: blur(10px) saturate(1.5);
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 1.25rem;
                align-items: center;
            }

            /* Left: illustration */
            .panel {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.6rem;
            }

            .planet {
                width: 160px;
                height: 160px;
                border-radius: 50%;
                background: radial-gradient(circle at 35% 30%, #ffd07a 0%, #ff9b5b 12%, #d963ff 55%, #5a2ad1 100%);
                box-shadow: 
                    0 0 60px rgba(138, 43, 226, 0.6),
                    0 20px 50px rgba(80,40,150,0.5), 
                    inset -12px -8px 30px rgba(255,255,255,0.1);
                position: relative;
                transform: rotate(-10deg);
                animation: planetFloat 6s ease-in-out infinite;
            }

            .planet::before {
                content: "";
                position: absolute;
                inset: -15px;
                border-radius: 50%;
                background: radial-gradient(circle, transparent 60%, rgba(138, 43, 226, 0.2), transparent 100%);
                animation: planetGlow 3s ease-in-out infinite;
            }

            .planet::after {
                content: "";
                position: absolute;
                right: -12px;
                top: 40%;
                width: 50px;
                height: 18px;
                border-radius: 50%;
                background: radial-gradient(ellipse at center, rgba(255,255,255,0.15), rgba(255,255,255,0.02));
                transform: rotate(-22deg);
            }

            @keyframes planetFloat {
                0% { transform: translateY(0) rotate(-10deg); }
                50% { transform: translateY(-12px) rotate(-8deg); }
                100% { transform: translateY(0) rotate(-10deg); }
            }

            @keyframes planetGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.4); }
                50% { box-shadow: 0 0 40px rgba(138, 43, 226, 0.8); }
            }

            /* Right: content */
            h1 {
                font-size: 1.35rem;
                color: #fff;
                margin-bottom: 0.45rem;
                letter-spacing: 0.6px;
                text-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
            }

            .subtitle {
                color: #bcd6ff;
                font-size: 0.95rem;
                margin-bottom: 1rem;
            }

            .info {
                background: linear-gradient(180deg, rgba(138, 43, 226, 0.08), rgba(30, 144, 255, 0.04));
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid rgba(138, 43, 226, 0.15);
            }

            .row {
                display: flex;
                justify-content: space-between;
                gap: 1rem;
                padding: 0.4rem 0;
                align-items: center;
                border-bottom: 1px dashed rgba(138, 43, 226, 0.1);
            }
            .row:last-child { border-bottom: none; }

            .label { color: #9fb8ff; font-weight: 600; font-size: 0.92rem; }
            .value { color: #ffffff; font-weight: 700; font-size: 0.98rem; }

            .status {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.5rem 0.75rem;
                background: linear-gradient(90deg, rgba(0, 255, 150, 0.2), rgba(0, 200, 150, 0.1));
                color: #7fffd4;
                border-radius: 999px;
                font-weight: 700;
                font-size: 0.92rem;
                border: 1px solid rgba(0, 255, 150, 0.3);
                box-shadow: 0 0 15px rgba(0, 255, 150, 0.2);
            }

            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, #ffffff, #00ff96 50%, #00b86b 100%);
                box-shadow: 0 0 15px rgba(0, 255, 150, 0.8);
                animation: dotPulse 2s ease-in-out infinite;
            }

            @keyframes dotPulse {
                0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 150, 0.8); }
                50% { box-shadow: 0 0 25px rgba(0, 255, 150, 1); }
            }

            /* Footer small */
            .meta {
                margin-top: 1rem;
                color: #98b8e6;
                font-size: 0.85rem;
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            /* Responsive */
            @media (max-width: 720px) {
                .card { grid-template-columns: 1fr; padding: 1.25rem; gap: 0.9rem; }
                .panel { order: 2; }
            }
        </style>
    </head>
    <body>
        <div class="stars" aria-hidden="true"></div>
        <div class="nebula" aria-hidden="true"></div>
        <div class="meteor-container" id="meteorContainer" aria-hidden="true"></div>

        <main class="card" role="main" aria-labelledby="title">
            <div class="panel" aria-hidden="false">
                <div class="planet" title="Planet"></div>
            </div>

            <section>
                <header>
                    <h1 id="title">ใบงานปฏิบัติการ: Web Server</h1>
                    <div class="subtitle">ธีม: อวกาศ — Galaxy UI Enhanced</div>
                </header>

                <div class="info" role="region" aria-label="ข้อมูลนักศึกษา">
                    <div class="row">
                        <div class="label">รหัสนักศึกษา</div>
                        <div class="value">69319011594</div>
                    </div>
                    <div class="row">
                        <div class="label">ชื่อ-นามสกุล</div>
                        <div class="value">[เติมชื่อของคุณ]</div>
                    </div>
                    <div class="row">
                        <div class="label">สาขา / ชั้นปี</div>
                        <div class="value">[เติมข้อมูล]</div>
                    </div>
                    <div class="row">
                        <div class="label">โปรเจค</div>
                        <div class="value">Web Server Assignment</div>
                    </div>
                    <div class="row">
                        <div class="label">สถานะเซิร์ฟเวอร์</div>
                        <div class="value"><span class="status"><span class="dot" aria-hidden="true"></span> Server Online</span></div>
                    </div>

                    <div class="meta">
                        <div>พอร์ต: ${PORT}</div>
                        <div>เวลา: ${new Date().toLocaleString('th-TH')}</div>
                    </div>
                </div>
            </section>
        </main>

        <script>
            // Create random meteors
            const meteorContainer = document.getElementById('meteorContainer');
            
            function createMeteor() {
                const meteor = document.createElement('div');
                meteor.className = 'meteor';
                
                const startX = Math.random() * window.innerWidth;
                const startY = Math.random() * (window.innerHeight * 0.6);
                const duration = 1 + Math.random() * 1.5;
                
                meteor.style.left = startX + 'px';
                meteor.style.top = startY + 'px';
                meteor.style.animationDuration = duration + 's';
                meteor.style.opacity = Math.random() * 0.7 + 0.3;
                
                meteorContainer.appendChild(meteor);
                
                setTimeout(() => meteor.remove(), duration * 1000);
            }
            
            // Create meteors periodically
            setInterval(createMeteor, 2000);
            
            // Create initial meteors
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createMeteor(), i * 500);
            }
        </script>
    </body>
    </html>
    `;
    
    res.end(htmlOutput);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
