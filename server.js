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
    <title>ฐานขอมูลนักศึกษา - Galaxy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #000511;
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            position: relative;
            perspective: 1000px;
        }

        /* Ultra realistic galaxy background */
        .galaxy-bg {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 0;
        }

        .galaxy-core {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle at 35% 35%, 
                rgba(255, 200, 100, 0.8) 0%,
                rgba(255, 150, 0, 0.6) 15%,
                rgba(200, 50, 200, 0.4) 35%,
                rgba(100, 0, 200, 0.2) 55%,
                transparent 100%);
            filter: blur(80px);
            top: -100px;
            left: -100px;
            animation: coreRotate 45s linear infinite;
            box-shadow: 0 0 200px rgba(200, 50, 200, 0.3);
        }

        .galaxy-ring {
            position: absolute;
            border: 3px solid;
            border-image: linear-gradient(45deg, rgba(100, 200, 255, 0.3), rgba(200, 50, 200, 0.3), rgba(100, 200, 255, 0.3)) 1;
            border-radius: 50%;
            opacity: 0.2;
            animation: ringRotate linear infinite;
            filter: blur(1px);
        }

        .ring-1 {
            width: 1000px;
            height: 1000px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(75deg);
            animation-duration: 30s;
        }

        .ring-2 {
            width: 1400px;
            height: 1400px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(60deg);
            animation-duration: 40s;
            animation-direction: reverse;
        }

        .ring-3 {
            width: 1800px;
            height: 1800px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(80deg);
            animation-duration: 50s;
        }

        @keyframes coreRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes ringRotate {
            0% { transform: rotateZ(0deg); }
            100% { transform: rotateZ(360deg); }
        }

        /* Advanced starfield */
        .starfield {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
            pointer-events: none;
        }

        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            filter: blur(0.5px);
        }

        .star-small { 
            width: 1px;
            height: 1px;
            opacity: 0.6;
        }

        .star-medium {
            width: 1.5px;
            height: 1.5px;
            opacity: 0.8;
            box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
        }

        .star-large {
            width: 2px;
            height: 2px;
            opacity: 1;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
        }

        /* Color stars */
        .star-blue {
            background: #4da6ff;
            box-shadow: 0 0 10px rgba(77, 166, 255, 0.8);
        }

        .star-red {
            background: #ff6b6b;
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
        }

        .star-yellow {
            background: #ffd93d;
            box-shadow: 0 0 10px rgba(255, 217, 61, 0.8);
        }

        /* Nebula clouds */
        .nebula {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.15;
            z-index: 2;
            mix-blend-mode: screen;
        }

        .nebula-purple {
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgb(180, 0, 255), transparent);
            top: 10%;
            right: 5%;
            animation: floatSlow 25s ease-in-out infinite;
        }

        .nebula-blue {
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgb(0, 150, 255), transparent);
            bottom: 10%;
            left: 5%;
            animation: floatSlow 30s ease-in-out infinite reverse;
        }

        .nebula-pink {
            width: 700px;
            height: 700px;
            background: radial-gradient(circle, rgb(255, 50, 150), transparent);
            top: 50%;
            right: 20%;
            animation: floatSlow 35s ease-in-out infinite;
        }

        @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(50px) translateX(-30px); }
        }

        /* Realistic planets */
        .planet {
            position: fixed;
            border-radius: 50%;
            z-index: 3;
            box-shadow: 
                0 0 60px rgba(255, 150, 0, 0.4),
                inset -20px -20px 40px rgba(0, 0, 0, 0.6),
                inset 10px 10px 30px rgba(255, 255, 255, 0.1);
        }

        .planet::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: inherit;
            filter: blur(2px);
            z-index: -1;
            opacity: 0.3;
        }

        .jupiter {
            width: 180px;
            height: 180px;
            top: 8%;
            left: 5%;
            background: 
                repeating-linear-gradient(
                    90deg,
                    #c88b3a 0px,
                    #c88b3a 5px,
                    #a67035 5px,
                    #a67035 8px,
                    #8b5a2b 8px,
                    #8b5a2b 12px,
                    #6b4423 12px,
                    #6b4423 15px
                ),
                radial-gradient(ellipse at 35% 35%, #ffcc99, #d4842e);
            animation: planetFloat 4s ease-in-out infinite;
        }

        .saturn {
            width: 140px;
            height: 140px;
            top: 55%;
            right: 8%;
            background: radial-gradient(circle at 40% 40%, #ffd699, #d4a76a, #9d8455);
            animation: planetFloat 5s ease-in-out infinite 0.5s;
        }

        .saturn::after {
            content: '';
            position: absolute;
            width: 200px;
            height: 200px;
            border: 3px solid rgba(200, 150, 100, 0.3);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(75deg);
            box-shadow: 
                inset 0 0 30px rgba(0, 0, 0, 0.5),
                0 0 40px rgba(200, 150, 100, 0.2);
        }

        .neptune {
            width: 160px;
            height: 160px;
            bottom: 15%;
            left: 12%;
            background: 
                radial-gradient(circle at 30% 30%, #6bb6ff, #4169e1),
                radial-gradient(ellipse at 50% 50%, #003da5, #001a4d);
            animation: planetFloat 6s ease-in-out infinite 1s;
        }

        .mercury {
            width: 80px;
            height: 80px;
            top: 20%;
            right: 18%;
            background: radial-gradient(circle at 35% 35%, #c0c0c0, #808080, #404040);
            animation: planetFloat 3s ease-in-out infinite 0.3s;
        }

        @keyframes planetFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(30px) scale(1.02); }
        }

        /* Cosmic rays */
        .cosmic-ray {
            position: fixed;
            width: 2px;
            height: 100px;
            background: linear-gradient(to bottom, rgba(100, 200, 255, 0.8), transparent);
            z-index: 2;
            animation: rayFloat 4s ease-in infinite;
            pointer-events: none;
        }

        @keyframes rayFloat {
            0% {
                opacity: 0;
                transform: translateY(-100px);
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateY(100vh);
            }
        }

        /* Main container */
        .container {
            max-width: 1000px;
            margin: 50px auto;
            padding: 50px;
            background: 
                linear-gradient(135deg, rgba(20, 20, 50, 0.85) 0%, rgba(30, 10, 50, 0.85) 100%),
                repeating-linear-gradient(
                    0deg,
                    rgba(100, 150, 255, 0.03) 0px,
                    rgba(100, 150, 255, 0.03) 2px,
                    transparent 2px,
                    transparent 4px
                );
            border: 2px solid;
            border-image: linear-gradient(135deg, rgba(138, 43, 226, 0.8), rgba(0, 255, 255, 0.8)) 1;
            border-radius: 20px;
            box-shadow: 
                0 0 60px rgba(138, 43, 226, 0.4),
                0 0 120px rgba(30, 144, 255, 0.2),
                inset 0 0 50px rgba(100, 200, 255, 0.1);
            position: relative;
            z-index: 10;
            backdrop-filter: blur(15px);
            transform: translateZ(0);
        }

        /* Glowing border */
        .container::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, #8a2be2, #00ffff, #8a2be2);
            border-radius: 20px;
            opacity: 0.3;
            filter: blur(8px);
            z-index: -1;
            animation: borderGlow 3s ease-in-out infinite;
        }

        @keyframes borderGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }

        h1 {
            color: #00ffff;
            text-align: center;
            margin-bottom: 40px;
            font-size: 3em;
            text-shadow: 
                0 0 20px rgba(0, 255, 255, 0.8),
                0 0 40px rgba(138, 43, 226, 0.6),
                0 0 60px rgba(0, 150, 255, 0.4);
            letter-spacing: 4px;
            font-weight: 300;
            background: linear-gradient(135deg, #00ffff, #8a2be2, #00ffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .emoji-title {
            display: inline-block;
            font-size: 1.5em;
            margin: 0 15px;
            filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.8));
            animation: emojiPulse 2s ease-in-out infinite;
        }

        @keyframes emojiPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Table styling */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 30px;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
            border-radius: 12px;
            overflow: hidden;
        }

        thead {
            background: linear-gradient(135deg, rgba(138, 43, 226, 0.7) 0%, rgba(30, 144, 255, 0.7) 100%);
            box-shadow: 0 0 30px rgba(138, 43, 226, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1);
            position: relative;
        }

        thead::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        th {
            color: #ffffff;
            padding: 25px 20px;
            text-align: left;
            font-size: 1.15em;
            font-weight: 700;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
            letter-spacing: 1.5px;
            position: relative;
        }

        th::before {
            content: '';
            position: absolute;
            left: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, #00ffff, transparent);
            opacity: 0;
            animation: headerHighlight 2s ease-in-out infinite;
        }

        @keyframes headerHighlight {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }

        td {
            padding: 22px 20px;
            border-bottom: 1px solid rgba(0, 255, 255, 0.15);
            color: #e0e0ff;
            font-size: 1em;
            background: rgba(30, 30, 80, 0.3);
            position: relative;
            overflow: hidden;
        }

        td::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, rgba(0, 255, 255, 0.1), transparent);
            transform: translateX(-100%);
            transition: transform 0.5s ease;
        }

        tbody tr:hover td::before {
            transform: translateX(0);
        }

        tbody tr {
            transition: all 0.3s ease;
            position: relative;
        }

        tbody tr:hover {
            background: rgba(138, 43, 226, 0.4);
            box-shadow: 
                inset 0 0 25px rgba(138, 43, 226, 0.3),
                0 0 30px rgba(138, 43, 226, 0.2);
            transform: scale(1.01);
        }

        tbody tr:nth-child(even) td {
            background: rgba(20, 20, 60, 0.5);
        }

        tbody tr:last-child td {
            border-bottom: none;
        }

        /* Statistics section */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid rgba(0, 255, 255, 0.3);
        }

        .stat-box {
            background: 
                linear-gradient(135deg, rgba(138, 43, 236, 0.3) 0%, rgba(30, 144, 255, 0.2) 100%),
                repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(100, 150, 255, 0.05) 10px,
                    rgba(100, 150, 255, 0.05) 20px
                );
            border: 2px solid rgba(0, 255, 255, 0.4);
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            box-shadow: 
                0 0 25px rgba(0, 255, 255, 0.2),
                inset 0 0 20px rgba(100, 150, 255, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .stat-box::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .stat-box:hover {
            box-shadow: 
                0 0 40px rgba(0, 255, 255, 0.4),
                inset 0 0 30px rgba(138, 43, 226, 0.2);
            transform: translateY(-5px);
        }

        .stat-box:hover::before {
            opacity: 1;
        }

        .stat-label {
            color: #00ffff;
            font-size: 0.85em;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
            margin-bottom: 10px;
            letter-spacing: 2px;
            font-weight: 600;
        }

        .stat-value {
            color: #00ff88;
            font-size: 2.5em;
            font-weight: bold;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        }

        /* Status and decoration */
        .status {
            text-align: center;
            color: #00ff88;
            margin-top: 40px;
            font-size: 1.3em;
            font-weight: 700;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
            animation: statusBreathe 2.5s ease-in-out infinite;
            letter-spacing: 1px;
        }

        @keyframes statusBreathe {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }

        .decoration {
            display: flex;
            justify-content: space-around;
            margin-top: 40px;
            font-size: 3em;
            gap: 20px;
        }

        .decoration span {
            animation: decorationFloat 3.5s ease-in-out infinite;
            filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.8));
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .decoration span:hover {
            transform: scale(1.2) rotate(15deg);
        }

        .decoration span:nth-child(1) { animation-delay: 0s; }
        .decoration span:nth-child(2) { animation-delay: 0.2s; }
        .decoration span:nth-child(3) { animation-delay: 0.4s; }
        .decoration span:nth-child(4) { animation-delay: 0.6s; }
        .decoration span:nth-child(5) { animation-delay: 0.8s; }

        @keyframes decorationFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
        }

        /* Loading animation */
        .data-loading {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #00ff88;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
            margin-left: 8px;
            animation: dataPulse 1.5s ease-in-out infinite;
        }

        @keyframes dataPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <!-- Galaxy background -->
    <div class="galaxy-bg">
        <div class="galaxy-core"></div>
        <div class="galaxy-ring ring-1"></div>
        <div class="galaxy-ring ring-2"></div>
        <div class="galaxy-ring ring-3"></div>
        <div class="nebula nebula-purple"></div>
        <div class="nebula nebula-blue"></div>
        <div class="nebula nebula-pink"></div>
    </div>

    <!-- Planets -->
    <div class="planet jupiter"></div>
    <div class="planet saturn"></div>
    <div class="planet neptune"></div>
    <div class="planet mercury"></div>

    <!-- Starfield -->
    <div class="starfield" id="starfield"></div>

    <!-- Main content -->
    <div class="container">
        <h1>
            <span class="emoji-title">🌌</span>
            ฐานขอมูลนักศึกษา
            <span class="emoji-title">🚀</span>
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
            html += \`<tr><td>\${row.student_id}</td><td>\${row.student_name}</td></tr>\`;
        });

        html += \`
            </tbody>
        </table>

        <div class="stats">
            <div class="stat-box">
                <div class="stat-label">⚡ TOTAL RECORDS</div>
                <div class="stat-value">\${result.rows.length}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">🛰️ STATUS</div>
                <div class="stat-value">✓</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">📡 CONNECTION</div>
                <div class="stat-value">LIVE</div>
            </div>
        </div>

        <div class="status">✨ ดึงข้อมูลสำเร็จ! ✨</div>

        <div class="decoration">
            <span>⭐</span>
            <span>💫</span>
            <span>✨</span>
            <span>🌠</span>
            <span>💎</span>
        </div>
    </div>

    <script>
        // Advanced star generation with depth
        function generateStars() {
            const starfield = document.getElementById('starfield');
            const colors = ['star-blue', 'star-red', 'star-yellow'];
            const sizes = ['star-small', 'star-medium', 'star-large'];
            
            const numStars = 300;
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                const size = sizes[Math.floor(Math.random() * sizes.length)];
                const color = Math.random() > 0.7 ? colors[Math.floor(Math.random() * colors.length)] : '';
                
                star.className = 'star ' + size + (color ? ' ' + color : '');
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starfield.appendChild(star);
            }

            // Generate cosmic rays
            function createRay() {
                const ray = document.createElement('div');
                ray.className = 'cosmic-ray';
                ray.style.left = Math.random() * 100 + '%';
                ray.style.animationDuration = (3 + Math.random() * 2) + 's';
                ray.style.opacity = 0.3 + Math.random() * 0.4;
                starfield.appendChild(ray);
                
                setTimeout(() => ray.remove(), 5000);
            }

            setInterval(createRay, 2000);
        }

        generateStars();

        // Ambient particle effect
        const container = document.querySelector('.container');
        setInterval(() => {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = ['#00ffff', '#8a2be2', '#00ff88'][Math.floor(Math.random() * 3)];
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = '0 0 ' + (Math.random() * 10 + 5) + 'px currentColor';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.pointerEvents = 'none';
            particle.style.filter = 'blur(0.5px)';
            particle.style.zIndex = '4';
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            
            container.appendChild(particle);
            
            let opacity = parseFloat(particle.style.opacity);
            const decay = setInterval(() => {
                opacity -= 0.02;
                particle.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(decay);
                    particle.remove();
                }
            }, 50);
        }, 400);

        // Interaction effects
        document.addEventListener('mousemove', (e) => {
            const glow = document.querySelector('.container');
            const rect = glow.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glow.style.boxShadow = \`
                0 0 60px rgba(138, 43, 226, 0.4),
                0 0 120px rgba(30, 144, 255, 0.2),
                inset 0 0 50px rgba(100, 200, 255, 0.1),
                \${x}px \${y}px 80px rgba(0, 255, 255, 0.15)
            \`;
        });

        // Table row interactivity
        document.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.5), inset 0 0 25px rgba(0, 255, 255, 0.2)';
            });
            row.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        });
    </script>
</body>
</html>\`;
res.end(html);
} catch (err) {
// กรณเีชื่อมตอไมไดหรือเขียนชื่อตารางผิด
console.error(err);
res.end(\`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Galaxy Error</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #000511;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            overflow: hidden;
        }

        .galaxy-bg {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 0;
        }

        .starfield {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
            pointer-events: none;
        }

        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .error-container {
            background: linear-gradient(135deg, rgba(100, 10, 50, 0.9), rgba(20, 20, 50, 0.9));
            padding: 60px;
            border-radius: 20px;
            box-shadow: 
                0 0 60px rgba(255, 0, 100, 0.5),
                0 0 120px rgba(138, 43, 226, 0.3),
                inset 0 0 40px rgba(255, 100, 150, 0.1);
            max-width: 550px;
            text-align: center;
            position: relative;
            z-index: 10;
            border: 2px solid rgba(255, 50, 150, 0.4);
            backdrop-filter: blur(15px);
        }

        h1 {
            color: #ff1493;
            margin-bottom: 25px;
            font-size: 2.8em;
            text-shadow: 
                0 0 20px rgba(255, 20, 147, 0.8),
                0 0 40px rgba(255, 0, 100, 0.5);
            letter-spacing: 3px;
            font-weight: 700;
        }

        p {
            color: #00ffff;
            line-height: 1.8;
            font-size: 1.05em;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
        }

        .emoji {
            font-size: 5em;
            margin-bottom: 25px;
            filter: drop-shadow(0 0 25px rgba(255, 0, 100, 0.8));
            animation: errorPulse 1.5s ease-in-out infinite;
        }

        @keyframes errorPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(-5deg); }
        }

        .retry {
            color: #00ff88;
            font-size: 0.9em;
            margin-top: 30px;
            text-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
            animation: blinkPulse 1.2s infinite;
            letter-spacing: 1px;
        }

        @keyframes blinkPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .error-details {
            background: rgba(50, 0, 50, 0.6);
            border: 1px solid rgba(255, 100, 150, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-top: 25px;
            font-size: 0.8em;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="starfield" id="starfield"></div>

    <div class="error-container">
        <div class="emoji">⚠️</div>
        <h1>SYSTEM ERROR</h1>
        <p>ไม่สามารถเชื่อมต่อกับฐานข้อมูล</p>
        <div class="error-details">\${err.message}</div>
        <div class="retry">↻ กำลังพยายามเชื่อมต่อกับระบบ...</div>
    </div>

    <script>
        function generateStars() {
            const starfield = document.getElementById('starfield');
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starfield.appendChild(star);
            }
        }
        generateStars();
    </script>
</body>
</html>\`);
}
});
server.listen(port, () => {
console.log(\`Server is running on port: \${port}\`);
});
