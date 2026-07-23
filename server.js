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
  <title>ฐานขอมูลนักศึกษา - Sky Theme</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 60px 20px 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    /* Sky background */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%);
      z-index: -2;
    }
    
    /* Animated clouds */
    .cloud {
      position: fixed;
      background: white;
      border-radius: 100px;
      opacity: 0.85;
      z-index: 1;
      box-shadow: 0 4px 15px rgba(135, 206, 235, 0.3);
    }
    
    .cloud1 {
      width: 140px;
      height: 50px;
      top: 8%;
      left: 5%;
      animation: float 25s infinite;
    }
    
    .cloud2 {
      width: 180px;
      height: 60px;
      top: 25%;
      right: 8%;
      animation: float 30s infinite reverse;
    }
    
    .cloud3 {
      width: 120px;
      height: 45px;
      top: 18%;
      left: 50%;
      animation: float 28s infinite;
    }
    
    .cloud4 {
      width: 160px;
      height: 55px;
      top: 35%;
      left: 15%;
      animation: float 32s infinite reverse;
    }
    
    @keyframes float {
      0%, 100% { transform: translateX(0px); }
      50% { transform: translateX(50px); }
    }
    
    /* Sun */
    .sun {
      position: fixed;
      width: 80px;
      height: 80px;
      top: 10%;
      right: 10%;
      background: radial-gradient(circle at 30% 30%, #FFD700, #FFA500);
      border-radius: 50%;
      z-index: 0;
      box-shadow: 0 0 50px rgba(255, 200, 0, 0.6);
      animation: gentle-spin 20s linear infinite;
    }
    
    @keyframes gentle-spin {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(5deg); }
    }
    
    .container {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%);
      border: none;
      border-radius: 20px;
      padding: 50px;
      max-width: 900px;
      width: 100%;
      position: relative;
      z-index: 10;
      box-shadow: 
        0 10px 40px rgba(135, 206, 235, 0.3),
        0 0 0 1px rgba(135, 206, 235, 0.1);
      backdrop-filter: blur(10px);
    }
    
    h1 {
      color: #1E90FF;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.2em;
      text-shadow: 2px 2px 4px rgba(30, 144, 255, 0.15);
      letter-spacing: 1px;
      font-weight: 600;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
      border-radius: 10px;
      overflow: hidden;
    }
    
    thead {
      background: linear-gradient(180deg, #1E90FF 0%, #4169E1 100%);
      color: white;
      border: none;
    }
    
    th {
      padding: 18px;
      text-align: left;
      font-weight: 600;
      font-size: 1em;
      letter-spacing: 0.5px;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    th:last-child {
      border-right: none;
    }
    
    tbody tr {
      border-bottom: 1px solid #E0F0FF;
      transition: all 0.3s ease;
      background: white;
    }
    
    tbody tr:hover {
      background: linear-gradient(90deg, #F0F8FF 0%, #E0F6FF 100%);
      transform: translateY(-2px);
      box-shadow: inset 0 2px 8px rgba(135, 206, 235, 0.2);
    }
    
    tbody tr:last-child {
      border-bottom: none;
    }
    
    td {
      padding: 16px 18px;
      color: #333;
      font-size: 0.95em;
      border-right: 1px solid #E0F0FF;
      font-family: 'Segoe UI', sans-serif;
    }
    
    td:last-child {
      border-right: none;
    }
    
    /* Responsive design */
    @media (max-width: 600px) {
      .container {
        padding: 25px;
        border-radius: 15px;
      }
      
      h1 {
        font-size: 1.6em;
      }
      
      table {
        font-size: 0.9em;
      }
      
      th, td {
        padding: 12px;
        font-size: 0.9em;
      }
      
      .cloud1 { width: 100px; height: 35px; }
      .cloud2 { width: 130px; height: 45px; }
      .cloud3 { width: 90px; height: 30px; }
      .cloud4 { width: 110px; height: 40px; }
      
      .sun {
        width: 60px;
        height: 60px;
      }
    }
  </style>
</head>
<body>
  <div class="sun"></div>
  <div class="cloud cloud1"></div>
  <div class="cloud cloud2"></div>
  <div class="cloud cloud3"></div>
  <div class="cloud cloud4"></div>
  
  <div class="container">
    <h1>☁️ ฐานขอมูลนักศึกษา ☁️</h1>
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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 50%, #FFB0C0 100%);
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
      background: linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 50%, #FFB0C0 100%);
      z-index: -1;
    }
    
    .error-container {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%);
      border: 2px solid #FF69B4;
      border-radius: 15px;
      padding: 40px;
      max-width: 600px;
      text-align: center;
      box-shadow: 
        0 10px 40px rgba(255, 105, 180, 0.2),
        0 0 0 1px rgba(255, 105, 180, 0.1);
      position: relative;
      z-index: 10;
    }
    
    h1 {
      color: #FF1493;
      margin-bottom: 20px;
      font-size: 1.8em;
      text-shadow: 2px 2px 4px rgba(255, 20, 147, 0.15);
      letter-spacing: 1px;
      font-weight: 600;
    }
    
    p {
      color: #333;
      font-size: 0.9em;
      line-height: 1.6;
      background: rgba(255, 192, 203, 0.3);
      padding: 20px;
      border: 2px solid #FFB6C1;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>⚠️ ข้อผิดพลาด ⚠️</h1>
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
