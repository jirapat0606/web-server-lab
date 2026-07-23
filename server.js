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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #1a1a2e 100%);
      background-size: 400% 400%;
      animation: twilight 15s ease infinite;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    @keyframes twilight {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
                  0 0 40px rgba(147, 112, 219, 0.3);
      padding: 40px;
      max-width: 900px;
      width: 100%;
      backdrop-filter: blur(10px);
    }
    
    h1 {
      color: #533483;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.2em;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: 1px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    thead {
      background: linear-gradient(135deg, #533483 0%, #6b4aa8 100%);
      color: white;
    }
    
    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 1.05em;
      letter-spacing: 0.5px;
    }
    
    tbody tr {
      border-bottom: 1px solid #e8e8f0;
      transition: all 0.3s ease;
    }
    
    tbody tr:hover {
      background: linear-gradient(90deg, rgba(83, 52, 131, 0.1) 0%, transparent 100%);
      transform: translateX(5px);
    }
    
    tbody tr:last-child {
      border-bottom: none;
    }
    
    td {
      padding: 15px;
      color: #2d2d2d;
      font-size: 1em;
    }
    
    tbody tr:nth-child(odd) {
      background-color: rgba(83, 52, 131, 0.03);
    }
    
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
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌆 ฐานขอมูลนักศึกษา</h1>
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
html += `<tr><td>${row.student_id}</td><td>${row.tudent_name}</td></tr>`;
});

html += `
      </tbody>
    </table>
  </div>
</body>
</html>
`;

res.end(html);
} catch (err) {
// กรณเีชื่อมตอไมไดหรือเขียนชื่อตารางผิด
console.error(err);
res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เกิดข้อผิดพลาด</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #1a1a2e 100%);
      background-size: 400% 400%;
      animation: twilight 15s ease infinite;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    @keyframes twilight {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .error-container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      padding: 40px;
      max-width: 600px;
      text-align: center;
    }
    
    h1 {
      color: #d63031;
      margin-bottom: 20px;
      font-size: 2em;
    }
    
    p {
      color: #2d2d2d;
      font-size: 1.1em;
      line-height: 1.6;
      background: #ffe8e8;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #d63031;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>⚠️ เกิดข้อผิดพลาด!</h1>
    <p>${err.message}</p>
  </div>
</body>
</html>
`);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});