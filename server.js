const http = require('http');
// 1. เรียกใชงาน Pool จากไลบรารี pg สําหรับจัดการการเชื่อมตอฐานขอมูล
const { Pool } = require('pg');
// 2. ตั้งคาการเชื่อมตอ โดยดึง URL มาจาก Environment Variable ของ Railway
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html; charset=utf-8');

try {
// 3. ขอเชื่อมตอและสงคําสั่ง SQL ไปดึงขอมูลจากตาราง students
const client = await pool.connect();
const result = await client.query('SELECT * FROM students');
client.release(); // คนืการเชื่อมตอเมื่อใชงานเสร็จ
// 4. นําขอมูลที่ได(result.rows) มาประกอบเปนตาราง HTML
let html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ฐานขอมูลนักศึกษา - Galaxy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: radial-gradient(ellipse at 20% 50%, rgba(138, 43, 226, 0.8) 0%, rgba(75, 0, 130, 0.6) 15%, rgba(25, 25, 112, 0.9) 40%, #000a1a 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            position: relative;
        }

        /* Animated starfield background */
        .starfield {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
            pointer-events: none;
        }

        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        /* Galaxy nebula effects */
        .nebula {
            position: fixed;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.4;
            z-index: 2;
        }

        .nebula-1 {
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.6), transparent);
            top: 10%;
            left: 10%;
            animation: floatNebula 20s ease-in-out infinite;
        }

        .nebula-2 {
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(30, 144, 255, 0.5), transparent);
            top: 40%;
            right: 10%;
            animation: floatNebula 25s ease-in-out infinite reverse;
        }

        .nebula-3 {
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(255, 20, 147, 0.4), transparent);
            bottom: 15%;
            left: 50%;
            animation: floatNebula 30s ease-in-out infinite;
        }

        @keyframes floatNebula {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(30px) translateX(20px); }
        }

        /* Planets */
        .planet {
            position: fixed;
            border-radius: 50%;
            box-shadow: 0 0 30px rgba(255, 165, 0, 0.4), inset -10px -10px 30px rgba(0, 0, 0, 0.5);
            z-index: 3;
            animation: orbitPlanet 20s linear infinite;
        }

        .planet-1 {
            width: 120px;
            height: 120px;
            background: radial-gradient(circle at 30% 30%, #ff8c42, #d4631f);
            top: 15%;
            left: 8%;
            box-shadow: 0 0 40px rgba(255, 140, 66, 0.6), inset -10px -10px 20px rgba(0, 0, 0, 0.5);
        }

        .planet-2 {
            width: 90px;
            height: 90px;
            background: linear-gradient(135deg, #1e90ff 0%, #4169e1 50%, #191970 100%);
            top: 50%;
            right: 12%;
            box-shadow: 0 0 30px rgba(30, 144, 255, 0.5), inset -5px -5px 15px rgba(0, 0, 0, 0.6);
        }

        .planet-3 {
            width: 150px;
            height: 150px;
            background: radial-gradient(circle at 40% 40%, #ffa500, #d2691e);
            bottom: 20%;
            left: 15%;
            box-shadow: 0 0 50px rgba(255, 165, 0, 0.5), inset -15px -15px 30px rgba(0, 0, 0, 0.5);
        }

        .planet-4 {
            width: 70px;
            height: 70px;
            background: radial-gradient(circle at 25% 25%, #87ceeb, #4682b4);
            top: 25%;
            right: 20%;
            box-shadow: 0 0 25px rgba(70, 130, 180, 0.4), inset -5px -5px 10px rgba(0, 0, 0, 0.5);
        }

        @keyframes orbitPlanet {
            0% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
        }

        /* Main container */
        .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 40px;
            background: rgba(20, 20, 50, 0.8);
            border: 2px solid rgba(138, 43, 226, 0.5);
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(138, 43, 226, 0.3), 0 0 100px rgba(30, 144, 255, 0.2);
            position: relative;
            z-index: 10;
            backdrop-filter: blur(10px);
        }

        h1 {
            color: #00ffff;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(138, 43, 226, 0.5);
            letter-spacing: 3px;
            font-weight: 300;
        }

        .emoji-title {
            display: inline-block;
            font-size: 1.5em;
            margin: 0 10px;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        /* Table styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
            border-radius: 10px;
            overflow: hidden;
        }

        thead {
            background: linear-gradient(135deg, rgba(138, 43, 226, 0.6) 0%, rgba(30, 144, 255, 0.6) 100%);
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
        }

        th {
            color: #00ffff;
            padding: 20px;
            text-align: left;
            font-size: 1.1em;
            font-weight: 600;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
            border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        }

        td {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(0, 255, 255, 0.1);
            color: #e0e0ff;
            font-size: 0.95em;
            background: rgba(30, 30, 80, 0.3);
        }

        tbody tr {
            transition: all 0.3s ease;
        }

        tr:hover {
            background: rgba(138, 43, 226, 0.3) !important;
            box-shadow: inset 0 0 20px rgba(138, 43, 226, 0.2);
        }

        tr:nth-child(even) td {
            background: rgba(20, 20, 60, 0.4);
        }

        tr:last-child td {
            border-bottom: none;
        }

        /* Decoration elements */
        .decoration {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            font-size: 2.5em;
            gap: 20px;
        }

        .decoration span {
            animation: floatDeco 3s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.6));
        }

        .decoration span:nth-child(2) {
            animation-delay: 0.3s;
        }

        .decoration span:nth-child(3) {
            animation-delay: 0.6s;
        }

        .decoration span:nth-child(4) {
            animation-delay: 0.9s;
        }

        .decoration span:nth-child(5) {
            animation-delay: 1.2s;
        }

        @keyframes floatDeco {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        /* Status message */
        .status {
            text-align: center;
            color: #00ff88;
            margin-top: 20px;
            font-size: 1.1em;
            font-weight: 600;
            text-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
            animation: statusGlow 2s ease-in-out infinite;
        }

        @keyframes statusGlow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        /* Cosmic stats */
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 25px;
        }

        .stat-box {
            background: rgba(138, 43, 236, 0.2);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
        }

        .stat-label {
            color: #00ffff;
            font-size: 0.8em;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            margin-bottom: 5px;
        }

        .stat-value {
            color: #00ff88;
            font-size: 1.5em;
            font-weight: bold;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
        }
    </style>
</head>
<body>
    <!-- Starfield -->
    <div class="starfield" id="starfield"></div>

    <!-- Nebula effects -->
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>
    <div class="nebula nebula-3"></div>

    <!-- Planets -->
    <div class="planet planet-1"></div>
    <div class="planet planet-2"></div>
    <div class="planet planet-3"></div>
    <div class="planet planet-4"></div>

    <!-- Main content -->
    <div class="container">
        <h1>
            <span class="emoji-title">🌌</span>
            ฐานขอมูลนักศึกษา
            <span class="emoji-title">🚀</span>
        </h1>

        <table>
            <thead>
                <tr>
                    <th>🎓 รหัสนักศึกษา</th>
                    <th>👤 ชื่อ-นามสกุล</th>
                </tr>
            </thead>
            <tbody>`;
        
        result.rows.forEach(row => {
            html += `<tr><td>${row.student_id}</td><td>${row.tudent_name}</td></tr>`;
        });

        html += `
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
        </div>

        <div class="status">✨ ดึงข้อมูลสำเร็จ! ✨</div>

        <div class="decoration">
            <span>⭐</span>
            <span>💫</span>
            <span>✨</span>
            <span>🌠</span>
            <span>💎</span>
        </div>
    </div>

    <script>
        // Generate random stars
        function generateStars() {
            const starfield = document.getElementById('starfield');
            const numStars = 100;
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starfield.appendChild(star);
            }
        }
        generateStars();
    </script>
</body>
</html>`;
res.end(html);
} catch (err) {
// กรณเีชื่อมตอไมไดหรือเขียนชื่อตารางผิด
console.error(err);
res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Galaxy Error</title>
    <style>
        body {
            background: radial-gradient(ellipse at 20% 50%, rgba(138, 43, 226, 0.8) 0%, rgba(75, 0, 130, 0.6) 15%, rgba(25, 25, 112, 0.9) 40%, #000a1a 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            overflow: hidden;
        }

        .starfield {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
            pointer-events: none;
        }

        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .error-container {
            background: rgba(20, 20, 50, 0.9);
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(255, 0, 100, 0.4), 0 0 100px rgba(138, 43, 226, 0.2);
            max-width: 500px;
            text-align: center;
            position: relative;
            z-index: 10;
            border: 2px solid rgba(255, 0, 100, 0.3);
            backdrop-filter: blur(10px);
        }

        h1 {
            color: #ff1493;
            margin-bottom: 20px;
            font-size: 2.2em;
            text-shadow: 0 0 20px rgba(255, 20, 147, 0.8);
            letter-spacing: 2px;
        }

        p {
            color: #00ffff;
            line-height: 1.8;
            font-size: 1em;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .emoji {
            font-size: 4em;
            margin-bottom: 20px;
            filter: drop-shadow(0 0 20px rgba(255, 0, 100, 0.6));
        }

        .retry {
            color: #00ff88;
            font-size: 0.8em;
            margin-top: 30px;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="starfield" id="starfield"></div>

    <div class="error-container">
        <div class="emoji">🌌</div>
        <h1>SYSTEM ERROR</h1>
        <p>${err.message}</p>
        <div class="retry">↻ Attempting to reconnect to galaxy...</div>
    </div>

    <script>
        function generateStars() {
            const starfield = document.getElementById('starfield');
            const numStars = 100;
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starfield.appendChild(star);
            }
        }
        generateStars();
    </script>
</body>
</html>`);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
