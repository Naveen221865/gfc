// Bookmark functionality
let bookmarks = JSON.parse(localStorage.getItem('resourceBookmarks')) || [];

function bookmarkResource(resourceName) {
    const btn = event.target.closest('.bookmark-btn');
    
    if (bookmarks.includes(resourceName)) {
        bookmarks = bookmarks.filter(b => b !== resourceName);
        btn.classList.remove('bookmarked');
        btn.innerHTML = '<i class="far fa-star"></i>';
        showNotification('Removed from bookmarks', 'info');
    } else {
        bookmarks.push(resourceName);
        btn.classList.add('bookmarked');
        btn.innerHTML = '<i class="fas fa-star"></i>';
        showNotification('Added to bookmarks', 'success');
    }
    
    localStorage.setItem('resourceBookmarks', JSON.stringify(bookmarks));
    updateBookmarksDisplay();
}

function updateBookmarksDisplay() {
    const bookmarkedList = document.getElementById('bookmarkedList');
    const bookmarksSection = document.getElementById('bookmarks');
    
    if (bookmarks.length === 0) {
        bookmarksSection.style.display = 'none';
        return;
    }
    
    bookmarksSection.style.display = 'block';
    bookmarkedList.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-item">
            <span class="bookmark-item-name"><i class="fas fa-bookmark"></i> ${bookmark}</span>
            <button class="remove-bookmark" onclick="removeBookmark('${bookmark}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeBookmark(resourceName) {
    bookmarks = bookmarks.filter(b => b !== resourceName);
    localStorage.setItem('resourceBookmarks', JSON.stringify(bookmarks));
    updateBookmarksDisplay();
    
    const btn = document.querySelector(`[onclick="bookmarkResource('${resourceName}')"]`);
    if (btn) {
        btn.classList.remove('bookmarked');
        btn.innerHTML = '<i class="far fa-star"></i>';
    }
    showNotification('Bookmark removed', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize bookmarks on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBookmarksDisplay();
    
    // Mark already bookmarked items
    bookmarks.forEach(bookmark => {
        const btn = document.querySelector(`[onclick="bookmarkResource('${bookmark}')"]`);
        if (btn) {
            btn.classList.add('bookmarked');
            btn.innerHTML = '<i class="fas fa-star"></i>';
        }
    });
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // Initialize search with suggestions
    initSearchSuggestions();
    
    // Initialize filter functionality
    initFilters();
});

// Enhanced search functionality with suggestions
function initSearchSuggestions() {
    const searchInput = document.getElementById('resourceSearch');
    const suggestions = [
        'Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming',
        'Python', 'Java', 'C++', 'JavaScript', 'Web Development',
        'Interview Questions', 'System Design', 'Competitive Programming'
    ];
    
    let suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsContainer);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            filterContent('');
            return;
        }
        
        const matches = suggestions.filter(s => s.toLowerCase().includes(query));
        
        if (matches.length > 0) {
            suggestionsContainer.innerHTML = matches.map(match => 
                `<div class="search-suggestion" onclick="selectSuggestion('${match}')">${match}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
        
        filterContent(query);
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('resourceSearch');
    searchInput.value = suggestion;
    document.querySelector('.search-suggestions').style.display = 'none';
    filterContent(suggestion.toLowerCase());
}

// Enhanced content filtering
function filterContent(query) {
    const cards = document.querySelectorAll('.topic-card, .language-card, .interview-card, .sheet-card, .video-card, .download-card, .aptitude-card, .recommended-card, .competitive-card, .webdev-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const isVisible = query === '' || text.includes(query);
        card.style.display = isVisible ? 'block' : 'none';
        
        if (isVisible && query !== '') {
            card.style.animation = 'fadeInUp 0.5s ease';
        }
    });
    
    // Show/hide sections based on content
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.topic-card:not([style*="display: none"]), .language-card:not([style*="display: none"]), .interview-card:not([style*="display: none"]), .sheet-card:not([style*="display: none"]), .video-card:not([style*="display: none"]), .download-card:not([style*="display: none"]), .aptitude-card:not([style*="display: none"]), .recommended-card:not([style*="display: none"]), .competitive-card:not([style*="display: none"]), .webdev-card:not([style*="display: none"])');
        
        if (query === '' || visibleCards.length > 0 || section.classList.contains('resources-header') || section.classList.contains('roadmap-section') || section.classList.contains('categories-section')) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Filter functionality
function initFilters() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-tags';
    filterContainer.innerHTML = `
        <div class="filter-tag active" onclick="filterByCategory('all')">All</div>
        <div class="filter-tag" onclick="filterByCategory('easy')">Easy</div>
        <div class="filter-tag" onclick="filterByCategory('medium')">Medium</div>
        <div class="filter-tag" onclick="filterByCategory('hard')">Hard</div>
        <div class="filter-tag" onclick="filterByCategory('beginner')">Beginner</div>
        <div class="filter-tag" onclick="filterByCategory('advanced')">Advanced</div>
    `;
    
    const dsaSection = document.querySelector('.dsa-section .container');
    if (dsaSection) {
        dsaSection.insertBefore(filterContainer, dsaSection.querySelector('.topics-grid'));
    }
}

function filterByCategory(category) {
    // Update active filter
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('.topic-card');
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const difficulty = card.querySelector('.difficulty span');
            const text = card.textContent.toLowerCase();
            
            if ((difficulty && difficulty.textContent.toLowerCase() === category) || 
                text.includes(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open resource in new tab
function openResource(url) {
    window.open(url, '_blank');
    showNotification('Opening resource in new tab', 'info');
}

// Download file
function downloadFile(filename) {
    showNotification(`Download started for ${filename}`, 'success');
    // In a real implementation, this would trigger an actual download
    console.log(`Downloading: ${filename}`);
}

// Progress tracking (for future implementation)
function updateProgress(topic, progress) {
    localStorage.setItem(`progress_${topic}`, progress);
    const progressBar = document.querySelector(`[data-topic="${topic}"] .progress-fill`);
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Add loading states
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}
