import { followedPost, loadPosts } from './main.js';
const localUser = JSON.parse(localStorage.getItem('user'));

const setupButtons = (email) => {
    const buttons = document.querySelectorAll('.button');

    const handleButtonClick = (button) => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => handleButtonClick(button));
    });

    const forYouButton = document.querySelector('#recomend-button');
    const followersButton = document.querySelector('#following-button');

    const loadForYouPosts = () => {
        handleButtonClick(forYouButton);
        loadPosts();
    };

    const loadFollowersPosts = () => {
        handleButtonClick(followersButton);
        followedPost(email);
    };

    if (forYouButton) {
        forYouButton.addEventListener('click', loadForYouPosts);
    }

    if (followersButton) {
        followersButton.addEventListener('click', loadFollowersPosts);
    }

    if (forYouButton) {
        loadForYouPosts();
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (localUser && localUser.email) {
            setupButtons(localUser.email);
        } else {
            throw new Error('No se encontró el usuario local.');
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
});
