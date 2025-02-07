document.addEventListener('DOMContentLoaded', function () {
    const next1 = document.getElementById('next-1');
    const next2 = document.getElementById('next-2');
    const back2 = document.getElementById('back-2');
    const back3 = document.getElementById('back-3');
    const section1 = document.getElementById('section-1');
    const section2 = document.getElementById('section-2');
    const section3 = document.getElementById('section-3');

    function showError(input, message) {
        let errorDiv = input.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            input.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
    }

    function validateSection1() {
        const fullName = document.getElementById('full-name');
        clearErrors();
        if (!fullName.value.trim()) {
            showError(fullName, 'Please enter your full name.');
            return false;
        }
        return true;
    }

    async function fetchUsers() {
        const response = await fetch('http://localhost:8080/api/users');
        const data = await response.json();
        return data;
    }

    async function isEmailInUse(email) {
        const users = await fetchUsers();
        return users.some(user => user.email === email);
    }

    async function isUsernameInUse(username) {
        const users = await fetchUsers();
        return users.some(user => user.userName === username);
    }

    async function validateSection2() {
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        clearErrors();
        if (!email.value.trim()) {
            showError(email, 'Please enter an email address.');
            return false;
        }
        if (!email.value.match(emailPattern)) {
            showError(email, 'Please enter a valid email address.');
            return false;
        }
        if (!username.value.trim()) {
            showError(username, 'Please enter a username.');
            return false;
        }

        if (await isEmailInUse(email.value.trim())) {
            showError(email, 'This email is already in use.');
            return false;
        }
        if (await isUsernameInUse(username.value.trim())) {
            showError(username, 'This username is already in use.');
            return false;
        }

        return true;
    }

    next1.addEventListener('click', function () {
        if (validateSection1()) {
            section1.style.display = 'none';
            section2.style.display = 'block';
        }
    });

    next2.addEventListener('click', async function () {
        if (await validateSection2()) {
            section2.style.display = 'none';
            section3.style.display = 'block';
        }
    });

    back2.addEventListener('click', function () {
        section2.style.display = 'none';
        section1.style.display = 'block';
    });

    back3.addEventListener('click', function () {
        section3.style.display = 'none';
        section2.style.display = 'block';
    });

    section1.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            next1.click();
        }
    });

    section2.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            next2.click();
        }
    });

    document.getElementById('register-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const repeatPassword = document.getElementById('repeat-password');

        email.focus();
        username.focus();
        password.focus();
        repeatPassword.focus();

        clearErrors();

        if (!email.value.trim()) {
            showError(email, 'Please enter an email address.');
            return;
        }
        if (!username.value.trim()) {
            showError(username, 'Please enter a username.');
            return;
        }
        if (!password.value.trim() || !repeatPassword.value.trim()) {
            showError(password, 'Please enter your password.');
            showError(repeatPassword, 'Please repeat your password.');
            return;
        }

        if (password.value !== repeatPassword.value) {
            showError(repeatPassword, 'Passwords do not match.');
            return;
        }

        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters.');
            return;
        }

        const fullName = document.getElementById('full-name').value.trim();
        const formData = {
            name: fullName,
            email: email.value.trim(),
            userName: username.value.trim(),
            password: password.value
        };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Registration error');
            }

            const text = await response.text(); 

            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                data = { message: text };
            }

            if (!response.ok) {
                throw new Error(data.message || 'Registration error');
            }

            alert('Registered successfully');
            window.location.href = "../index.html";
        } catch (error) {
            console.error('Error:', error);
            showError(document.getElementById('register-form'), 'Registration failed.');
        }
    });
});
