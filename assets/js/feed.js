import { followedPost, loadPosts } from './main.js';
import { fetchData } from './utils.js';

const localUser = JSON.parse(localStorage.getItem('user'));
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

const setupButtons = (email) => {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            
            button.classList.add('selected');
        });
    });

    console.log(email)

    const forYouButton = document.querySelector('#recomend-button');
    const followersButton = document.querySelector('#following-button');

    if (forYouButton) {
        forYouButton.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            forYouButton.classList.add('selected');
            loadPosts();
        });
    }

    if (followersButton) {
        followersButton.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            followersButton.classList.add('selected');
            followedPost(email);
        });
    }

    if (forYouButton) {
        forYouButton.classList.add('selected');
        loadPosts();
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    try {
            let currentUser = email 
                ? await fetchData(`users/${email}`) 
                : localUser;
    
            if (currentUser) {

                setupButtons(currentUser.email);
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
});
