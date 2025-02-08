import { loadUserProfile } from './Profile.js';
import { timeAgo, fetchData, postData, deleteData } from './utils.js';


export async function loadMyPost(email) {
    if (!email) return;

    try {
        const data = await fetchData(`post/user/${email}`);
        if (data) {
            document.getElementById('main-container').innerHTML = '';
            data.forEach((post, index) => renderPost(post, index));
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

export async function loadLikePost(email) {
    if (!email) return

    const data = await fetchData(`post/liked/${email}`);
    if (data) {
        document.getElementById('follows-container').innerHTML = "";
        document.getElementById('main-container').innerHTML = "";

        data.forEach((post, index) => renderPost(post, index));
    }
}

export async function loadTags() {
    const data = await fetchData('tag/tagDTO');
    if (data) {
        const sortedTags = data.sort((a, b) => b.count - a.count);
        sortedTags.slice(0, 3).forEach(tag => renderTags(tag));
    }
}

export async function loadFollowers(userName) {
    try {
        const data = await fetchData(`follow/followers/${userName}`);

        if (data) {
            document.getElementById('follows-container').innerHTML = "";
            document.getElementById('main-container').innerHTML = "";
            data.forEach((user, index) => renderUsers(user, index));
        }
    } catch (error) {
        console.error('Error al cargar los seguidores:', error);
    }
}

export async function loadFollowing(userName) {
    try {
        const data = await fetchData(`follow/following/${userName}`);
        if (data) {
            document.getElementById('main-container').innerHTML = "";
            document.getElementById('follows-container').innerHTML = "";
            data.forEach((user, index) => renderUsers(user, index));
        }
    } catch (error) {
        console.error('Error al cargar los seguidos:', error);
    }
}

export async function CheckFollow(userName, currentUser) {
    try {
        const followers = await fetchData(`follow/followers/${userName}`);
        const following = await fetchData(`follow/following/${userName}`);

        const isFollowing = following.some(user => user.userName === currentUser);
        const isFollowedBy = followers.some(user => user.userName === currentUser);

        return isFollowing && isFollowedBy;
    } catch (error) {
        console.error('Error al verificar la relación de seguimiento:', error);
        return false;
    }
}

export async function loadPosts() {
    try {
        const data = await fetchData(`post`);
        if (data) {
            document.getElementById('main-container').innerHTML = '';
            data.forEach((post, index) => renderPost(post, index));
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

export async function followedPost(email) {
    try {
        const data = await fetchData(`post/my/${email}`);
        if (data) {
            document.getElementById('main-container').innerHTML = '';
            data.forEach((post, index) => renderPost(post, index));
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

export function renderUsers(user) {
    const template = document.getElementById('UserTemplate');

    const clone = template.content.cloneNode(true);

    clone.querySelector('#photo').src = user.photo;
    clone.querySelector('#username').textContent = `@${user.userName}`;
    clone.querySelector('#name').textContent = user.name;
    clone.querySelector('#bio').textContent = user.biography;
    const followButton = clone.querySelector('#follow');

    const currentUser = JSON.parse(localStorage.getItem('user'))?.userName;

    if (currentUser) {
        const result = CheckFollow(user.userName, currentUser);

        if (result) {
            followButton.textContent = "Unfollow";
        } else {
            followButton.textContent = "Follow";
        }
    }

    clone.querySelector('#name').addEventListener('click', () => {
        handleUserClick(user);
    });


    document.getElementById('main-container').appendChild(clone);
}

function toggleVisibility(element, show) {
    if (show) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}


const profileContainer = document.getElementById('profile-container');
const feedContainer = document.getElementById('feed-container');
const homeLink = document.getElementById('home-link');
const profileLink = document.getElementById('profile-link');

export function renderPost(data, index) {
    if (!data || !data.showPostDTO || !data.showPostDTO.user) return;
    const template = document.getElementById('post-template');
    const clone = template.content.cloneNode(true);
    const fragment = document.createDocumentFragment();

    const postDTO = data.showPostDTO;
    const user = postDTO.user;

    clone.querySelector('#photo').src = user.photo;
    clone.querySelector('#name').textContent = user.name;
    clone.querySelector('#userName').textContent = `@${user.userName}`;
    clone.querySelector('#post-content').textContent = postDTO.description;
    clone.querySelector('#comments-count').textContent = data.commentDTO.length;
    clone.querySelector('#likes-count').textContent = data.likePostDTO.length;
    clone.querySelector('#hour').textContent = timeAgo(postDTO.creationDate);

    clone.querySelector('#name').addEventListener('click', () => {
        handleUserClick(user);
    });

    const hashtagsContainer = clone.querySelector('#hashtags-container');
    data.tagDTO.forEach(tag => {
        const hashtagElement = document.createElement('a');
        hashtagElement.href = `#${tag.tagContent}`;
        hashtagElement.textContent = `#${tag.tagContent}`;
        hashtagElement.classList.add('mr-2', 'text-blue-900');
        hashtagsContainer.appendChild(hashtagElement);
    });

    const imagesContainer = clone.querySelector('#post-images-container');
    data.photoDTOurl.forEach(imageUrl => {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl.url;
        imgElement.alt = 'Imagen del post';
        imgElement.classList.add('rounded-2xl', 'w-full', 'max-w-sm', 'object-cover');
        imagesContainer.appendChild(imgElement);
    });

    const postcard = clone.querySelector('.postcard');
    if (index % 2 === 0) {
        postcard.classList.add('par');
    } else {
        postcard.classList.add('impar');
    }

    fragment.appendChild(clone);
    document.getElementById('main-container').appendChild(fragment);
}

export function renderTags(data) {
    const template = document.getElementById('tags-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('#tagstemplatename').textContent = `#${data.content}`;
    clone.querySelector('#tagstemplateposts').textContent = `${data.count} publicaciones`;

    document.getElementById('tendencias').appendChild(clone);
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    loadMyPost(email);
    loadLikePost(email)
    loadTags();
    followedPost(email)


    window.addEventListener('load', () => {
        toggleVisibility(profileContainer, false);
        toggleVisibility(feedContainer, true);
        toggleVisibility(profileLink, true);
        toggleVisibility(homeLink, false);
    });

    if (homeLink) {
        homeLink.addEventListener('click', () => {
            toggleVisibility(profileContainer, false);
            toggleVisibility(feedContainer, true);
            toggleVisibility(profileLink, true);
        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', () => {
            toggleVisibility(profileContainer, true);
            toggleVisibility(feedContainer, false);
            toggleVisibility(homeLink, true);
        });
    }


});


async function handleUserClick(user) {
    try {
        await loadUserProfile(user.email); 
        toggleVisibility(profileContainer, true); 
        toggleVisibility(feedContainer, false);
        toggleVisibility(homeLink, true); 
        toggleVisibility(profileLink, false); 
    } catch (error) {
        console.error('Error al manejar el clic del usuario:', error);
    }
}
