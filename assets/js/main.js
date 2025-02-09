import { loadUserProfile } from './Profile.js';
import { timeAgo, fetchData, postData, deleteData } from './utils.js';


export async function loadDataUserForm() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            document.getElementById("current-profile-pic").src = user.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkGTV9ptpoJ1nv8SE8QJ_A4-pCjnd46axWiA&s";
            document.getElementById("name").value = user.name || '';
            document.getElementById("biography").value = user.biography || '';
        }
    } catch (error) {
        console.log(error)
    }
}


async function loadForYouNotificationsByUsername() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))

        const response = await fetchData(`notifications/${user.userName}`);

        if (response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        return response
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }
}

async function renderNotificsation() {
    const data = await loadForYouNotificationsByUsername();
    console.log(data);

    if (data) {
        document.getElementById('main-container').innerHTML = "";
        document.getElementById('follows-container').innerHTML = "";
        document.getElementById('not').innerHTML = "";

        const unreadNotifications = data.filter(element => !element.status); 

        unreadNotifications.forEach(element => {
            if (element.tipo === 'Comment') {
                loadNotificationComment(element);
            } else if (element.tipo === 'Like') {
                loadNotificationLike(element);
            } else if (element.tipo === 'Follow') {
                loadNotificationfollow(element);
            }
        });
    }
}


async function loadNotificationComment(element) {
    const template = document.getElementById('Noti-comment-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#profile-img').src = element.userPhoto;
    clone.querySelector('#name').textContent = `${element.name} has made you a comment`;
    clone.querySelector('#handle').textContent = `@${element.username}`;

    const checkButton = clone.querySelector('#checkButon');
    checkButton.addEventListener('click', async () => {
        await changeNotifcationstatus(element.idNotification);
    });

    document.getElementById('not').appendChild(clone);
}

async function loadNotificationLike(element) {
    const template = document.getElementById('Noti-like-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#profile-img').src = element.userPhoto;
    clone.querySelector('#name').textContent = `${element.name} has made you a Like`;
    clone.querySelector('#handle').textContent = `@${element.username}`;

    const checkButton = clone.querySelector('#checkButon');
    checkButton.addEventListener('click', async () => {
        await changeNotifcationstatus(element.idNotification);
    });

    document.getElementById('not').appendChild(clone);
}

async function loadNotificationfollow(element) {
    const template = document.getElementById('Noti-follow-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#profile-img').src = element.userPhoto;
    clone.querySelector('#name').textContent = `${element.name} has followed you`;
    clone.querySelector('#handle').textContent = `@${element.username}`;

    const checkButton = clone.querySelector('#checkButon');
    checkButton.addEventListener('click', async () => {
        await changeNotifcationstatus(element.idNotification);
    });

    document.getElementById('not').appendChild(clone);
}

async function changeNotifcationstatus(id) {
    try {
        const response = await postData(`notifications/read/${id}`);
        if (!response.status) {
            throw new Error('Error al marcar la notificación como leída');
        }

        const data = await loadForYouNotificationsByUsername();
        const updatedNotifications = data.map(notification => 
            notification.idNotification === id 
            ? { ...notification, status: true } 
            : notification
        );
        
        renderNotificsation(updatedNotifications);

    } catch (error) {
        console.error('Error marcando la notificación como leída:', error);
    }
}


export async function likedPost(email, idPost) {
    if (!email) return;
    try {
        const data = await postData(`like/likepost/${email}/${idPost}`);


    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}


export async function unlikedPost(idLike) {
    try {
        const data = await deleteData(`like/${idLike}`);

    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}


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
    if (!email) return;

    try {
        const data = await fetchData(`post/liked/${email}`);
        if (data) {
            document.getElementById('follows-container').innerHTML = "";
            document.getElementById('main-container').innerHTML = "";
            data.forEach((post, index) => renderPost(post, index));
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones que le gustaron al usuario:', error);
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
    console.log(`🔄 Cargando seguidores de: ${userName}`);
    try {
        const data = await fetchData(`follow/followers/${userName}`);
        console.log(`📢 Datos recibidos:`, data);

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
        console.log(userName);
        if (data) {
            document.getElementById('main-container').innerHTML = "";
            document.getElementById('follows-container').innerHTML = "";
            data.forEach((user) => renderUsers(user));
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
        console.log(email)
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
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    } else {
        console.error("Elemento no encontrado:", element);
    }
}



const profileContainer = document.getElementById('profile-container');
const feedContainer = document.getElementById('feed-container');
const notificationsContainer = document.getElementById('notifications-container');
const homeLink = document.getElementById('home-link');
const profileLink = document.getElementById('profile-link');
const notificationsLink = document.getElementById('notifications-link');
const searchLink = document.getElementById('search-link');
const searchContainer = document.getElementById('search-container');
const mainContainer = document.getElementById('main-container');


export function renderPost(data, index) {
    if (!data || !data.showPostDTO || !data.showPostDTO.user) return;
    const template = document.getElementById('post-template');
    const clone = template.content.cloneNode(true);
    const fragment = document.createDocumentFragment();

    const postDTO = data.showPostDTO;
    const user = postDTO.user;

    const currentUser = JSON.parse(localStorage.getItem('user'));

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



    const likeButton = clone.querySelector('#like-button');

    const userLike = data.likePostDTO ? data.likePostDTO.find(like => like.userName === currentUser.userName) : null;

    if (userLike) {
        likeButton.setAttribute('name', 'heart');
        likeButton.classList.add('likebutton');
    } else {
        likeButton.setAttribute('name', 'heart-outline');
    }


    likeButton.addEventListener('click', async () => {
        try {
            if (userLike) {
                await unlikedPost(userLike.idLike);
                likeButton.setAttribute('name', 'heart-outline');
            } else {
                await likedPost(currentUser.email, postDTO.postid);
                likeButton.setAttribute('name', 'heart');
            }
            await loadPosts();
        } catch (error) {
            console.error('Error al manejar el like/dislike:', error);
        }
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
    const handleUserClick = (email) => {
        loadMyPost(email);
        loadLikePost(email);
        loadTags();
        followedPost(email);
    };

    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser && localUser.email) {
        handleUserClick(localUser.email);
    } else {
        console.error("No se encontró el usuario local o su email.");
    }

    renderNotificsation()

    window.addEventListener('load', () => {
        toggleVisibility(profileContainer, false);
        toggleVisibility(feedContainer, true);
        toggleVisibility(notificationsContainer, false)

    });

    if (homeLink) {
        homeLink.addEventListener('click', () => {
            toggleVisibility(profileContainer, false);
            toggleVisibility(feedContainer, true);
            toggleVisibility(mainContainer, true)
            toggleVisibility(notificationsContainer, false)

        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', () => {
            toggleVisibility(profileContainer, true);
            toggleVisibility(feedContainer, false);
            toggleVisibility(notificationsContainer, false)
            toggleVisibility(mainContainer, true)


        });
    }

    if (notificationsLink) {
        notificationsLink.addEventListener('click', () => {
            toggleVisibility(profileContainer, false);
            toggleVisibility(feedContainer, false);
            toggleVisibility(feedContainer, false);
            toggleVisibility(notificationsContainer, true)
            toggleVisibility(mainContainer, false)
            toggleVisibility(searchContainer, false)



        })
    }

    if (searchLink) {
        searchLink.addEventListener('click', () => {
            toggleVisibility(profileContainer, false);
            toggleVisibility(feedContainer, false);
            toggleVisibility(feedContainer, false);
            toggleVisibility(notificationsContainer, false)
            toggleVisibility(searchContainer, true)
            toggleVisibility(mainContainer, false)

        })
    }


});


async function handleUserClick(user) {
    try {
        console.log(user)
        await loadUserProfile(user.email);
        toggleVisibility(profileContainer, true);
        toggleVisibility(feedContainer, false);
        toggleVisibility(homeLink, true);
        toggleVisibility(profileLink, true);
        toggleVisibility(notificationsContainer, false)
        toggleVisibility(mainContainer, true)
        toggleVisibility(searchContainer, false)


    } catch (error) {
        console.error('Error al manejar el clic del usuario:', error);
    }
}
