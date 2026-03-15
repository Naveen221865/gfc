// ── PRACTICE PAGE FUNCTIONALITY ──

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeTheme();
});

// ── CAMPUS CHALLENGE FUNCTIONS ──
function solveCampusChallenge() {
    alert('Redirecting to campus challenge problem...\n\nProblem: Maximum Subarray Sum\n\nGood luck! Solve it and earn 10 club points!');
    window.open('https://practice.geeksforgeeks.org/problems/largest-sum-contiguous-subarray/', '_blank');
}

function viewCampusLeaderboard() {
    alert('Campus Challenge Leaderboard\n\n1. Rahul - 10 points\n2. Naveen - 8 points\n3. Ananya - 7 points\n4. Arjun - 6 points\n5. Priya - 5 points');
}

// ── TOGGLE HINTS ──
function toggleHints() {
    const hintsSection = document.getElementById('hintsSection');
    if (hintsSection.style.display === 'none') {
        hintsSection.style.display = 'block';
    } else {
        hintsSection.style.display = 'none';
    }
}

// ── TOGGLE SOLUTION ──
function toggleSolution() {
    const solutionSection = document.getElementById('solutionSection');
    if (solutionSection.style.display === 'none') {
        solutionSection.style.display = 'block';
    } else {
        solutionSection.style.display = 'none';
    }
}

// ── GENERATE RANDOM PROBLEM ──
function generateRandomProblem() {
    const problems = [
        {
            title: 'Two Sum',
            difficulty: 'Easy',
            topic: 'Arrays',
            description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
            link: 'https://practice.geeksforgeeks.org/problems/key-pair5616/1'
        },
        {
            title: 'Reverse String',
            difficulty: 'Easy',
            topic: 'Strings',
            description: 'Write a function that reverses a string.',
            link: 'https://practice.geeksforgeeks.org/problems/reverse-a-string/1'
        },
        {
            title: 'Palindrome Check',
            difficulty: 'Easy',
            topic: 'Strings',
            description: 'Check if a given string is a palindrome.',
            link: 'https://practice.geeksforgeeks.org/problems/palindrome-string/1'
        },
        {
            title: 'Merge Sorted Arrays',
            difficulty: 'Medium',
            topic: 'Arrays',
            description: 'Merge two sorted arrays into one sorted array.',
            link: 'https://practice.geeksforgeeks.org/problems/merge-sorted-arrays/1'
        },
        {
            title: 'Linked List Cycle',
            difficulty: 'Medium',
            topic: 'Linked Lists',
            description: 'Detect if a linked list has a cycle.',
            link: 'https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1'
        },
        {
            title: 'Binary Tree Traversal',
            difficulty: 'Medium',
            topic: 'Trees',
            description: 'Perform inorder, preorder, and postorder traversal of a binary tree.',
            link: 'https://practice.geeksforgeeks.org/problems/inorder-traversal/1'
        },
        {
            title: 'Graph BFS',
            difficulty: 'Medium',
            topic: 'Graphs',
            description: 'Implement Breadth-First Search on a graph.',
            link: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1'
        },
        {
            title: 'Fibonacci Series',
            difficulty: 'Easy',
            topic: 'Dynamic Programming',
            description: 'Find the nth Fibonacci number.',
            link: 'https://practice.geeksforgeeks.org/problems/fibonacci-number/1'
        },
        {
            title: 'Longest Common Subsequence',
            difficulty: 'Hard',
            topic: 'Dynamic Programming',
            description: 'Find the longest common subsequence of two strings.',
            link: 'https://practice.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1'
        },
        {
            title: 'Word Ladder',
            difficulty: 'Hard',
            topic: 'Graphs',
            description: 'Find the shortest path from one word to another by changing one letter at a time.',
            link: 'https://practice.geeksforgeeks.org/problems/word-ladder/1'
        }
    ];

    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    
    document.getElementById('randomTitle').textContent = randomProblem.title;
    document.getElementById('randomDifficulty').innerHTML = `<span class="difficulty-badge ${randomProblem.difficulty.toLowerCase()}">${randomProblem.difficulty}</span>`;
    document.getElementById('randomTopic').innerHTML = `<span class="topic-tag"><i class="fas fa-tag"></i> ${randomProblem.topic}</span>`;
    document.getElementById('randomDescription').textContent = randomProblem.description;
    document.getElementById('randomLink').href = randomProblem.link;
    
    document.getElementById('randomProblemDisplay').style.display = 'block';
    document.getElementById('randomProblemDisplay').scrollIntoView({ behavior: 'smooth' });
}

// ── FILTER BY TOPIC ──
function filterByTopic(topic) {
    alert(`Filtering problems by topic: ${topic}\n\nThis feature will show all ${topic} problems.`);
}

// ── INITIALIZE FILTERS ──
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const problemItems = document.querySelectorAll('.problem-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            problemItems.forEach(item => {
                if (filter === 'all' || item.dataset.difficulty === filter) {
                    item.style.display = '';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
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

// ── SCROLL REVEAL ANIMATION ──
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
