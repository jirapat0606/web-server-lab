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
    <title>ฐานขอมูลนักศึกษา</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%);
            min-height: 100vh;
            font-family: 'Arial', sans-serif;
            overflow-x: hidden;
            position: relative;
        }

        /* Animated stars */
        .star {
            position: fixed;
            background: white;
            border-radius: 50%;
            opacity: 0.8;
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        /* Clouds */
        .cloud {
            position: fixed;
            background: white;
            border-radius: 100px;
            opacity: 0.85;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .cloud::before,
        .cloud::after {
            content: '';
            position: absolute;
            background: white;
            border-radius: 100px;
        }

        .cloud1 {
            width: 100px;
            height: 40px;
            top: 10%;
            left: 5%;
            animation: float 20s infinite;
        }

        .cloud1::before {
            width: 50px;
            height: 50px;
            top: -25px;
            left: 10px;
        }

        .cloud1::after {
            width: 60px;
            height: 40px;
            top: -15px;
            right: 10px;
        }

        .cloud2 {
            width: 120px;
            height: 45px;
            top: 25%;
            right: 10%;
            animation: float 25s infinite reverse;
        }

        .cloud2::before {
            width: 60px;
            height: 60px;
            top: -30px;
            left: 15px;
        }

        .cloud2::after {
            width: 70px;
            height: 45px;
            top: -20px;
            right: 15px;
        }

        .cloud3 {
            width: 110px;
            height: 42px;
            bottom: 15%;
            left: 50%;
            animation: float 30s infinite;
            opacity: 0.7;
        }

        .cloud3::before {
            width: 55px;
            height: 55px;
            top: -27px;
            left: 12px;
        }

        .cloud3::after {
            width: 65px;
            height: 42px;
            top: -17px;
            right: 12px;
        }

        @keyframes float {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(30px); }
        }

        /* Birds */
        .bird {
            position: fixed;
            font-size: 30px;
            animation: fly 15s infinite;
        }

        .bird1 {
            top: 20%;
            left: 0%;
            animation: fly 15s infinite linear;
        }

        .bird2 {
            top: 40%;
            right: 0%;
            animation: fly-reverse 20s infinite linear;
        }

        @keyframes fly {
            0% { transform: translateX(-50px); }
            100% { transform: translateX(100vw); }
        }

        @keyframes fly-reverse {
            0% { transform: translateX(50px); }
            100% { transform: translateX(-100vw); }
        }

        /* Main container */
        .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 30px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 10;
            backdrop-filter: blur(10px);
        }

        h1 {
            color: #4A90E2;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .emoji-title {
            display: inline-block;
            font-size: 1.5em;
            margin: 0 10px;
        }

        /* Table styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 15px;
            overflow: hidden;
        }

        th {
            background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
            color: white;
            padding: 20px;
            text-align: left;
            font-size: 1.1em;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        td {
            padding: 18px 20px;
            border-bottom: 2px solid #E0F0FF;
            color: #333;
            font-size: 1em;
        }

        tr:hover {
            background-color: #F0F8FF;
            transition: background-color 0.3s ease;
        }

        tr:last-child td {
            border-bottom: none;
        }

        /* Cute decorative elements */
        .decoration {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            font-size: 2em;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .decoration span {
            animation: bounce 2s infinite;
        }

        .decoration span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .decoration span:nth-child(3) {
            animation-delay: 0.4s;
        }

        .decoration span:nth-child(4) {
            animation-delay: 0.6s;
        }

        .decoration span:nth-child(5) {
            animation-delay: 0.8s;
        }

        /* Status message */
        .status {
            text-align: center;
            color: #4A90E2;
            margin-top: 20px;
            font-size: 1.1em;
            font-weight: bold;
        }

        /* Rainbow gradient effect */
        .rainbow {
            background: linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #9D84B7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Sky elements -->
    <div class="cloud cloud1"></div>
    <div class="cloud cloud2"></div>
    <div class="cloud cloud3"></div>
    
    <div class="bird bird1">🐦</div>
    <div class="bird bird2">🕊️</div>

    <!-- Main content -->
    <div class="container">
        <h1>
            <span class="emoji-title">☁️</span>
            ฐานขอมูลนักศึกษา
            <span class="emoji-title">🌤️</span>
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

        <div class="status">✨ ดึงข้อมูลสำเร็จ! ✨</div>

        <div class="decoration">
            <span>🌈</span>
            <span>⭐</span>
            <span>💫</span>
            <span>✨</span>
            <span>🌟</span>
        </div>
    </div>
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
    <title>เกิดข้อผิดพลาด</title>
    <style>
        body {
            background: linear-gradient(135deg, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', sans-serif;
        }
        
        .error-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            max-width: 500px;
            text-align: center;
        }

        h1 {
            color: #E74C3C;
            margin-bottom: 20px;
            font-size: 2em;
        }

        p {
            color: #555;
            line-height: 1.6;
        }

        .emoji {
            font-size: 3em;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="emoji">😢</div>
        <h1>เกิดข้อผิดพลาด!</h1>
        <p>${err.message}</p>
    </div>
</body>
</html>`);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
