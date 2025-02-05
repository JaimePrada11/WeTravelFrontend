
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('name').textContent = user.name;
        document.getElementById('userName').textContent = `@${user.userName}`;
        document.getElementById('biography').textContent = user.biography;
        document.getElementById('photo').src = user.photo;
    }
});
