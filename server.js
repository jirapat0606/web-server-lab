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
let html = `<h1>ฐานขอมูลนักศึกษา (ทดสอบการเชื่อมตอ)</h1>`;
html += `<table border="1" cellpadding="10">`;
html += `<tr><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th></tr>`;
// วนลูปนําขอมูลแตละแถวมาแสดง
result.rows.forEach(row => {
html += `<tr><td>${row.student_id}</td><td>${row.tudent_name}</td></tr>`;
});
html += `</table>`;
res.end(html);
} catch (err) {
// กรณเีชื่อมตอไมไดหรือเขียนชื่อตารางผิด
console.error(err);
res.end(`<h1>เกิดขอผิดพลาด!</h1><p>${err.message}</p>`);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
