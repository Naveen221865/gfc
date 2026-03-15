function showForm(role) {
    document.getElementById('role-selection').classList.add('hidden');
    document.getElementById(role + '-form').classList.remove('hidden');
}

function showRoles() {
    document.getElementById('student-form').classList.add('hidden');
    document.getElementById('admin-form').classList.add('hidden');
    document.getElementById('role-selection').classList.remove('hidden');
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}
