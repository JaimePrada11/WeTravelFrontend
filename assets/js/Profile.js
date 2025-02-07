import { loadLikePost, loadMyPost } from './main.js';
import { fetchData } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        try {
            const [posts, followers, followed] = await Promise.all([
                fetchData(`post/user/${user.email}`),
                fetchData(`follow/followers/${user.userName}`),
                fetchData(`follow/following/${user.userName}`)
            ]);


            document.getElementById('name').textContent = user.name;
            document.getElementById('userName').textContent = `@${user.userName}`;
            document.getElementById('biography').textContent = user.biography;
            document.getElementById('photo').src = user.photo;

            document.getElementById('mypost').textContent = posts.length;  
            document.getElementById('myfollowers').textContent = followers.length;  
            document.getElementById('myfollowed').textContent = followed.length;  
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }

        const buttons = document.querySelectorAll('.button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });

        const forYouButton = document.querySelector('.post-button');
        const followingButton = document.querySelector('.likes-button');

        forYouButton.addEventListener('click', () => {
            forYouButton.classList.add('selected');
            followingButton.classList.remove('selected');
            loadMyPost();
        });

        followingButton.addEventListener('click', () => {
            followingButton.classList.add('selected');
            forYouButton.classList.remove('selected');
            loadLikePost();
        });
    }
});
