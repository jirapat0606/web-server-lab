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
  <title>ฐานขอมูลนักศึกษา - Minecraft Theme</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @font-face {
      font-family: 'Minecraft';
      src: local('Minecraft'), local('Minecraft-Regular');
      font-weight: normal;
      font-style: normal;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 60px 20px 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    /* Minecraft Sky Background */
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
    
    /* Minecraft Grass Block */
    body::after {
      content: '';
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, #7CB342 0%, #558B2F 100%);
      z-index: -2;
    }
    
    /* Minecraft Blocks Animation */
    .minecraft-block {
      position: fixed;
      background: linear-gradient(135deg, #8B4513, #5C2E0F);
      border: 2px solid #3E1F0F;
      z-index: 1;
      box-shadow: inset -2px -2px 0 rgba(0, 0, 0, 0.3);
      animation: float-block 4s ease-in-out infinite;
    }
    
    .block1 {
      width: 40px;
      height: 40px;
      top: 15%;
      left: 8%;
      animation-delay: 0s;
    }
    
    .block2 {
      width: 40px;
      height: 40px;
      top: 28%;
      right: 12%;
      animation-delay: 1s;
    }
    
    .block3 {
      width: 40px;
      height: 40px;
      top: 42%;
      left: 15%;
      animation-delay: 2s;
    }
    
    @keyframes float-block {
      0%, 100% { transform: translateY(0px) rotateZ(0deg); }
      50% { transform: translateY(-20px) rotateZ(5deg); }
    }
    
    /* Minecraft Container */
    .container {
      background: linear-gradient(135deg, #8B8B8B 0%, #A9A9A9 100%);
      border: 4px solid;
      border-color: #D3D3D3 #808080 #808080 #D3D3D3;
      border-radius: 0;
      padding: 40px;
      max-width: 900px;
      width: 100%;
      position: relative;
      z-index: 10;
      box-shadow: 
        4px 4px 0 rgba(0, 0, 0, 0.4),
        inset 1px 1px 0 rgba(255, 255, 255, 0.3);
      background-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 10px,
        rgba(0, 0, 0, 0.03) 10px,
        rgba(0, 0, 0, 0.03) 20px
      );
    }
    
    h1 {
      color: #1a1a1a;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.2em;
      text-shadow: 
        2px 2px 0 #FFD700,
        3px 3px 0 #FFA500,
        4px 4px 0 rgba(0, 0, 0, 0.2);
      letter-spacing: 2px;
      font-weight: bold;
      font-family: 'Arial Black', sans-serif;
    }
    
    /* Minecraft Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: #C0C0C0;
      border: 2px solid;
      border-color: #DFDFDF #808080 #808080 #DFDFDF;
    }
    
    thead {
      background: linear-gradient(180deg, #4CAF50 0%, #388E3C 100%);
      color: #FFFFFF;
      border-bottom: 3px solid #1B5E20;
    }
    
    th {
      padding: 16px 18px;
      text-align: left;
      font-weight: bold;
      font-size: 1em;
      letter-spacing: 1px;
      border-right: 2px solid #1B5E20;
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
      font-family: 'Arial Black', sans-serif;
    }
    
    th:last-child {
      border-right: none;
    }
    
    tbody tr {
      border-bottom: 2px solid #999;
      transition: all 0.2s ease;
      background: #C0C0C0;
    }
    
    tbody tr:hover {
      background: linear-gradient(90deg, #FFD700 0%, #FFC107 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    tbody tr:last-child {
      border-bottom: none;
    }
    
    td {
      padding: 14px 18px;
      color: #1a1a1a;
      font-size: 0.95em;
      border-right: 1px solid #999;
      font-family: 'Arial', sans-serif;
      font-weight: 500;
    }
    
    td:last-child {
      border-right: none;
    }
    
    /* Minecraft Button Style */
    .minecraft-btn {
      display: inline-block;
      background: linear-gradient(180deg, #7CB342 0%, #558B2F 100%);
      border: 2px solid;
      border-color: #9CCC65 #3A6B17 #3A6B17 #9CCC65;
      color: #FFFFFF;
      padding: 12px 24px;
      margin-top: 20px;
      cursor: pointer;
      font-weight: bold;
      font-size: 1em;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
      transition: all 0.1s ease;
    }
    
    .minecraft-btn:hover {
      background: linear-gradient(180deg, #9CCC65 0%, #7CB342 100%);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    .minecraft-btn:active {
      border-color: #3A6B17 #9CCC65 #9CCC65 #3A6B17;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    /* Responsive design */
    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }
      
      h1 {
        font-size: 1.6em;
      }
      
      table {
        font-size: 0.9em;
      }
      
      th, td {
        padding: 10px;
        font-size: 0.9em;
      }
      
      .block1 { width: 30px; height: 30px; }
      .block2 { width: 30px; height: 30px; }
      .block3 { width: 30px; height: 30px; }
    }
  </style>
</head>
<body>
  <div class="minecraft-block block1"></div>
  <div class="minecraft-block block2"></div>
  <div class="minecraft-block block3"></div>
  
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
  <title>เกิดข้อผิดพลาด</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
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
      height: 100%;
      background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
      z-index: -1;
    }
    
    .error-container {
      background: linear-gradient(135deg, #8B8B8B 0%, #A9A9A9 100%);
      border: 4px solid;
      border-color: #D3D3D3 #404040 #404040 #D3D3D3;
      border-radius: 0;
      padding: 40px;
      max-width: 600px;
      text-align: center;
      box-shadow: 
        6px 6px 0 rgba(0, 0, 0, 0.5),
        inset 1px 1px 0 rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 10;
    }
    
    h1 {
      color: #8B0000;
      margin-bottom: 20px;
      font-size: 1.8em;
      text-shadow: 
        2px 2px 0 #FFD700,
        3px 3px 0 rgba(0, 0, 0, 0.3);
      letter-spacing: 1px;
      font-weight: bold;
      font-family: 'Arial Black', sans-serif;
    }
    
    p {
      color: #1a1a1a;
      font-size: 0.9em;
      line-height: 1.6;
      background: linear-gradient(135deg, #D3D3D3, #A9A9A9);
      padding: 20px;
      border: 2px solid #808080;
      border-radius: 0;
      font-family: 'Courier New', monospace;
      word-break: break-all;
      box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.3);
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>💥 ข้อผิดพลาด 💥</h1>
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
