const http = require('http');

// Render จะกำหนด Port มาให้ผ่าน process.env.PORT อัตโนมัติ
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // ตั้งค่า Header ให้ตอบกลับเป็น HTML และรองรับภาษาไทย (UTF-8)
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    
    // หน้าตาหน้าเว็บแบบ Modern Card 
    const htmlOutput = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Server Assignment</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #e0eafc, #cfdef3);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #333;
            }
            .card {
                background: white;
                padding: 2.5rem;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                text-align: center;
                max-width: 450px;
                width: 90%;
                border-top: 6px solid #4a90e2;
            }
            h1 { font-size: 1.6rem; color: #2c3e50; margin-bottom: 1.5rem; }
            .info-container {
                background: #f8f9fa;
                padding: 1.2rem;
                border-radius: 10px;
                text-align: left;
                border-left: 4px solid #4a90e2;
                margin-bottom: 1.5rem;
            }
            p { font-size: 1.05rem; margin-bottom: 0.6rem; }
            p:last-child { margin-bottom: 0; }
            .label { color: #7f8c8d; font-weight: bold; }
            .value { color: #2c3e50; margin-left: 5px; }
            .badge {
                display: inline-block;
                padding: 0.35rem 0.8rem;
                background: #2ecc71;
                color: white;
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>ใบงานปฏิบัติการ: Web Server</h1>
            <div class="info-container">
                <p><span class="label">รหัสนักศึกษา:</span> <span class="value">69319011594</span></p> <p><span class="label">ชื่อ-นามสกุล:</span> <span class="value">นายจิรภัทร มิตรานนท์</span></p> </div>
            <span class="badge">● Server Online</span>
        </div>
    </body>
    </html>
    `;
    
    res.end(htmlOutput);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
