import { loadLikePost, loadMyPost, loadFollowers, loadFollowing } from './main.js';
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

const setupButtons = (userName, email) => {
    const buttons = document.querySelectorAll('.button');

    const handleButtonClick = (button, action) => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        action();
    };

    buttons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.replaceWith(newButton);

    });


    const forYouButton = document.querySelector('.post-button');
    const likesButton = document.querySelector('.likes-button');
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

    if (forYouButton) {
        handleButtonClick(forYouButton, () => loadMyPost(email));
    }
};


export async function loadUserProfile(email) {
    try {
        const user = await fetchData(`users/${email}`);
        if (user) {
            updateUserProfile(user);
            await updateStats(user);
            setupButtons(user.userName, user.email);
        }
    } catch (error) {
        showError('Error al cargar el perfil del usuario.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const email = new URLSearchParams(window.location.search).get('email') || (localUser && localUser.email);
        if (email) {
            await loadUserProfile(email);
            console.log(email)
        } else {
            showError('No se encontró el usuario local o el email proporcionado.');
        }
    } catch (error) {
        showError('Error al obtener los datos del usuario.');
    }
});