import { loadLikePost, loadMyPost, loadFollowers, loadFollowing } from './main.js';
import { fetchData } from './utils.js';

const localUser = JSON.parse(localStorage.getItem('user'));
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

const updateUserProfile = (user) => {
    document.getElementById('name').textContent = user.name;
    document.getElementById('userName').textContent = `@${user.userName}`;
    document.getElementById('biography').textContent = user.biography;
    document.getElementById('photo').src = user.photo;
};

const updateStats = async (user) => {
    if (user) {
        try {
            const [posts, followers, followed] = await Promise.all([
                fetchData(`post/user/${user.email}`),
                fetchData(`follow/followers/${user.userName}`),
                fetchData(`follow/following/${user.userName}`)
            ]);

            document.getElementById('mypost').textContent = posts.length;
            document.getElementById('myfollowers').textContent = followers.length;
            document.getElementById('myfollowed').textContent = followed.length;
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }
};

const setupButtons = (userName, email) => {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    const forYouButton = document.querySelector('.post-button');
    const followingButton = document.querySelector('.likes-button');
    const followersButton = document.querySelector('#myfollowers');
    const myfollowingButton = document.querySelector('#myfollowed');

    if (forYouButton) {
        forYouButton.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            forYouButton.classList.add('selected');
            loadMyPost(email);
        });
    }

    if (followingButton) {
        followingButton.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            followingButton.classList.add('selected');
            loadLikePost(email);
        });
    }

    if (followersButton) {
        followersButton.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            followersButton.classList.add('selected');
            loadFollowers(userName);
        });
    }

    if (myfollowingButton) {
        myfollowingButton.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            myfollowingButton.classList.add('selected');
            loadFollowing(userName);
        });
    }

    if (forYouButton) {
        forYouButton.classList.add('selected');
        loadMyPost(email);
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
        console.error('Error al cargar el perfil del usuario:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        let currentUser = email 
            ? await fetchData(`users/${email}`) 
            : localUser;

        if (currentUser && currentUser.email) {
            updateUserProfile(currentUser);
            await updateStats(currentUser);
            setupButtons(currentUser.userName, currentUser.email);
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
});

