const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    try {
        // 1. เชื่อมต่อฐานข้อมูลและดึงข้อมูลนักศึกษา
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM students');
        client.release();

        // 2. วนลูปนำข้อมูล (result.rows) มาสร้างเป็นแถวของตาราง HTML
        let studentRows = '';
        result.rows.forEach(row => {
            studentRows += `<tr><td>${row.student_id}</td><td>${row.tudent_name}</td></tr>`;
        });

        // 3. รวมสไตล์ Kawaii Blue และโครงสร้าง HTML ทั้งหมดไว้ในไฟล์เดียว
        const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ฐานข้อมูลนักศึกษา - Kawaii Blue</title>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #bae6fd 100%);
            min-height: 100vh;
            font-family: 'Kanit', 'Segoe UI', sans-serif;
            overflow-x: hidden;
            position: relative;
            color: #334155;
        }

        /* ☁️ Background Clouds */
        .cloud-bg { position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 0; pointer-events: none; }
        .cloud {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50px;
            filter: blur(10px);
            animation: floatCloud linear infinite;
        }
        .cloud-1 { width: 300px; height: 100px; top: 10%; left: -100px; animation-duration: 35s; }
        .cloud-2 { width: 450px; height: 120px; top: 40%; right: -150px; animation-duration: 45s; animation-direction: reverse; }
        .cloud-3 { width: 250px; height: 80px; bottom: 15%; left: -50px; animation-duration: 28s; }

        @keyframes floatCloud {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
        }

        /* ✨ Floating Kawaii Icons */
        .floating-icon {
            position: fixed;
            font-size: 2rem;
            z-index: 1;
            opacity: 0.7;
            animation: bounce 4s ease-in-out infinite;
            pointer-events: none;
        }
        .icon-1 { top: 15%; left: 8%; animation-delay: 0s; }
        .icon-2 { top: 25%; right: 10%; animation-delay: 1s; }
        .icon-3 { bottom: 20%; left: 12%; animation-delay: 2s; }
        .icon-4 { bottom: 15%; right: 15%; animation-delay: 1.5s; }

        @keyframes bounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(10deg); }
        }

        /* 📦 Main Container */
        .container {
            max-width: 900px;
            margin: 60px auto;
            padding: 40px;
            background: rgba(255, 255, 255, 0.85);
            border: 3px solid #7dd3fc;
            border-radius: 30px;
            box-shadow: 0 20px 40px rgba(56, 189, 248, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 10;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .container:hover {
            box-shadow: 0 25px 50px rgba(56, 189, 248, 0.25);
        }

        /* 🎀 Header Title */
        h1 {
            color: #0284c7;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            font-weight: 600;
            letter-spacing: 1px;
            text-shadow: 2px 2px 0px #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .emoji-title {
            display: inline-block;
            font-size: 1.2em;
            animation: pulseEmoji 2s ease-in-out infinite;
        }
        @keyframes pulseEmoji {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }

        /* 📑 Table Styling */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 20px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(186, 230, 253, 0.5);
            background: #ffffff;
        }
        thead {
            background: linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%);
        }
        th {
            color: #ffffff;
            padding: 18px 20px;
            text-align: left;
            font-size: 1.1em;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        td {
            padding: 16px 20px;
            border-bottom: 1px solid #f0f9ff;
            color: #475569;
            font-size: 1em;
            transition: all 0.2s ease;
        }
        tbody tr {
            transition: background-color 0.2s ease;
        }
        tbody tr:hover {
            background-color: #e0f2fe;
        }
        tbody tr:hover td {
            color: #0369a1;
            font-weight: 600;
        }
        tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }
        tbody tr:last-child td {
            border-bottom: none;
        }

        /* 📊 Stats Section */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px dashed #bae6fd;
        }
        .stat-box {
            background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
            border: 2px solid #38bdf8;
            border-radius: 20px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 8px 15px rgba(56, 189, 248, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px rgba(56, 189, 248, 0.18);
        }
        .stat-label {
            color: #0284c7;
            font-size: 0.85em;
            margin-bottom: 8px;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .stat-value {
            color: #38bdf8;
            font-size: 2.2em;
            font-weight: bold;
        }

        /* 🌸 Status Text */
        .status {
            text-align: center;
            color: #38bdf8;
            margin-top: 30px;
            font-size: 1.2em;
            font-weight: 600;
            animation: softBreathe 3s ease-in-out infinite;
        }
        @keyframes softBreathe {
            0%, 100% { opacity: 0.7; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); }
        }

        /* 🧸 Bottom Decoration Icons */
        .decoration {
            display: flex;
            justify-content: center;
            margin-top: 25px;
            font-size: 2.2em;
            gap: 25px;
        }
        .decoration span {
            display: inline-block;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }
        .decoration span:hover {
            transform: scale(1.4) rotate(15deg);
        }
    </style>
</head>
<body>
    <!-- Background Clouds -->
    <div class="cloud-bg">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
    </div>

    <!-- Floating Kawaii Elements -->
    <div class="floating-icon icon-1">☁️</div>
    <div class="floating-icon icon-2">🎀</div>
    <div class="floating-icon icon-3">🐬</div>
    <div class="floating-icon icon-4">✨</div>

    <div class="container">
        <h1>
            <span class="emoji-title">🩵</span>
            ฐานข้อมูลนักศึกษา
            <span class="emoji-title">☁️</span>
        </h1>
        <table>
            <thead>
                <tr>
                    <th>🎓 รหัสนักศึกษา</th>
                    <th>👤 ชื่อ-นามสกุล</th>
                </tr>
            </thead>
            <tbody>
                ${studentRows}
            </tbody>
        </table>

        <div class="stats">
            <div class="stat-box">
                <div class="stat-label">TOTAL RECORDS</div>
                <div class="stat-value">${result.rows.length}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">STATUS</div>
                <div class="stat-value">✓</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">CONNECTION</div>
                <div class="stat-value">LIVE</div>
            </div>
        </div>

        <div class="status">✨ Ready to serve cuteness! ✨</div>

        <div class="decoration">
            <span>⭐</span>
            <span>🧸</span>
            <span>🎀</span>
            <span>🐬</span>
            <span>💎</span>
        </div>
    </div>

    <script>
        // ประกายวิ้งๆ เวลาขยับเมาส์
        document.addEventListener('mousemove', function(e) {
            if (Math.random() < 0.1) {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'fixed';
                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top = e.clientY + 'px';
                sparkle.style.fontSize = (Math.random() * 15 + 10) + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '999';
                sparkle.style.transition = 'all 1s ease-out';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.style.transform = \`translate(\${(Math.random() - 0.5) * 30}px, \${(Math.random() - 0.5) * 30}px) scale(0)\`;
                    sparkle.style.opacity = '0';
                }, 50);

                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }
        });
    </script>
</body>
</html>
        `;

        res.end(html);

    } catch (err) {
        console.error(err);
        res.end(`<h1>เกิดข้อผิดพลาด!</h1><p>${err.message}</p>`);
    }
});

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
