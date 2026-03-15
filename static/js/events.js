// ── EVENTS PAGE FUNCTIONALITY ──

document.addEventListener('DOMContentLoaded', function() {
    initializeCanvasAnimation();
    initializeCalendar();
    initializeFilters();
    initializeCountdownTimers();
    initializeEventDetails();
    initializeRegistration();
    loadEventStats();
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
        
        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
            
            // Update position
            p.x += p.dx;
            p.y += p.dy;
            
            // Bounce off walls
            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
            
            // Keep in bounds
            p.x = Math.max(0, Math.min(W, p.x));
            p.y = Math.max(0, Math.min(H, p.y));
            
            // Pulse effect
            p.alpha += (Math.random() - 0.5) * 0.05;
            p.alpha = Math.max(0.1, Math.min(p.maxAlpha, p.alpha));
        });
        
        // Draw connecting lines between nearby particles
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

// ── CALENDAR FUNCTIONALITY ──
let currentDate = new Date(2026, 7, 1); // August 2026

function initializeCalendar() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        header.style.fontWeight = '600';
        header.style.color = 'var(--primary)';
        header.style.textAlign = 'center';
        header.style.padding = '10px 0';
        calendarGrid.appendChild(header);
    });
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(day);
    }
    
    // Add current month's days
    const eventDates = getEventDates(month, year);
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        if (eventDates.includes(i)) {
            day.classList.add('has-event');
        }
        
        calendarGrid.appendChild(day);
    }
    
    // Add next month's days
    const totalCells = calendarGrid.children.length - 7; // Subtract day headers
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarGrid.appendChild(day);
    }
}

function getEventDates(month, year) {
    const eventCards = document.querySelectorAll('.event-card');
    const dates = [];
    
    eventCards.forEach(card => {
        const dateText = card.querySelector('.event-date').textContent;
        const dateMatch = dateText.match(/(\d+)\s+(\w+)\s+(\d+)/);
        if (dateMatch) {
            const day = parseInt(dateMatch[1]);
            const monthName = dateMatch[2];
            const eventYear = parseInt(dateMatch[3]);
            
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            const eventMonth = monthNames.indexOf(monthName);
            
            if (eventMonth === month && eventYear === year) {
                dates.push(day);
            }
        }
    });
    
    return dates;
}

// ── FILTER & SEARCH FUNCTIONALITY ──
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterEvents();
        });
    });
    
    searchInput.addEventListener('input', filterEvents);
}

function filterEvents() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const category = card.dataset.category;
        const title = card.dataset.title;
        
        const matchesFilter = activeFilter === 'all' || category === activeFilter;
        const matchesSearch = title.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// ── COUNTDOWN TIMER ──
function initializeCountdownTimers() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const dateText = card.querySelector('.event-date').textContent;
        const timeText = card.querySelector('.event-time').textContent;
        const eventId = card.querySelector('.btn-details').dataset.eventId;
        
        // Parse date and time
        const dateMatch = dateText.match(/(\d+)\s+(\w+)\s+(\d+)/);
        const timeMatch = timeText.match(/(\d+):(\d+)\s+(AM|PM)/);
        
        if (dateMatch && timeMatch) {
            const day = parseInt(dateMatch[1]);
            const month = getMonthIndex(dateMatch[2]);
            const year = parseInt(dateMatch[3]);
            const hour = parseInt(timeMatch[1]) + (timeMatch[3] === 'PM' && timeMatch[1] !== '12' ? 12 : 0);
            const minute = parseInt(timeMatch[2]);
            
            const eventDate = new Date(year, month, day, hour, minute, 0);
            updateCountdown(eventId, eventDate);
            
            // Update every second
            setInterval(() => updateCountdown(eventId, eventDate), 1000);
        }
    });
}

function getMonthIndex(monthName) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(monthName);
}

function updateCountdown(eventId, eventDate) {
    const now = new Date();
    const diff = eventDate - now;
    
    if (diff <= 0) {
        document.getElementById(`countdown-${eventId}`).innerHTML = 
            '<span class="countdown-label">Event Started!</span>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const countdownEl = document.getElementById(`countdown-${eventId}`);
    if (countdownEl) {
        countdownEl.querySelector('[data-days]').textContent = String(days).padStart(2, '0');
        countdownEl.querySelector('[data-hours]').textContent = String(hours).padStart(2, '0');
        countdownEl.querySelector('[data-minutes]').textContent = String(minutes).padStart(2, '0');
    }
}

// ── EVENT DETAIL MODAL ──
function initializeEventDetails() {
    const detailBtns = document.querySelectorAll('.btn-details');
    const modal = document.getElementById('eventModal');
    const closeBtn = document.getElementById('closeModal');
    
    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = btn.dataset.eventId;
            loadEventDetails(eventId);
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

function loadEventDetails(eventId) {
    fetch(`/event/${eventId}`)
        .then(response => response.json())
        .then(event => {
            displayEventModal(event);
        })
        .catch(error => console.error('Error loading event:', error));
}

function displayEventModal(event) {
    const modalBody = document.getElementById('modalBody');
    
    const agendaItems = event.agenda.split('|').map(item => item.trim());
    const agendaHTML = agendaItems.map(item => `<li>${item}</li>`).join('');
    
    const speakerHTML = event.speaker_name ? `
        <div class="modal-section">
            <h3><i class="fas fa-user-tie"></i> Speaker</h3>
            <div class="speaker-card">
                <div class="speaker-avatar">👤</div>
                <div class="speaker-name">${event.speaker_name}</div>
                <div class="speaker-role">${event.speaker_role}</div>
                <div class="speaker-bio">${event.speaker_bio}</div>
            </div>
        </div>
    ` : '';
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${event.title}</h2>
            <div class="modal-meta">
                <div class="modal-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${event.date}</span>
                </div>
                <div class="modal-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${event.time}</span>
                </div>
                <div class="modal-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="modal-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${event.category}</span>
                </div>
            </div>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-info-circle"></i> Description</h3>
            <p>${event.description}</p>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-list"></i> Agenda</h3>
            <ul class="agenda-list">${agendaHTML}</ul>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-graduation-cap"></i> Eligibility</h3>
            <p>${event.eligibility}</p>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-tools"></i> Required Skills</h3>
            <p>${event.skills}</p>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-users"></i> Participation</h3>
            <p><strong>Max Participants:</strong> ${event.max_participants}</p>
            <p><strong>Currently Registered:</strong> ${event.registered_count}</p>
            <p><strong>Seats Left:</strong> ${event.seats_left}</p>
        </div>

        <div class="modal-section">
            <h3><i class="fas fa-trophy"></i> Prizes</h3>
            <p>${event.prizes}</p>
        </div>

        ${speakerHTML}

        <div class="modal-actions">
            <button class="btn-outline" onclick="document.getElementById('eventModal').classList.remove('active')">
                <i class="fas fa-times"></i> Close
            </button>
            <button class="btn-primary" onclick="registerForEvent(${event.id})">
                <i class="fas fa-check-circle"></i> Register Now
            </button>
        </div>
    `;
    
    document.getElementById('eventModal').classList.add('active');
}

// ── EVENT REGISTRATION ──
function initializeRegistration() {
    const registerBtns = document.querySelectorAll('.btn-register');
    
    registerBtns.forEach(btn => {
        if (btn.dataset.eventId) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                registerForEvent(btn.dataset.eventId);
            });
        }
    });
}

function registerForEvent(eventId) {
    const formData = new FormData();
    formData.append('event_id', eventId);
    
    fetch('/register_event', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            loadEventStats();
            document.getElementById('eventModal').classList.remove('active');
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    });
}

// ── LOAD EVENT STATS ──
function loadEventStats() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const eventId = card.querySelector('.btn-details').dataset.eventId;
        
        fetch(`/event/${eventId}`)
            .then(response => response.json())
            .then(event => {
                document.getElementById(`registered-${eventId}`).textContent = event.registered_count;
                document.getElementById(`seats-${eventId}`).textContent = event.seats_left;
            })
            .catch(error => console.error('Error loading stats:', error));
    });
}

// ── NOTIFICATION ──
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'light' ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
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
