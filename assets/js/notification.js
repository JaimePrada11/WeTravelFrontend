async function loadForYou() {
    try {
        const token = localStorage.getItem('token');
        const user= localStorage.getItem('user');
        const username = user.userName;
        console.log(user);
        console.log(username);
        const response = await fetch(`http://localhost:8080/api/notifications/${user.userName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        const data = await response.json();
        console.log(data)
        document.getElementById('post-container').innerHTML = '';
        data.forEach((post, index) => renderPost(post, index));
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }
}
loadForYou();