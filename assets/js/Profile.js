import { loadLikePost, loadMyPost, loadFollowers, loadFollowing, loadgallery } from './main.js';
import { fetchData } from './utils.js';

const localUser = JSON.parse(localStorage.getItem('user'));

const updateUserProfile = (user) => {
    document.getElementById('name').textContent = user.name;
    document.getElementById('userName').textContent = `@${user.userName}`;
    document.getElementById('biography').textContent = user.biography;
    document.getElementById('photo').src = user.photo;
};

const updateStats = async (user) => {
    if (user) {
        try {
            const [posts, followers, following] = await Promise.all([
                fetchData(`post/user/${user.email}`),
                fetchData(`follow/followers/${user.userName}`),
                fetchData(`follow/following/${user.userName}`)
            ]);

            document.getElementById('mypost').textContent = posts.length;
            document.getElementById('myfollowers').textContent = followers.length;
            document.getElementById('myfollowed').textContent = following.length;
        } catch (error) {
            showError('Error al obtener los datos.');
        }
    }
};

const showError = (message) => {
    console.error(message);
};

const handleButtonClick = (button, action) => {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    action();
};

const setupButtons = (userName, email) => {
    const forYouButton = document.querySelector('.post-button');
    const likesButton = document.querySelector('.likes-button');
    const gallery = document.querySelector('.photo-button');
    const followersButton = document.querySelector('#myfollowers');
    const followingButton = document.querySelector('#myfollowed');

    if (forYouButton) {
        forYouButton.addEventListener('click', () =>
            handleButtonClick(forYouButton, () => loadMyPost(email)));
    }

    if (likesButton) {
        likesButton.addEventListener('click', () =>
            handleButtonClick(likesButton, () => loadLikePost(email)));
    }

    if (followersButton) {
        followersButton.addEventListener('click', () =>
            handleButtonClick(followersButton, () => loadFollowers(userName)));
    }

    if (followingButton) {
        followingButton.addEventListener('click', () =>
            handleButtonClick(followingButton, () => loadFollowing(userName)));
    }

    if (gallery) {
        gallery.addEventListener('click', () =>
            handleButtonClick(gallery, () => loadgallery(email)));
    }

    if (forYouButton) {
        handleButtonClick(forYouButton, () => loadMyPost(email));
    }
};


export async function loadUserProfile(email) {
    try {
        console.log(`Cargando perfil para: ${email}`);
        const user = await fetchData(`users/${email}`);
        console.log('Usuario cargado:', user);

        if (user) {
            updateUserProfile(user);
            await updateStats(user);
            setupButtons(user.userName, user.email);
        } else {
            showError('El usuario no se encontró.');
        }
    } catch (error) {
        showError('Error al cargar el perfil del usuario.');
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let email = urlParams.get('email');

        if (!email && localUser) {
            email = localUser.email;  // Solo usa localStorage si no hay email en la URL
        }
        if (email) {
            await loadUserProfile(email);
            console.log(email);
        } else {
            showError('No se encontró el usuario local o el email proporcionado.');
        }
    } catch (error) {
        showError('Error al obtener los datos del usuario.');
    }
});
