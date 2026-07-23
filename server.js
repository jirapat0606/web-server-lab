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
      position: relative;
      overflow: hidden;
    }
    
    /* ดาวที่หลับกระพริบ */
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
    
    /* ดาวเคราะห์ที่ลอย */
    .planet {
      position: absolute;
      border-radius: 50%;
      image-rendering: pixelated;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }
    
    /* ดาวเคราะห์สีส้ม */
    .planet-orange {
      width: 60px;
      height: 60px;
      background: 
        linear-gradient(135deg, #ff8c42 0%, #ff6b35 50%, #d94a1f 100%);
      animation: float-orange 8s ease-in-out infinite;
      top: 10%;
      right: 5%;
      box-shadow: inset -3px -3px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 107, 53, 0.5);
    }
    
    /* ดาวเคราะห์สีน้ำเงิน */
    .planet-blue {
      width: 80px;
      height: 80px;
      background: 
        linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #0080ff 100%);
      animation: float-blue 10s ease-in-out infinite;
      top: 60%;
      left: 3%;
      box-shadow: inset -4px -4px 10px rgba(0, 0, 0, 0.3), 0 0 25px rgba(79, 172, 254, 0.5);
    }
    
    /* ดาวเคราะห์สีม่วง */
    .planet-purple {
      width: 50px;
      height: 50px;
      background: 
        linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #6b21a8 100%);
      animation: float-purple 12s ease-in-out infinite;
      bottom: 15%;
      right: 10%;
      box-shadow: inset -2px -2px 6px rgba(0, 0, 0, 0.3), 0 0 18px rgba(147, 51, 234, 0.5);
    }
    
    /* ดาวเคราะห์สีเขียว */
    .planet-green {
      width: 70px;
      height: 70px;
      background: 
        linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
      animation: float-green 9s ease-in-out infinite;
      top: 25%;
      left: 8%;
      box-shadow: inset -3px -3px 8px rgba(0, 0, 0, 0.3), 0 0 22px rgba(16, 185, 129, 0.5);
    }
    
    /* ดาวเคราะห์สีชมพู */
    .planet-pink {
      width: 45px;
      height: 45px;
      background: 
        linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%);
      animation: float-pink 11s ease-in-out infinite;
      bottom: 10%;
      left: 12%;
      box-shadow: inset -2px -2px 6px rgba(0, 0, 0, 0.3), 0 0 16px rgba(236, 72, 153, 0.5);
    }
    
    @keyframes float-orange {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-30px) translateX(20px); }
    }
    
    @keyframes float-blue {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(40px) translateX(-30px); }
    }
    
    @keyframes float-purple {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-35px) translateX(-25px); }
    }
    
    @keyframes float-green {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(45px) translateX(25px); }
    }
    
    @keyframes float-pink {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-40px) translateX(-20px); }
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
      position: relative;
      z-index: 10;
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
      
      .planet {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- ดาวเคราะห์ -->
  <div class="planet planet-orange"></div>
  <div class="planet planet-blue"></div>
  <div class="planet planet-purple"></div>
  <div class="planet planet-green"></div>
  <div class="planet planet-pink"></div>
  
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
html += `<tr><td>${row.student_id}</td><td>${row.student_name}</td></tr>`;
});

html += `
      </tbody>
    </table>
  </div>
  
  <script>
    // สร้างดาวแบบสุ่ม
    function createStars() {
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.body.appendChild(star);
      }
    }
    
    // เรียกใช้เมื่อหน้าเว็บโหลดเสร็จ
    window.addEventListener('load', createStars);
  </script>
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
      position: relative;
      overflow: hidden;
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
      position: relative;
      z-index: 10;
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
    <p>\${err.message}</p>
  </div>
  
  <script>
    function createStars() {
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.body.appendChild(star);
      }
    }
    
    window.addEventListener('load', createStars);
  </script>
</body>
</html>
`);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});