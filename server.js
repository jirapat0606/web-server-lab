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
      background: #000814;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    
    /* ดวงอาทิตย์ */
    body::before {
      content: '';
      position: fixed;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle at 30% 30%, #ffd700, #ffb300);
      border-radius: 50%;
      top: 5%;
      right: 10%;
      box-shadow: 0 0 80px 40px rgba(255, 215, 0, 0.5);
      z-index: 1;
    }
    
    /* โลก */
    body::after {
      content: '';
      position: fixed;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at 35% 35%, #4a90e2, #1e88e5, #0d47a1);
      border-radius: 50%;
      bottom: 10%;
      left: 5%;
      box-shadow: 0 0 60px 30px rgba(74, 144, 226, 0.4), inset -20px -20px 40px rgba(0, 0, 0, 0.4);
      z-index: 1;
      background-image: 
        radial-gradient(circle at 35% 35%, #4a90e2, #1e88e5, #0d47a1);
    }
    
    /* ดาวอังคาร */
    .mars {
      position: fixed;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle at 40% 40%, #e27b58, #c1502e, #8b3a1f);
      border-radius: 50%;
      top: 15%;
      left: 8%;
      box-shadow: 0 0 50px 25px rgba(226, 123, 88, 0.3);
      z-index: 1;
    }
    
    /* ดาวพื้นหลัง */
    .stars {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    
    .star {
      position: absolute;
      width: 2px;
      height: 2px;
      background: white;
      border-radius: 50%;
      animation: twinkle 3s infinite;
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    
    .container {
      background: rgba(20, 20, 40, 0.9);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
                  0 0 40px rgba(74, 144, 226, 0.4);
      padding: 40px;
      max-width: 900px;
      width: 100%;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(74, 144, 226, 0.5);
      position: relative;
      z-index: 2;
    }
    
    h1 {
      color: #4a90e2;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.2em;
      text-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
      letter-spacing: 2px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    thead {
      background: linear-gradient(135deg, rgba(74, 144, 226, 0.6) 0%, rgba(30, 136, 229, 0.6) 100%);
      color: #ffffff;
      border-bottom: 2px solid rgba(74, 144, 226, 0.8);
    }
    
    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 1.05em;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    tbody tr {
      border-bottom: 1px solid rgba(74, 144, 226, 0.3);
      transition: all 0.3s ease;
    }
    
    tbody tr:hover {
      background: rgba(74, 144, 226, 0.2);
      transform: translateX(5px);
      box-shadow: inset 0 0 20px rgba(74, 144, 226, 0.2);
    }
    
    tbody tr:last-child {
      border-bottom: none;
    }
    
    td {
      padding: 15px;
      color: #e0e0e0;
      font-size: 1em;
    }
    
    tbody tr:nth-child(odd) {
      background-color: rgba(74, 144, 226, 0.1);
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
      
      body::before {
        width: 100px;
        height: 100px;
      }
      
      body::after {
        width: 140px;
        height: 140px;
      }
      
      .mars {
        width: 80px;
        height: 80px;
      }
    }
  </style>
</head>
<body>
  <div class="mars"></div>
  <div class="stars" id="stars"></div>
  <div class="container">
    <h1>🚀 ฐานขอมูลนักศึกษา</h1>
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
  
  <script>
    // สร้างดาวแบบสุ่ม
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      starsContainer.appendChild(star);
    }
  </script>
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
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #000814;
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
      width: 150px;
      height: 150px;
      background: radial-gradient(circle at 30% 30%, #ffd700, #ffb300);
      border-radius: 50%;
      top: 5%;
      right: 10%;
      box-shadow: 0 0 80px 40px rgba(255, 215, 0, 0.5);
      z-index: 1;
    }
    
    .mars {
      position: fixed;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle at 40% 40%, #e27b58, #c1502e, #8b3a1f);
      border-radius: 50%;
      top: 15%;
      left: 8%;
      box-shadow: 0 0 50px 25px rgba(226, 123, 88, 0.3);
      z-index: 1;
    }
    
    .error-container {
      background: rgba(20, 20, 40, 0.9);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(226, 48, 49, 0.4);
      padding: 40px;
      max-width: 600px;
      text-align: center;
      border: 2px solid rgba(226, 48, 49, 0.5);
      position: relative;
      z-index: 2;
    }
    
    h1 {
      color: #e23031;
      margin-bottom: 20px;
      font-size: 2em;
      text-shadow: 0 0 20px rgba(226, 48, 49, 0.8);
    }
    
    p {
      color: #e0e0e0;
      font-size: 1.1em;
      line-height: 1.6;
      background: rgba(226, 48, 49, 0.2);
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #e23031;
    }
  </style>
</head>
<body>
  <div class="mars"></div>
  <div class="error-container">
    <h1>⚠️ เกิดข้อผิดพลาด!</h1>
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
