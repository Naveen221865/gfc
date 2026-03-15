// ── Floating Particles ──
(function () {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function randomParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 2.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.2
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: 70 }, randomParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168,240,190,${p.alpha})`;
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
        });

        // Draw connecting lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 80) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(168,240,190,${0.12 * (1 - dist / 80)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
})();

// ── Typing Terminal (login page only) ──
(function () {
    const el = document.getElementById('terminal-text');
    if (!el) return;

    const lines = [
        { type: 'prompt', text: '$ ' },
        { type: 'cmd',    text: 'join GfGCampusClub --member' },
        { type: 'out',    text: '✓ Welcome to the community!' },
        { type: 'prompt', text: '$ ' },
        { type: 'cmd',    text: 'solve --problem "Two Sum"' },
        { type: 'out',    text: '✓ Accepted  |  Runtime: 2ms' },
        { type: 'prompt', text: '$ ' },
        { type: 'cmd',    text: 'leaderboard --top 5' },
        { type: 'out',    text: '🏆 Rahul  420  |  Ananya 380' },
    ];

    let lineIdx = 0, charIdx = 0, output = '';

    function buildHTML(text) {
        return text + '<span class="cursor"></span>';
    }

    function type() {
        if (lineIdx >= lines.length) {
            // Restart after pause
            setTimeout(() => { lineIdx = 0; charIdx = 0; output = ''; el.innerHTML = ''; type(); }, 2000);
            return;
        }

        const line = lines[lineIdx];
        const full = line.text;

        if (charIdx <= full.length) {
            const partial = full.slice(0, charIdx);
            const cls = line.type === 'prompt' ? 'prompt' : line.type === 'cmd' ? 'cmd' : 'out';
            el.innerHTML = output + `<span class="${cls}">${partial}</span>` + '<span class="cursor"></span>';
            charIdx++;
            setTimeout(type, line.type === 'out' ? 18 : 55);
        } else {
            // Line done
            const cls = line.type === 'prompt' ? 'prompt' : line.type === 'cmd' ? 'cmd' : 'out';
            output += `<span class="${cls}">${full}</span>`;
            if (line.type !== 'prompt') output += '<br>';
            lineIdx++;
            charIdx = 0;
            setTimeout(type, line.type === 'out' ? 600 : 80);
        }
    }

    setTimeout(type, 600);
})();
