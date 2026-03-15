// ── LEADERBOARD PAGE FUNCTIONALITY ──

document.addEventListener('DOMContentLoaded', function() {
    initializeCanvasAnimation();
    initializeFilters();
    initializeSearch();
    initializeStudentProfiles();
    initializeScrollReveal();
});

// ── ENHANCED CANVAS PARTICLE ANIMATION ──
function initializeCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    
    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 0.6,
            dy: (Math.random() - 0.5) * 0.6,
            alpha: Math.random() * 0.5 + 0.2,
            maxAlpha: Math.random() * 0.5 + 0.2
        };
    }
    
    function init() {
        resize();
        particles = Array.from({ length: 120 }, createParticle);
    }
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
            
            p.x += p.dx;
            p.y += p.dy;
            
            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
            
            p.x = Math.max(0, Math.min(W, p.x));
            p.y = Math.max(0, Math.min(H, p.y));
            
            p.alpha += (Math.random() - 0.5) * 0.05;
            p.alpha = Math.max(0.1, Math.min(p.maxAlpha, p.alpha));
        });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', init);
    init();
    draw();
}

// ── FILTER FUNCTIONALITY ──
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const departmentFilter = document.getElementById('departmentFilter');
    const yearFilter = document.getElementById('yearFilter');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });
    
    departmentFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const timePeriod = document.querySelector('.filter-btn.active').dataset.filter;
    const department = document.getElementById('departmentFilter').value;
    const year = document.getElementById('yearFilter').value;
    
    console.log(`Filtering: ${timePeriod}, ${department}, ${year}`);
    
    // In a real app, this would fetch filtered data from the backend
    // For now, we'll just show a message
    showNotification(`Filtered by: ${timePeriod}, ${department}, ${year}`, 'info');
}

// ── SEARCH FUNCTIONALITY ──
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('leaderboardTable');
    const rows = table.querySelectorAll('tbody tr');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        rows.forEach(row => {
            const studentName = row.querySelector('.name').textContent.toLowerCase();
            const dept = row.querySelector('.dept').textContent.toLowerCase();
            
            if (studentName.includes(searchTerm) || dept.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// ── STUDENT PROFILE MODAL ──
function initializeStudentProfiles() {
    const table = document.getElementById('leaderboardTable');
    const rows = table.querySelectorAll('tbody tr');
    const modal = document.getElementById('profileModal');
    const closeBtn = document.getElementById('closeModal');
    
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const rank = row.dataset.rank;
            const name = row.querySelector('.name').textContent;
            const dept = row.querySelector('.dept').textContent;
            const problems = row.querySelector('.problems-cell').textContent;
            const streak = row.querySelector('.streak-cell').textContent;
            const points = row.querySelector('.points-cell').textContent;
            const avatar = row.querySelector('.avatar').textContent;
            
            showStudentProfile(name, dept, avatar, problems, streak, points, rank);
        });
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function showStudentProfile(name, dept, avatar, problems, streak, points, rank) {
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    
    const favoriteTopics = ['Arrays', 'Strings', 'Trees'];
    const longestStreak = parseInt(streak) + Math.floor(Math.random() * 5);
    const rankHistory = `Rank ${rank} (↑ ${Math.floor(Math.random() * 3)} last week)`;
    
    modalBody.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${avatar}</div>
            <div class="profile-name">${name}</div>
            <div class="profile-dept">${dept}</div>
        </div>
        
        <div class="profile-stats">
            <div class="profile-stat">
                <div class="profile-stat-label">Problems Solved</div>
                <div class="profile-stat-value">${problems}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Current Streak</div>
                <div class="profile-stat-value">${streak}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Total Points</div>
                <div class="profile-stat-value">${points}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Rank</div>
                <div class="profile-stat-value">#${rank}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-light); border-radius: 10px;">
            <h4 style="margin-bottom: 0.8rem; color: var(--text-dark);">Favorite Topics</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${favoriteTopics.map(topic => `<span style="background: var(--primary-light); color: var(--primary); padding: 4px 12px; border-radius: 12px; font-size: 0.85rem;">${topic}</span>`).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-light); border-radius: 10px;">
            <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Longest Streak</h4>
            <p style="margin: 0; color: var(--text-light);">🔥 ${longestStreak} days</p>
        </div>
        
        <div style="padding: 1rem; background: var(--bg-light); border-radius: 10px;">
            <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Rank History</h4>
            <p style="margin: 0; color: var(--text-light);">${rankHistory}</p>
        </div>
    `;
    
    modal.classList.add('active');
}

// ── SCROLL REVEAL ANIMATION ──
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
}

// ── NOTIFICATION ──
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? '#2196F3' : '#4CAF50'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 2000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ── THEME TOGGLE ──
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'light' ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
        }
    }
});

// ── HAMBURGER MENU ──
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
});
