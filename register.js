document.addEventListener('DOMContentLoaded', function() {
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
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(function(error) {
            error.remove();
        });
    }

    function validateSection1() {
        const fullName = document.getElementById('full-name').value.trim();
        clearErrors();
        if (!fullName) {
            showError(document.getElementById('full-name'), 'Please enter your full name.');
            return false;
        }
        return true;
    }

    function validateSection2() {
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        clearErrors();
        if (!email) {
            showError(document.getElementById('email'), 'Please enter an email address.');
            return false;
        }
        if (!email.match(emailPattern)) {
            showError(document.getElementById('email'), 'Please enter a valid email address.');
            return false;
        }
        if (!username) {
            showError(document.getElementById('username'), 'Please enter a username.');
            return false;
        }
        return true;
    }

    next1.addEventListener('click', function() {
        if (validateSection1()) {
            section1.style.display = 'none';
            section2.style.display = 'block';
        }
    });

    next2.addEventListener('click', function() {
        if (validateSection2()) {
            section2.style.display = 'none';
            section3.style.display = 'block';
        }
    });

    back2.addEventListener('click', function() {
        section2.style.display = 'none';
        section1.style.display = 'block';
    });

    back3.addEventListener('click', function() {
        section3.style.display = 'none';
        section2.style.display = 'block';
    });

    document.getElementById('login-form').addEventListener('submit', function(event) {
        const password = document.getElementById('password').value.trim();
        const repeatPassword = document.getElementById('repeat-password').value.trim();

        clearErrors();
        if (!password || !repeatPassword) {
            showError(document.getElementById('password'), 'Please enter your password.');
            showError(document.getElementById('repeat-password'), 'Please repeat your password.');
            event.preventDefault();
            return false;
        }

        if (password !== repeatPassword) {
            showError(document.getElementById('repeat-password'), 'Passwords do not match.');
            event.preventDefault();
            return false;
        }

        return true;
    });
});
