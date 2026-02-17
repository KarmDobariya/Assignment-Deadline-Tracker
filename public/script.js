let appState = {
    isLoggedIn: false,
    userRole: null,
    studentName: null,
    assignments: []
};

const API_BASE = 'http://localhost:5000/api';

function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
    }

    const navbar = document.getElementById('navbar');
    const mainTitle = document.getElementById('mainTitle');
    
    if (appState.isLoggedIn) {
        navbar.style.display = 'flex';
        mainTitle.style.display = 'block';
    } else {
        navbar.style.display = 'none';
        mainTitle.style.display = 'none';
    }

    if (pageName === 'login') {
        document.getElementById('roleSelection').style.display = 'block';
        document.getElementById('studentLoginForm').style.display = 'none';
        document.getElementById('teacherLoginForm').style.display = 'none';
    }

}

document.getElementById('studentRoleBtn').addEventListener('click', () => {
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('studentLoginForm').style.display = 'block';
});

document.getElementById('teacherRoleBtn').addEventListener('click', () => {
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('teacherLoginForm').style.display = 'block';
});


document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('studentLoginForm').style.display = 'none';
    resetStudentForm();
});

document.getElementById('teacherBackBtn').addEventListener('click', () => {
    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('teacherLoginForm').style.display = 'none';
    document.getElementById('teacherLoginForm').reset();
});


document.getElementById('studentLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;

    if (name && email && password) {
        loginAsStudent(name);
    } else {
        alert('Please fill in all fields');
    }
});

document.getElementById('teacherLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;

    if (name && email && password) {
        loginAsTeacher(name);
    } else {
        alert('Please fill in all fields');
    }
});


function loginAsStudent(name) {
    appState.isLoggedIn = true;
    appState.userRole = 'student';
    appState.studentName = name;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('studentName', name);

    resetStudentForm();
    updateNavbar();
    loadStudentDashboard();
    switchPage('student');
}

function loginAsTeacher(name) {
    appState.isLoggedIn = true;
    appState.userRole = 'teacher';

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'teacher');
    localStorage.setItem('teacherName', name);

    document.getElementById('teacherLoginForm').reset();
    document.getElementById('teacherLoginForm').style.display = 'none';

    updateNavbar();
    switchPage('teacher');
}

function resetStudentForm() {
    document.getElementById('studentLoginForm').reset();
    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('studentLoginForm').style.display = 'none';
}

function updateNavbar() {
    const navbar = document.getElementById('navbar');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (appState.isLoggedIn) {
        navbar.style.display = 'flex';
        dashboardBtn.style.display = appState.userRole === 'student' || appState.userRole === 'teacher' ? 'block' : 'none';
        logoutBtn.style.display = 'block';
    } else {
        navbar.style.display = 'none';
    }
}

document.getElementById('dashboardBtn').addEventListener('click', () => {
    if (appState.userRole === 'student') {
        loadStudentDashboard();
        switchPage('student');
    } else if (appState.userRole === 'teacher') {
        switchPage('teacher');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();

    appState.isLoggedIn = false;
    appState.userRole = null;
    appState.studentName = null;

    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('studentLoginForm').style.display = 'none';
    document.getElementById('teacherLoginForm').style.display = 'none';

    updateNavbar();
    switchPage('login');
});

async function loadStudentDashboard() {
    try {
        const response = await fetch(`${API_BASE}/assignments`);
        const assignments = await response.json();
        appState.assignments = assignments;

        const grid = document.getElementById('studentGrid');
        grid.innerHTML = '';

        const greeting = document.getElementById('studentGreeting');
        greeting.textContent = `Hello, ${appState.studentName}`;

        if (assignments.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1;">No assignments available yet.</p>';
            return;
        }

        assignments.forEach(assignment => {
            const card = createAssignmentCard(assignment);
            grid.appendChild(card);
        });

        startCountdowns();
    } catch (error) {
        console.error('Error loading assignments:', error);
        document.getElementById('studentGrid').innerHTML = '<p style="color: var(--error);">Error loading assignments</p>';
    }
}

function createAssignmentCard(assignment) {
    const card = document.createElement('div');
    card.className = 'glass-panel';
    card.style.padding = '1rem';
    card.style.marginBottom = '0';

    const deadline = new Date(assignment.deadline);
    const deadlineStr = deadline.toLocaleString();

    card.innerHTML = `
        <h3>${assignment.title}</h3>
        <p>${assignment.description || 'No description provided'}</p>
        <p><strong>Deadline:</strong> ${deadlineStr}</p>
        <p><strong>Max Score:</strong> ${assignment.maxScore}</p>
        <p><strong>Penalty:</strong> ${assignment.penaltyRate}% per hour</p>
        <p class="countdown" data-deadline="${assignment.deadline}"></p>
        <button class="submit-btn" data-id="${assignment._id}" style="margin-top: 1rem;">Submit Now</button>
    `;

    card.querySelector('.submit-btn').addEventListener('click', () => submitAssignment(assignment._id));

    return card;
}

async function submitAssignment(assignmentId) {
    try {
        const response = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        let message = `Submission Processed for ${appState.studentName}.\n\nScore: ${data.finalScore}`;
        if (data.penalty > 0) {
            message += `\nPenalty Applied: ${data.penalty.toFixed(2)} (Late by ${data.lateHours.toFixed(2)} hours)`;
        }

        alert(message);
    } catch (error) {
        console.error('Error submitting assignment:', error);
        alert('Error submitting assignment');
    }
}

function startCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    
    function updateCountdowns() {
        countdownElements.forEach(element => {
            const deadline = new Date(element.dataset.deadline);
            const now = new Date();
            const diff = deadline - now;

            if (diff <= 0) {
                element.textContent = 'Deadline Passed';
                element.classList.add('late');
                element.classList.remove('on-time');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                element.textContent = `${hours}h ${minutes}m ${seconds}s remaining`;
                element.classList.remove('late');
                element.classList.add('on-time');
            }
        });
    }

    updateCountdowns();
    setInterval(updateCountdowns, 1000);
}

document.getElementById('createAssignmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('assignTitle').value,
        description: document.getElementById('assignDescription').value,
        deadline: document.getElementById('assignDeadline').value,
        maxScore: parseFloat(document.getElementById('assignMaxScore').value),
        penaltyRate: parseFloat(document.getElementById('assignPenaltyRate').value)
    };

    try {
        const response = await fetch(`${API_BASE}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Assignment created successfully!');
            document.getElementById('createAssignmentForm').reset();
        } else {
            alert('Failed to create assignment');
        }
    } catch (error) {
        console.error('Error creating assignment:', error);
        alert('Error creating assignment');
    }
});

function init() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const studentName = localStorage.getItem('studentName');

    if (isLoggedIn && userRole) {
        appState.isLoggedIn = true;
        appState.userRole = userRole;
        appState.studentName = studentName;

        updateNavbar();

        if (userRole === 'student') {
            loadStudentDashboard();
            switchPage('student');
        } else if (userRole === 'teacher') {
            switchPage('teacher');
        }
    } else {
        switchPage('login');
    }
}

document.addEventListener('DOMContentLoaded', init);
