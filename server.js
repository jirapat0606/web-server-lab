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
                background: radial-gradient(ellipse at 10% 20%, rgba(58,72,112,0.45) 0%, rgba(10,12,22,0.65) 35%, rgba(2,6,23,1) 100%);
                overflow: hidden;
            }

            /* Starfield */
            .stars, .twinkle {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            .stars::before, .stars::after {
                content: "";
                position: absolute;
                inset: 0;
                background: transparent;
                box-shadow:
                  30px 20px #fff,
                  120px 80px #fff,
                  200px 150px #fff,
                  260px 40px #fff,
                  420px 200px #fff,
                  60px 300px #fff,
                  360px 320px #fff,
                  520px 90px #fff,
                  700px 220px #fff,
                  820px 60px #fff;
                opacity: 0.6;
                filter: blur(0.4px);
            }
            .stars::after {
                transform: scale(0.6);
                opacity: 0.45;
                filter: blur(1px);
            }
            .twinkle::after {
                content: "";
                position: absolute;
                inset: 0;
                background:
                  radial-gradient(circle at 10% 20%, rgba(255,255,255,0.14) 0, transparent 10%),
                  radial-gradient(circle at 80% 30%, rgba(255,200,255,0.08) 0, transparent 12%),
                  radial-gradient(circle at 50% 70%, rgba(200,230,255,0.06) 0, transparent 15%);
                mix-blend-mode: screen;
                animation: twinkle 6s linear infinite;
                opacity: 0.9;
            }
            @keyframes twinkle {
                0% { transform: scale(1); opacity: 0.9; }
                50% { transform: scale(1.02); opacity: 0.6; }
                100% { transform: scale(1); opacity: 0.9; }
            }

            /* Nebula gradient */
            .nebula {
                position: absolute;
                width: 140%;
                height: 140%;
                left: -20%;
                top: -20%;
                background:
                    radial-gradient(30% 20% at 20% 20%, rgba(112, 48, 255, 0.12), transparent 10%),
                    radial-gradient(40% 30% at 80% 40%, rgba(14, 107, 255, 0.08), transparent 10%),
                    radial-gradient(30% 25% at 60% 75%, rgba(0, 200, 255, 0.06), transparent 10%);
                filter: blur(40px);
                mix-blend-mode: screen;
                opacity: 0.9;
                animation: floatNebula 30s linear infinite;
            }
            @keyframes floatNebula {
                0% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(3deg); }
                100% { transform: translateY(0) rotate(0deg); }
            }

            /* Main card (glass panel) */
            .card {
                position: relative;
                z-index: 10;
                width: min(820px, 92%);
                background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 8px 40px rgba(2,6,23,0.7), 0 1px 0 rgba(255,255,255,0.03) inset;
                border: 1px solid rgba(255,255,255,0.06);
                backdrop-filter: blur(6px) saturate(1.2);
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
                box-shadow: 0 12px 30px rgba(80,40,150,0.35), inset -12px -8px 30px rgba(255,255,255,0.06);
                position: relative;
                transform: rotate(-10deg);
                animation: planetFloat 6s ease-in-out infinite;
            }
            .planet::after {
                content: "";
                position: absolute;
                right: -12px;
                top: 40%;
                width: 50px;
                height: 18px;
                border-radius: 50%;
                background: radial-gradient(ellipse at center, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
                transform: rotate(-22deg);
            }
            @keyframes planetFloat {
                0% { transform: translateY(0) rotate(-10deg); }
                50% { transform: translateY(-8px) rotate(-8deg); }
                100% { transform: translateY(0) rotate(-10deg); }
            }

            /* Right: content */
            h1 {
                font-size: 1.35rem;
                color: #fff;
                margin-bottom: 0.45rem;
                letter-spacing: 0.6px;
            }
            .subtitle {
                color: #bcd6ff;
                font-size: 0.95rem;
                margin-bottom: 1rem;
            }
            .info {
                background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
                padding: 1rem;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.03);
            }
            .row {
                display: flex;
                justify-content: space-between;
                gap: 1rem;
                padding: 0.4rem 0;
                align-items: center;
                border-bottom: 1px dashed rgba(255,255,255,0.03);
            }
            .row:last-child { border-bottom: none; }

            .label { color: #9fb8ff; font-weight: 600; font-size: 0.92rem; }
            .value { color: #ffffff; font-weight: 700; font-size: 0.98rem; }

            .status {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.5rem 0.75rem;
                background: linear-gradient(90deg, rgba(40,220,140,0.12), rgba(10,150,100,0.08));
                color: #bfffe3;
                border-radius: 999px;
                font-weight: 700;
                font-size: 0.92rem;
                border: 1px solid rgba(40,220,140,0.12);
            }
            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, #ffffff, #14ff9e 50%, #00b86b 100%);
                box-shadow: 0 0 10px rgba(20,255,158,0.6);
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
        <div class="twinkle" aria-hidden="true"></div>
        <div class="nebula" aria-hidden="true"></div>

        <main class="card" role="main" aria-labelledby="title">
            <div class="panel" aria-hidden="false">
                <div class="planet" title="Planet"></div>
            </div>

            <section>
                <header>
                    <h1 id="title">ใบงานปฏิบัติการ: Web Server</h1>
                    <div class="subtitle">ธีม: อวกาศ — Galaxy UI</div>
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
    </body>
    </html>
    `;
    
    res.end(htmlOutput);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
