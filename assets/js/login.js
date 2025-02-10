document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = `http://localhost:8080/demo-0.0.1-SNAPSHOT/login?userName=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        if (!response.ok) {
            throw new Error('Invalid username or password');
        }

        const data = await response.json();
        const token = data.token; 
        localStorage.setItem('token', token); 

        const userResponse = await fetch('http://localhost:8080/demo-0.0.1-SNAPSHOT/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user info');
        }

        const users = await userResponse.json();
        const user = users.find(user => user.userName === userName);

        if (!user) {
            throw new Error('User not found');
        }

        const userInfo = {
            idUser: user.idUser,
            name: user.name,
            email: user.email,
            userName: user.userName,
            biography: user.biography,
            photo: user.photo,
            creationDate: user.creationDate,
            lastLogin: user.lastLogin,
            editionDate: user.editionDate
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));

        window.location.href = '/pages/main.html';
        alert('Login successful');
    } catch (error) {
        console.error('Error:', error);
        alert('Invalid username or password');
    }
});