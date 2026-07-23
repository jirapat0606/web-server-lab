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
  <title>ฐานขอมูลนักศึกษา - Minecraft Style</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Minecraft', 'Press Start 2P', monospace;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 20px 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    /* Sky */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%);
      z-index: -2;
    }
    
    /* Grass and dirt ground */
    body::after {
      content: '';
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, #90EE90 0%, #7CB342 50%, #6D4C41 100%);
      z-index: -2;
    }
    
    /* Clouds */
    .cloud {
      position: fixed;
      background: white;
      border-radius: 50px;
      opacity: 0.9;
      z-index: 1;
    }
    
    .cloud1 {
      width: 120px;
      height: 40px;
      top: 10%;
      left: 5%;
      animation: float 20s infinite;
    }
    
    .cloud2 {
      width: 150px;
      height: 50px;
      top: 20%;
      right: 5%;
      animation: float 25s infinite reverse;
    }
    
    .cloud3 {
      width: 100px;
      height: 35px;
      top: 15%;
      left: 50%;
      animation: float 22s infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(30px); }
    }
    
    .container {
      background: #1a1a1a;
      border: 4px solid #8B4513;
      padding: 40px;
      max-width: 900px;
      width: 100%;
      position: relative;
      z-index: 10;
      box-shadow: 
        0 0 0 8px #654321,
        0 20px 0 0 rgba(0, 0, 0, 0.3);
      border-image: linear-gradient(135deg, #D2B48C, #8B4513) 1;
    }
    
    h1 {
      color: #FFD700;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2em;
      text-shadow: 3px 3px 0 #000, 6px 6px 0 rgba(0, 0, 0, 0.5);
      letter-spacing: 3px;
      font-weight: bold;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: #2d2d2d;
    }
    
    thead {
      background: linear-gradient(180deg, #CD853F 0%, #8B4513 100%);
      color: #FFFACD;
      border: 3px solid #654321;
    }
    
    th {
      padding: 15px;
      text-align: left;
      font-weight: bold;
      font-size: 1em;
      letter-spacing: 2px;
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      border-right: 2px solid #654321;
    }
    
    th:last-child {
      border-right: none;
    }
    
    tbody tr {
      border-bottom: 3px solid #654321;
      transition: all 0.1s ease;
      background: #2d2d2d;
    }
    
    tbody tr:hover {
      background: #3a3a3a;
      transform: translateY(-2px);
      box-shadow: inset 0 0 10px rgba(205, 133, 63, 0.3);
    }
    
    tbody tr:nth-child(odd) {
      background: #1a1a1a;
    }
    
    tbody tr:nth-child(odd):hover {
      background: #252525;
    }
    
    tbody tr:last-child {
      border-bottom: 3px solid #654321;
    }
    
    td {
      padding: 15px;
      color: #E0E0E0;
      font-size: 0.95em;
      border-right: 1px solid #654321;
      font-family: 'Courier New', monospace;
    }
    
    td:last-child {
      border-right: none;
    }
    
    /* Pixel art style */
    @supports (-webkit-appearance:none) {
      th, td {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
    }
    
    @media (max-width: 600px) {
      .container {
        padding: 20px;
        border-width: 3px;
      }
      
      h1 {
        font-size: 1.4em;
      }
      
      table {
        font-size: 0.9em;
      }
      
      th, td {
        padding: 10px;
        font-size: 0.9em;
      }
      
      .cloud1 { width: 80px; height: 30px; }
      .cloud2 { width: 100px; height: 35px; }
      .cloud3 { width: 70px; height: 25px; }
    }
  </style>
</head>
<body>
  <div class="cloud cloud1"></div>
  <div class="cloud cloud2"></div>
  <div class="cloud cloud3"></div>
  
  <div class="container">
    <h1>⛏️ ฐานขอมูลนักศึกษา ⛏️</h1>
    <table>
      <thead>
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>ชื่อ-นามสกุล</th>
        </tr>
      </thead>
      <tbody>
`;

// วนลูปนําขอมูลแตละแถวมาแสดง
result.rows.forEach(row => {
html += \`<tr><td>\${row.student_id}</td><td>\${row.tudent_name}</td></tr>\`;
});

html += \`
      </tbody>
    </table>
  </div>
</body>
</html>
\`;

res.end(html);
} catch (err) {
// กรณเีชื่อมตอไมไดหรือเขียนชื่อตารางผิด
console.error(err);
res.end(\`
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เกิดข้อผิดพลาด - Minecraft</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Minecraft', 'Press Start 2P', monospace;
      background: linear-gradient(180deg, #FF6B6B 0%, #FFB3B3 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(180deg, #FF6B6B 0%, #FFB3B3 100%);
      z-index: -1;
    }
    
    body::after {
      content: '';
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, #FFB3B3 0%, #D32F2F 50%, #8B0000 100%);
      z-index: -1;
    }
    
    .error-container {
      background: #1a1a1a;
      border: 4px solid #8B0000;
      padding: 40px;
      max-width: 600px;
      text-align: center;
      box-shadow: 
        0 0 0 8px #660000,
        0 20px 0 0 rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 10;
    }
    
    h1 {
      color: #FF4444;
      margin-bottom: 20px;
      font-size: 1.8em;
      text-shadow: 3px 3px 0 #000, 6px 6px 0 rgba(0, 0, 0, 0.5);
      letter-spacing: 2px;
    }
    
    p {
      color: #E0E0E0;
      font-size: 0.9em;
      line-height: 1.6;
      background: rgba(139, 0, 0, 0.3);
      padding: 20px;
      border: 3px solid #8B0000;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>💥 ข้อผิดพลาด! 💥</h1>
    <p>\${err.message}</p>
  </div>
</body>
</html>
\`);
}
});
server.listen(port, () => {
console.log(\`Server is running on port: \${port}\`);
});
