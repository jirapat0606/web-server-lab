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
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            font-family: 'Press Start 2P', cursive;
            overflow-x: hidden;
            position: relative;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        }

        /* Pixel grid background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(0deg, transparent 24%, rgba(255, 0, 150, .05) 25%, rgba(255, 0, 150, .05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 150, .05) 75%, rgba(255, 0, 150, .05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255, 0, 150, .05) 25%, rgba(255, 0, 150, .05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 150, .05) 75%, rgba(255, 0, 150, .05) 76%, transparent 77%, transparent);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 1;
        }

        /* Pixel stars */
        .pixel-stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
        }

        .star {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ffff00;
            box-shadow: 0 0 10px #ffff00;
            animation: pixelBlink 0.5s infinite;
        }

        @keyframes pixelBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        /* Pixel clouds */
        .cloud {
            position: fixed;
            background: #e0e0e0;
            box-shadow: -5px 0 0 0 #e0e0e0, 5px 0 0 0 #e0e0e0, 0 -5px 0 0 #e0e0e0, 0 5px 0 0 #e0e0e0;
            image-rendering: pixelated;
            z-index: 3;
        }

        .cloud1 {
            width: 20px;
            height: 20px;
            top: 10%;
            left: 5%;
            animation: pixelFloat 20s infinite;
        }

        .cloud2 {
            width: 24px;
            height: 20px;
            top: 25%;
            right: 10%;
            animation: pixelFloat 25s infinite reverse;
        }

        .cloud3 {
            width: 22px;
            height: 18px;
            bottom: 15%;
            left: 50%;
            animation: pixelFloat 30s infinite;
            opacity: 0.8;
        }

        @keyframes pixelFloat {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(30px); }
        }

        /* Pixel Mario */
        .mario {
            position: fixed;
            font-size: 20px;
            z-index: 4;
            animation: pixelJump 1s infinite;
            filter: drop-shadow(2px 2px 0 #ff0000);
        }

        .mario1 {
            top: 20%;
            left: 5%;
        }

        .mario2 {
            top: 40%;
            right: 5%;
            animation: pixelJumpReverse 1s infinite;
            filter: drop-shadow(2px 2px 0 #0000ff);
        }

        @keyframes pixelJump {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        @keyframes pixelJumpReverse {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        /* Main container */
        .container {
            max-width: 900px;
            margin: 40px auto;
            padding: 30px;
            background: #ffee99;
            border: 4px solid #000;
            box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.5), -2px -2px 0 rgba(255, 255, 255, 0.5);
            position: relative;
            z-index: 10;
        }

        h1 {
            color: #000;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.5em;
            text-shadow: 3px 3px 0 #ff0000, 6px 6px 0 #0000ff;
            letter-spacing: 2px;
        }

        /* Table styling - 8 bit style */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #ffffff;
            border: 3px solid #000;
        }

        th {
            background: #0000ff;
            color: #ffff00;
            padding: 15px;
            text-align: left;
            font-size: 0.8em;
            border: 2px solid #000;
            text-shadow: 2px 2px 0 #000;
        }

        td {
            padding: 12px 15px;
            border: 2px solid #000;
            color: #000;
            font-size: 0.7em;
            background: #ffffff;
        }

        tr:nth-child(even) td {
            background: #e0e0ff;
        }

        tr:hover td {
            background: #ffcc00;
            transition: none;
        }

        /* Pixel decorations */
        .decoration {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            font-size: 30px;
            gap: 10px;
        }

        .decoration span {
            animation: pixelBounce 0.6s infinite;
            filter: drop-shadow(3px 3px 0 #000);
        }

        .decoration span:nth-child(2) {
            animation-delay: 0.1s;
        }

        .decoration span:nth-child(3) {
            animation-delay: 0.2s;
        }

        .decoration span:nth-child(4) {
            animation-delay: 0.3s;
        }

        .decoration span:nth-child(5) {
            animation-delay: 0.4s;
        }

        @keyframes pixelBounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        /* Status message */
        .status {
            text-align: center;
            color: #ff0000;
            margin-top: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-shadow: 2px 2px 0 #000;
            animation: pixelFlash 0.8s infinite;
        }

        @keyframes pixelFlash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        /* Power-up style box */
        .power-up {
            background: #ff0000;
            border: 3px solid #000;
            padding: 10px;
            margin-top: 20px;
            text-align: center;
            color: #ffff00;
            font-size: 0.7em;
            text-shadow: 2px 2px 0 #000;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
        }

        /* Score counter style */
        .score {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: #ffff00;
            padding: 10px 20px;
            border: 3px solid #ffff00;
            font-size: 0.6em;
            z-index: 20;
            text-shadow: 2px 2px 0 #ff0000;
            box-shadow: 5px 5px 0 rgba(255, 255, 255, 0.5);
        }

        /* Game Over style error */
        .game-over {
            animation: pixelShake 0.2s infinite;
        }

        @keyframes pixelShake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-5px, -5px); }
            50% { transform: translate(5px, 5px); }
            75% { transform: translate(-5px, 5px); }
        }
    </style>
</head>
<body>
    <!-- Pixel score counter -->
    <div class="score">SCORE: ${result.rows.length * 100}</div>

    <!-- Pixel stars -->
    <div class="pixel-stars">
        <div class="star" style="top: 10%; left: 10%;"></div>
        <div class="star" style="top: 15%; left: 25%;"></div>
        <div class="star" style="top: 20%; left: 40%;"></div>
        <div class="star" style="top: 25%; left: 55%;"></div>
        <div class="star" style="top: 30%; left: 70%;"></div>
        <div class="star" style="top: 35%; left: 85%;"></div>
    </div>

    <!-- Pixel clouds -->
    <div class="cloud cloud1"></div>
    <div class="cloud cloud2"></div>
    <div class="cloud cloud3"></div>
    
    <!-- Mario characters -->
    <div class="mario mario1">🔴</div>
    <div class="mario mario2">🔵</div>

    <!-- Main content -->
    <div class="container">
        <h1>
            ★ ฐานขอมูลนักศึกษา ★
        </h1>

        <table>
            <thead>
                <tr>
                    <th>รหัสนักศึกษา</th>
                    <th>ชื่อ-นามสกุล</th>
                </tr>
            </thead>
            <tbody>`;
        
        result.rows.forEach(row => {
            html += `<tr><td>${row.student_id}</td><td>${row.tudent_name}</td></tr>`;
        });

        html += `
            </tbody>
        </table>

        <div class="power-up">LEVEL UP! ✓</div>

        <div class="status">★ Game Over ! ★</div>

        <div class="decoration">
            <span>⭐</span>
            <span>💎</span>
            <span>🏆</span>
            <span>⚡</span>
            <span>💫</span>
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
    <title>GAME OVER</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        body {
            background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Press Start 2P', cursive;
            image-rendering: pixelated;
        }
        
        .error-container {
            background: #000;
            border: 4px solid #ff0000;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            box-shadow: 10px 10px 0 rgba(255, 0, 0, 0.5), -5px -5px 0 rgba(255, 255, 0, 0.3);
        }

        h1 {
            color: #ff0000;
            margin-bottom: 20px;
            font-size: 1.2em;
            text-shadow: 3px 3px 0 #ffff00, 6px 6px 0 #ff00ff;
            animation: gameOverFlash 0.5s infinite;
            letter-spacing: 2px;
        }

        p {
            color: #ffff00;
            line-height: 1.6;
            font-size: 0.6em;
            text-shadow: 2px 2px 0 #ff0000;
            margin-top: 20px;
        }

        .emoji {
            font-size: 60px;
            margin-bottom: 20px;
            animation: pixelShake 0.2s infinite;
        }

        .retry {
            color: #00ff00;
            font-size: 0.5em;
            margin-top: 30px;
            animation: pixelBlink 0.8s infinite;
        }

        @keyframes gameOverFlash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @keyframes pixelBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        @keyframes pixelShake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-5px, -5px); }
            50% { transform: translate(5px, 5px); }
            75% { transform: translate(-5px, 5px); }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="emoji">💀</div>
        <h1>GAME OVER!</h1>
        <p>${err.message}</p>
        <div class="retry">PRESS F5 TO CONTINUE</div>
    </div>
</body>
</html>`);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
