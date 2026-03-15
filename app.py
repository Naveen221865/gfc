from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3, hashlib, os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'gfg_campus_club_secret_default_change_me')

def get_db():
    conn = sqlite3.connect('club.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reg_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        year TEXT NOT NULL,
        password TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT NOT NULL,
        agenda TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        skills TEXT NOT NULL,
        max_participants INTEGER NOT NULL,
        prizes TEXT NOT NULL,
        speaker_name TEXT,
        speaker_role TEXT,
        speaker_bio TEXT,
        banner_url TEXT,
        is_past INTEGER DEFAULT 0
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        problems_solved INTEGER NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS problem_of_day (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        link TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS event_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        reg_no TEXT NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, reg_no),
        FOREIGN KEY(event_id) REFERENCES events(id)
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        topic TEXT NOT NULL,
        description TEXT NOT NULL,
        hint1 TEXT,
        hint2 TEXT,
        solution TEXT,
        time_estimate INTEGER,
        link TEXT
    )''')

    # Default admin
    admin_pass = hashlib.sha256('admin123'.encode()).hexdigest()
    c.execute("INSERT OR IGNORE INTO admins (email, password) VALUES (?, ?)", ('admin@gfg.com', admin_pass))

    # Sample events
    if not c.execute('SELECT 1 FROM events').fetchone():
        c.executemany('''INSERT INTO events (title, date, time, location, category, difficulty, description, agenda, eligibility, skills, max_participants, prizes, speaker_name, speaker_role, speaker_bio, banner_url, is_past) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', [
            ('DSA Bootcamp', '20 Aug 2026', '10:00 AM', 'Seminar Hall', 'Workshop', 'Beginner', 
             'Master data structures and algorithms from scratch with hands-on coding sessions.',
             '10:00 AM - Introduction | 10:30 AM - Arrays & Linked Lists | 11:30 AM - Trees & Graphs | 12:30 PM - Q&A',
             'All students (Year 1-4)', 'Basic C++/Python, Problem Solving', 150, 'Certificates for all participants',
             'Arun Kumar', 'Senior Software Engineer', 'Expert in DSA with 8+ years of experience at top tech companies.',
             'https://via.placeholder.com/400x200?text=DSA+Bootcamp', 0),
            ('Web Dev Workshop', '25 Aug 2026', '02:00 PM', 'Lab Block 3', 'Workshop', 'Intermediate',
             'Build modern full-stack web applications using React, Node.js, and MongoDB.',
             '02:00 PM - Frontend Basics | 03:00 PM - Backend Development | 04:00 PM - Database Design | 05:00 PM - Live Demo',
             'Year 2-4 students with basic programming knowledge', 'JavaScript, HTML/CSS, Basic Backend', 100, 'Certificates + Internship opportunities',
             'Priya Sharma', 'Full Stack Developer', 'Passionate about web development and mentoring junior developers.',
             'https://via.placeholder.com/400x200?text=Web+Dev+Workshop', 0),
            ('Competitive Coding Contest', '30 Aug 2026', '03:00 PM', 'Online – HackerRank', 'Contest', 'Advanced',
             'Compete with fellow coders in a 2-hour coding contest and win exciting prizes.',
             '03:00 PM - Contest Starts | 05:00 PM - Contest Ends | 05:30 PM - Winner Announcement',
             'All students with competitive programming experience', 'DSA, Problem Solving, Time Management', 200, '₹5000 for 1st | ₹3000 for 2nd | ₹1000 for 3rd',
             'Rahul Verma', 'Competitive Programmer', 'Codeforces Expert with multiple contest wins.',
             'https://via.placeholder.com/400x200?text=Coding+Contest', 0),
            ('Hackathon 2026', '15 Sep 2026', '09:00 AM', 'Main Auditorium', 'Hackathon', 'Intermediate',
             '24-hour hackathon where teams build innovative solutions to real-world problems.',
             '09:00 AM - Opening Ceremony | 10:00 AM - Hacking Begins | 09:00 AM (Next Day) - Submission Deadline | 11:00 AM - Judging & Awards',
             'Teams of 2-4 members, Year 1-4 students', 'Any programming language, Creativity, Teamwork', 300, '₹50000 prize pool + Internships',
             'Neha Gupta', 'Tech Lead & Mentor', 'Organized 10+ hackathons with 1000+ participants.',
             'https://via.placeholder.com/400x200?text=Hackathon+2026', 0),
            ('Guest Lecture: AI & ML', '10 Sep 2026', '04:00 PM', 'Auditorium', 'Guest Lecture', 'Beginner',
             'Learn about Artificial Intelligence and Machine Learning from industry experts.',
             '04:00 PM - Introduction to AI/ML | 04:30 PM - Real-world Applications | 05:15 PM - Q&A Session',
             'All students interested in AI/ML', 'Basic Python, Mathematics', 250, 'Certificates + Resource Materials',
             'Dr. Vikram Singh', 'AI Research Lead', 'PhD in Machine Learning, published 20+ research papers.',
             'https://via.placeholder.com/400x200?text=AI+ML+Lecture', 0),
            ('Coding Marathon 2025', '15 Aug 2025', '10:00 AM', 'Seminar Hall', 'Contest', 'Intermediate',
             'A 6-hour coding marathon where participants solved 10 challenging problems.',
             '10:00 AM - Contest Starts | 04:00 PM - Contest Ends | 04:30 PM - Results & Awards',
             'Year 2-4 students', 'DSA, Problem Solving', 120, 'Certificates + Prizes',
             'Naveen Kumar', 'Contest Organizer', 'Organized multiple successful coding events.',
             'https://via.placeholder.com/400x200?text=Coding+Marathon', 1),
        ])

    # Sample leaderboard
    if not c.execute('SELECT 1 FROM leaderboard').fetchone():
        c.executemany('INSERT INTO leaderboard (name, problems_solved) VALUES (?,?)', [
            ('Rahul', 420), ('Ananya', 380), ('Naveen', 350), ('Arjun', 320), ('Priya', 300),
        ])

    # Sample problem of the day
    if not c.execute('SELECT 1 FROM problem_of_day').fetchone():
        c.execute("INSERT INTO problem_of_day (title, difficulty, link) VALUES (?,?,?)",
                  ('Two Sum Problem', 'Easy', 'https://practice.geeksforgeeks.org/problems/key-pair5616/1'))

    # Sample achievements
    if not c.execute('SELECT 1 FROM achievements').fetchone():
        c.executemany('INSERT INTO achievements (icon, title, description) VALUES (?,?,?)', [
            ('🏆', 'Hackathon Champions 2025',   'Our team secured 1st place in a national-level hackathon.'),
            ('🥇', 'Coding Contest Winners',      'Club members topped the inter-college coding contest.'),
            ('💼', '20+ Students Placed',         'Our members landed roles at top tech companies this year.'),
            ('🚀', 'GfG Campus Star Award',       'Recognised as the most active GfG campus club of 2025.'),
        ])

    # Sample problems
    if not c.execute('SELECT 1 FROM problems').fetchone():
        problems_data = [
            ('Two Sum', 'Easy', 'Arrays', 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.', 'Use a hash map to store values', 'Check if complement exists in map', 'Use HashMap to store value and index', 15, 'https://practice.geeksforgeeks.org/problems/key-pair5616/1'),
            ('Reverse String', 'Easy', 'Strings', 'Write a function that reverses a string.', 'Use two pointers approach', 'Swap characters from both ends', 'Iterate from both ends and swap', 10, 'https://practice.geeksforgeeks.org/problems/reverse-a-string/1'),
            ('Palindrome Check', 'Easy', 'Strings', 'Check if a given string is a palindrome.', 'Compare characters from start and end', 'Use two pointer technique', 'Check if string equals its reverse', 12, 'https://practice.geeksforgeeks.org/problems/palindrome-string/1'),
            ('Merge Sorted Arrays', 'Medium', 'Arrays', 'Merge two sorted arrays into one sorted array.', 'Use two pointers', 'Compare elements from both arrays', 'Merge while maintaining order', 20, 'https://practice.geeksforgeeks.org/problems/merge-sorted-arrays/1'),
            ('Linked List Cycle', 'Medium', 'Linked Lists', 'Detect if a linked list has a cycle.', 'Use Floyd cycle detection', 'Use slow and fast pointers', 'Move slow by 1 and fast by 2', 25, 'https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1'),
            ('Binary Tree Traversal', 'Medium', 'Trees', 'Perform inorder, preorder, and postorder traversal of a binary tree.', 'Use recursion', 'Visit nodes in specific order', 'Implement DFS traversal', 30, 'https://practice.geeksforgeeks.org/problems/inorder-traversal/1'),
            ('Graph BFS', 'Medium', 'Graphs', 'Implement Breadth-First Search on a graph.', 'Use a queue', 'Visit nodes level by level', 'Implement BFS algorithm', 25, 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1'),
            ('Fibonacci Series', 'Easy', 'Dynamic Programming', 'Find the nth Fibonacci number.', 'Use memoization', 'Store computed values', 'Use DP array to store results', 15, 'https://practice.geeksforgeeks.org/problems/fibonacci-number/1'),
            ('Longest Common Subsequence', 'Hard', 'Dynamic Programming', 'Find the longest common subsequence of two strings.', 'Use 2D DP table', 'Compare characters and build table', 'Implement LCS algorithm', 45, 'https://practice.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1'),
            ('Word Ladder', 'Hard', 'Graphs', 'Find the shortest path from one word to another by changing one letter at a time.', 'Use BFS', 'Build graph of valid transformations', 'Implement BFS on word graph', 50, 'https://practice.geeksforgeeks.org/problems/word-ladder/1'),
            ('Maximum Subarray Sum', 'Medium', 'Arrays', 'Find the contiguous subarray with the largest sum.', 'Use Kadane algorithm', 'Track max ending here', 'Implement Kadane algorithm', 20, 'https://practice.geeksforgeeks.org/problems/largest-sum-contiguous-subarray/1'),
            ('Rotate Array', 'Easy', 'Arrays', 'Rotate an array to the right by k steps.', 'Reverse subarrays', 'Reverse three times', 'Use rotation technique', 15, 'https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements/1'),
            ('Valid Parentheses', 'Easy', 'Strings', 'Check if parentheses are balanced.', 'Use a stack', 'Push opening brackets', 'Match brackets using stack', 12, 'https://practice.geeksforgeeks.org/problems/parenthesis/1'),
            ('Lowest Common Ancestor', 'Medium', 'Trees', 'Find the lowest common ancestor of two nodes in a binary tree.', 'Use recursion', 'Search in left and right subtrees', 'Implement LCA algorithm', 30, 'https://practice.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1'),
            ('Coin Change', 'Medium', 'Dynamic Programming', 'Find the minimum number of coins needed to make a target amount.', 'Use DP array', 'Try all coin denominations', 'Implement coin change DP', 25, 'https://practice.geeksforgeeks.org/problems/coin-change/1'),
            ('Topological Sort', 'Hard', 'Graphs', 'Perform topological sorting on a directed acyclic graph.', 'Use DFS', 'Visit nodes and add to stack', 'Implement topological sort', 40, 'https://practice.geeksforgeeks.org/problems/topological-sort/1'),
            ('Median of Two Sorted Arrays', 'Hard', 'Arrays', 'Find the median of two sorted arrays.', 'Use binary search', 'Partition arrays correctly', 'Implement binary search approach', 50, 'https://practice.geeksforgeeks.org/problems/median-of-two-sorted-arrays/1'),
            ('Serialize Deserialize Tree', 'Hard', 'Trees', 'Serialize and deserialize a binary tree.', 'Use level order traversal', 'Store null markers', 'Implement serialization', 45, 'https://practice.geeksforgeeks.org/problems/serialize-deserialize-binary-tree/1'),
            ('Regular Expression Matching', 'Hard', 'Dynamic Programming', 'Implement regular expression matching with . and *.', 'Use 2D DP', 'Handle . and * cases', 'Implement regex matching DP', 60, 'https://practice.geeksforgeeks.org/problems/regular-expression-matching/1'),
            ('Alien Dictionary', 'Hard', 'Graphs', 'Derive the order of characters in an alien dictionary.', 'Use topological sort', 'Build graph from word pairs', 'Implement alien dictionary', 55, 'https://practice.geeksforgeeks.org/problems/alien-dictionary/1'),
        ]
        c.executemany('INSERT INTO problems (title, difficulty, topic, description, hint1, hint2, solution, time_estimate, link) VALUES (?,?,?,?,?,?,?,?,?)', problems_data)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def index():
    if 'user' in session and session['user']['role'] == 'student':
        return redirect(url_for('home'))
    return redirect(url_for('home'))

@app.route('/home')
def home():
    conn = get_db()
    events      = conn.execute('SELECT * FROM events ORDER BY id LIMIT 3').fetchall()
    leaderboard = conn.execute('SELECT * FROM leaderboard ORDER BY problems_solved DESC LIMIT 5').fetchall()
    problem     = conn.execute('SELECT * FROM problem_of_day ORDER BY id DESC LIMIT 1').fetchone()
    achievements= conn.execute('SELECT * FROM achievements').fetchall()
    conn.close()
    return render_template('home.html',
        user=session.get('user'), events=events,
        leaderboard=leaderboard, problem=problem,
        achievements=achievements)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/about')
def about():
    return render_template('about.html', user=session.get('user'))

@app.route('/events')
def events():
    conn = get_db()
    upcoming = conn.execute('SELECT * FROM events WHERE is_past = 0 ORDER BY date ASC').fetchall()
    past = conn.execute('SELECT * FROM events WHERE is_past = 1 ORDER BY date DESC').fetchall()
    conn.close()
    return render_template('events.html', user=session.get('user'), upcoming_events=upcoming, past_events=past)

@app.route('/event/<int:event_id>')
def event_detail(event_id):
    conn = get_db()
    event = conn.execute('SELECT * FROM events WHERE id = ?', (event_id,)).fetchone()
    registered_count = conn.execute('SELECT COUNT(*) FROM event_registrations WHERE event_id = ?', (event_id,)).fetchone()[0]
    conn.close()
    if not event:
        return redirect(url_for('events'))
    return jsonify({
        'id': event[0],
        'title': event[1],
        'date': event[2],
        'time': event[3],
        'location': event[4],
        'category': event[5],
        'difficulty': event[6],
        'description': event[7],
        'agenda': event[8],
        'eligibility': event[9],
        'skills': event[10],
        'max_participants': event[11],
        'prizes': event[12],
        'speaker_name': event[13],
        'speaker_role': event[14],
        'speaker_bio': event[15],
        'banner_url': event[16],
        'registered_count': registered_count,
        'seats_left': event[11] - registered_count
    })

@app.route('/register_event', methods=['POST'])
def register_event():
    if 'user' not in session or session['user']['role'] != 'student':
        return jsonify({'success': False, 'message': 'Please login to register for events.'})
    
    event_id = request.form.get('event_id')
    reg_no = session['user']['reg_no']
    
    try:
        conn = get_db()
        event = conn.execute('SELECT * FROM events WHERE id = ?', (event_id,)).fetchone()
        if not event:
            return jsonify({'success': False, 'message': 'Event not found.'})
        
        registered_count = conn.execute('SELECT COUNT(*) FROM event_registrations WHERE event_id = ?', (event_id,)).fetchone()[0]
        if registered_count >= event[11]:
            return jsonify({'success': False, 'message': 'Event is full. No more seats available.'})
        
        conn.execute('INSERT INTO event_registrations (event_id, reg_no) VALUES (?, ?)', (event_id, reg_no))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': f'Successfully registered for {event[1]}!'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'You are already registered for this event.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/student_login', methods=['POST'])
def student_login():
    reg_no = request.form.get('reg_no', '').strip()
    password = request.form.get('password', '').strip()

    if len(reg_no) != 13 or not reg_no.isdigit():
        return jsonify({'success': False, 'message': 'Register number must be exactly 13 digits.'})

    conn = get_db()
    student = conn.execute("SELECT * FROM students WHERE reg_no = ? AND password = ?",
                           (reg_no, hash_password(password))).fetchone()
    conn.close()

    if student:
        session['user'] = {'role': 'student', 'name': student['name'], 'reg_no': reg_no}
        return jsonify({'success': True, 'redirect': url_for('student_dashboard')})
    return jsonify({'success': False, 'message': 'Invalid register number or password.'})

@app.route('/admin_login', methods=['POST'])
def admin_login():
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '').strip()

    conn = get_db()
    admin = conn.execute("SELECT * FROM admins WHERE email = ? AND password = ?",
                         (email, hash_password(password))).fetchone()
    conn.close()

    if admin:
        session['user'] = {'role': 'admin', 'email': email}
        return jsonify({'success': True, 'redirect': url_for('admin_dashboard')})
    return jsonify({'success': False, 'message': 'Invalid email or password.'})

@app.route('/register', methods=['POST'])
def register():
    reg_no = request.form.get('reg_no', '').strip()
    name = request.form.get('name', '').strip()
    department = request.form.get('department', '').strip()
    year = request.form.get('year', '').strip()
    password = request.form.get('password', '').strip()
    confirm = request.form.get('confirm_password', '').strip()

    if len(reg_no) != 13 or not reg_no.isdigit():
        return jsonify({'success': False, 'message': 'Register number must be exactly 13 digits.'})
    if password != confirm:
        return jsonify({'success': False, 'message': 'Passwords do not match.'})
    if len(password) < 8:
        return jsonify({'success': False, 'message': 'Password must be at least 8 characters.'})

    try:
        conn = get_db()
        conn.execute("INSERT INTO students (reg_no, name, department, year, password) VALUES (?, ?, ?, ?, ?)",
                     (reg_no, name, department, year, hash_password(password)))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Account created successfully!'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'This register number is already registered.'})

@app.route('/student_dashboard')
def student_dashboard():
    if 'user' not in session or session['user']['role'] != 'student':
        return redirect(url_for('login'))
    conn = get_db()
    events      = conn.execute('SELECT * FROM events ORDER BY id LIMIT 3').fetchall()
    leaderboard = conn.execute('SELECT * FROM leaderboard ORDER BY problems_solved DESC LIMIT 5').fetchall()
    problem     = conn.execute('SELECT * FROM problem_of_day ORDER BY id DESC LIMIT 1').fetchone()
    achievements= conn.execute('SELECT * FROM achievements').fetchall()
    conn.close()
    return render_template('home.html',
        user=session['user'], events=events,
        leaderboard=leaderboard, problem=problem,
        achievements=achievements)

@app.route('/admin_dashboard')
def admin_dashboard():
    if 'user' not in session or session['user']['role'] != 'admin':
        return redirect(url_for('login'))
    return f"<h2>Welcome, Admin! 🎉</h2><p>Admin Dashboard coming soon...</p><a href='/logout'>Logout</a>"

@app.route('/practice')
def practice():
    conn = get_db()
    problems = conn.execute('SELECT * FROM problems ORDER BY RANDOM() LIMIT 20').fetchall()
    leaderboard = conn.execute('SELECT * FROM leaderboard ORDER BY problems_solved DESC LIMIT 10').fetchall()
    conn.close()
    return render_template('practice.html', user=session.get('user'), problems=problems, leaderboard=leaderboard)

@app.route('/leaderboard')
def leaderboard():
    conn = get_db()
    leaderboard = conn.execute('SELECT * FROM leaderboard ORDER BY problems_solved DESC LIMIT 100').fetchall()
    conn.close()
    return render_template('leaderboard.html', user=session.get('user'), leaderboard=leaderboard)

@app.route('/resources')
def resources():
    return render_template('resources.html', user=session.get('user'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
