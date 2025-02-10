import { timeAgo, fetchData, postData, deleteData, putData, patchData } from './utils.js';
const currentUser = JSON.parse(localStorage.getItem('user'))


//Funcion para limpirar el localStorage
function clearLocalStorage() {
    localStorage.clear();
    console.log("El localStorage ha sido borrado.");
}

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        clearLocalStorage();
    });
}

// ENDPOINTS


// USERS

//Actualizar usuario
export async function updateUser(newData) {
    try {

        const response = await putData(`users/update/${currentUser.email}`, newData);

        if (response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        return response
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }

}



//FOLLOW

// Seguir a un usuario
export async function followUser(email) {
    try {

        const response = await postData(`follow/ad/${currentUser.email}/${email}`);

        if (response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        return response
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }

}

// Dejar de seguir a un usuario
export async function UnfollowUser(email) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('user'))

        const response = await deleteData(`follow/ad/${currentUser.email}/${email}`);

        if (response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        return response
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }

}

// Verificar si se siguen los usuarios
export async function CheckFollow(userName) {
    try {
        const followers = await fetchData(`follow/followers/${userName}`);
        const following = await fetchData(`follow/following/${userName}`);

        const currentUser = localStorage.getItem('user').userName;
        const isFollowing = following.some(user => user.userName === currentUser);
        const isFollowedBy = followers.some(user => user.userName === currentUser);

        return isFollowing && isFollowedBy;
    } catch (error) {
        console.error('Error al verificar la relación de seguimiento:', error);
        return false;
    }
}


// Cargar los seguidores de un usuario
export async function loadFollowers(userName) {
    try {
        const data = await fetchData(`follow/followers/${userName}`);

        if (data) {
            document.getElementById('follows-container').innerHTML = "";
            document.getElementById('main-container').innerHTML = "";
            data.forEach((user) => renderUsers(user));
        }
    } catch (error) {
        console.error('Error al cargar los seguidores:', error);
    }
}

// Cargar los seguidos de un usuario
export async function loadFollowing(userName) {
    try {
        const data = await fetchData(`follow/following/${userName}`);
        if (data) {
            document.getElementById('main-container').innerHTML = "";
            document.getElementById('follows-container').innerHTML = "";
            data.forEach((user) => renderUsers(user));
        }
    } catch (error) {
        console.error('Error al cargar los seguidos:', error);
    }
}



// TAGS

// Obtener los post de un tag
async function loadPostTags(tag) {

    try {
        const response = await fetchData(`post/tag/${tag}`);

        if (!response.ok) {
            throw new Error('Error al obtener los tags');
        }
        return response;


    } catch (error) {
        console.error('Error cargando post:', error);
    }
}

// Obtener tag mas usados
export async function loadTags() {
    const data = await fetchData('tag/tagDTO');
    if (data) {
        const sortedTags = data.sort((a, b) => b.count - a.count);
        sortedTags.slice(0, 3).forEach(tag => renderTags(tag));
    }
}



//NOTIFICACIONES

// Obtener las notificaciones por usuario
async function loadForYouNotificationsByUsername() {
    try {

        const response = await fetchData(`notifications/${currentUser.userName}`);

        if (response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        return response
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }
}

// Cambiar las notificaciones a leidas
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



// COMMENTS

// Cargar un comentario
export async function loadComment(idComent) {
    try {
        const data = await fetchData(`comment/findId/${idComent}`);

        return data

    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

//Crear un comentario
export async function CommentPost(idPost, comment) {

    try {
        const data = await postData(`comment/${currentUser.email}/${idPost}`, comment);

        if (!data.ok) {
            throw new Error('Error al crear comentario');
        }
        return data

    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

// Actualizar Comentario
export async function UpdateComment(idComent, newData) {
    try {
        const data = await putData(`comment/${idComent}`, newData);

        
        return data


    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

// Eliminar Comentario
export async function deleteComment(idComment) {
    try {
        const data = await deleteData(`comment/${idComment}`);
        if (!data.ok) {
            throw new Error('Error al eliminar comentario');
        }
        return data

    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}



//LIKES

// Dar like a un post
export async function likedPost( idPost) {
    try {
        const data = await postData(`like/likepost/${currentUser.email}/${idPost}`);


    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

// Quitar el like a un post
export async function unlikedPost(idLike) {
    try {
        const data = await deleteData(`like/${idLike}`);

    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

// Dar like a un commentario
export async function likedComment( idPost) {
    try {
        const data = await postData(`like/likecomment/${currentUser.email}/${idPost}`);


    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

// Quitar el like a un commentario
export async function unlikeComment(idLike) {
    try {
        const data = await deleteData(`like/${idLike}`);

    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}


// PHOTOS

// Cargar las fotos de un usuario
export async function loadgallery(email) {
    try {
        const data = await fetchData(`photo/user/${email}`);
        if (data) {
            document.getElementById('main-container').innerHTML = "";
            document.getElementById('follows-container').innerHTML = "";
            console.log(data);


            const galleryContainer = document.createElement('div');
            galleryContainer.classList.add('gallery');

            data.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.alt = 'Imagen de la galería';
                imgElement.classList.add('gallery-img');

                galleryContainer.appendChild(imgElement);
            });

            document.getElementById('main-container').appendChild(galleryContainer);
        }
    } catch (error) {
        console.error('Error al cargar los seguidos:', error);
    }
}



// POST

// crear un post
async function createPost(createPostDTO) {

    try {
        const email = currentUser.email;
        const response = await postData(`post/${email}`, createPostDTO)
        if (!response.ok) {
            throw new Error('Creation post is not okay');
        }

        return response
    } catch (error) {
        console.error('Error Creating your post:', error);
    }


}

// Actualizar un post
async function updatePost(postId, updatePostDTO) {
    try {
        const response = await putData(`post/${postId}`, updatePostDTO);

        return response;
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

// Eliminar un post
async function deletePost(postId) {
    try {
        const response = await deleteData(`post/${postId}`);

        if (!response.ok) {
            throw new Error('Update post failed');
        }
        return response;
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

// Cargar los post de un usuario
export async function loadMyPost(email) {
    if (!email) return;
    try {
        const data = await fetchData(`post/user/${email}`);

        console.log(data)
        console.log(email)

        if (data) {
            document.getElementById('main-container').innerHTML = '';
            data.forEach((post, index) => renderPost(post, index));
        }
    } catch (error) {
        console.error('Error al cargar las publicaciones del usuario:', error);
    }
}

// Cargar los post con likes de un usuario
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


// Cargar todos los post activos para recomendados
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

// Cargar los post de un usuarios seguidos
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



// RENDERIZACIONES

// Cargar los comentarios
export function renderComments(comments, container) {
    container.innerHTML = "";

    comments.forEach(data => {
        const template = document.getElementById('comments');
        const clone = template.content.cloneNode(true);

        clone.querySelector('#profile-pic').src = data.userProfilePhoto;
        clone.querySelector('#handle').textContent = `@${data.userName}`;
        clone.querySelector('#name').textContent = data.name;
        clone.querySelector('#hour').textContent = timeAgo(data.createDate);

        clone.querySelector('#name').addEventListener('click', () => {
            handleUserClick(data);
        });

        if (currentUser.userName === data.userName) {
            console.log(currentUser)
            const editButton = document.createElement('button');
            editButton.textContent = "Editar";
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => {
                openEditCommentModal(data.idComment, data.content);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', async () => {
                await deleteComment(data.idComment);
                await loadPosts()

            });

            clone.querySelector('.comment-footer').appendChild(editButton);
            clone.querySelector('.comment-footer').appendChild(deleteButton);

        }

        clone.querySelector('#content').textContent = data.content || "";

        const likesCount = data.likes ? data.likes.length : 0;
        const likesCountElement = clone.querySelector('#likes');

        if (likesCountElement) {
            likesCountElement.textContent = likesCount;
        } else {
            console.warn("Elemento de 'likes' no encontrado en el template");
        }

        const likeButton = clone.querySelector('#like-button');

        const userLike = data ? data.likes.find(like => like.userName === currentUser.userName) : null;

        if (userLike) {
            likeButton.setAttribute('name', 'heart');
            likeButton.classList.add('likebutton');
        } else {
            likeButton.setAttribute('name', 'heart-outline');
        }

        likeButton.addEventListener('click', async () => {
            try {
                if (userLike) {
                    await unlikeComment(userLike.idLike);
                    likeButton.setAttribute('name', 'heart-outline');
                } else {
                    await likedComment(currentUser.email, data.idComment);
                    likeButton.setAttribute('name', 'heart');
                }
                await loadPosts();
            } catch (error) {
                console.error('Error al manejar el like/dislike:', error);
            }
        });


        container.appendChild(clone);
    });
}

function openEditCommentModal(commentId, content) {
    document.getElementById("commentModal").style.display = "block";
    document.getElementById("comment").value = content; 
    document.getElementById("commentForm").dataset.idComment = commentId; 
}

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("commentModal").style.display = "none";
    document.getElementById("commentForm").reset();
    delete document.getElementById("commentForm").dataset.idComment; 
});


//Notificaciones
async function renderNotificsation() {
    const data = await loadForYouNotificationsByUsername();
    console.log(data);

    if (data) {
        document.getElementById('main-container').innerHTML = "";
        document.getElementById('follows-container').innerHTML = "";
        document.getElementById('not').innerHTML = "";

        const unreadNotifications = data.filter(element => !element.status);


        unreadNotifications.forEach(element => {

            if (element.status === true) {
                return
            }

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

// Notificaciones de comentarios
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

// Notificaciones de likes
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

// Notificaciones de seguidores
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


// Cargar post
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
    const commentSection = clone.querySelector('#comments-section');
    const commentButton = clone.querySelector('#comment-button');

    commentButton.addEventListener('click', () => {
        commentSection.classList.toggle('hidden');
        if (!commentSection.classList.contains('hidden')) {
            renderComments(data.commentDTO, commentSection);

        }
    });

    const commentForm = clone.querySelector('#createcomment');
    commentForm.dataset.postId = postDTO.postid;

    commentForm.addEventListener("submit", handleFormSubmit);

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
                await likedPost(postDTO.postid);
                likeButton.setAttribute('name', 'heart');
            }
            await loadPosts();
        } catch (error) {
            console.error('Error al manejar el like/dislike:', error);
        }
    });


    if (user.userName === currentUser.userName) {
        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.addEventListener('click', () => {
            loadPostData(data);
            document.getElementById('myModal').style.display = 'block';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', async () => {
            try {
                await deletePost(postDTO.postid);
                await loadPosts();
            } catch (error) {
                console.error('Error al eliminar el post:', error);
            }
        });

        clone.querySelector('.post-footer').appendChild(editButton);
        clone.querySelector('.post-footer').appendChild(deleteButton);
    }

    const postcard = clone.querySelector('.postcard');
    if (index % 2 === 0) {
        postcard.classList.add('par');
    } else {
        postcard.classList.add('impar');
    }

    fragment.appendChild(clone);
    document.getElementById('main-container').appendChild(fragment);
}

// Renderizar los tags
export function renderTags(data) {
    const template = document.getElementById('tags-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('#tagstemplatename').textContent = `#${data.content}`;
    clone.querySelector('#tagstemplateposts').textContent = `${data.count} publicaciones`;

    document.getElementById('tendencias').appendChild(clone);
}

// Cargar los usuarios
export function renderUsers(user) {
    const template = document.getElementById('UserTemplate');

    const clone = template.content.cloneNode(true);

    clone.querySelector('#photo').src = user.photo;
    clone.querySelector('#username').textContent = `@${user.userName}`;
    clone.querySelector('#name').textContent = user.name;
    clone.querySelector('#bio').textContent = user.biography;
    const followButton = clone.querySelector('#follow');

    if (currentUser) {
        const result = CheckFollow(user.userName);

        if (result.isFollowing) {
            followButton.textContent = "Unfollow";
        } else if (result.isFollowedBy) {
            followButton.textContent = "Follow";
        } else {
            followButton.textContent = "Follow";
        }
    }

    clone.querySelector('#name').addEventListener('click', () => {
        handleUserClick(user);
    });

    document.getElementById('main-container').appendChild(clone);
}



// FORMULARIOS

// Formulario de comentarios
async function handleFormSubmit(event) {
    event.preventDefault();

    const commentForm = event.target;
    const content = commentForm.querySelector(".comment-text").value.trim();
    const postId = commentForm.dataset.postId;
    const commentId = commentForm.dataset.idComment;


    if (!content) {
        console.warn("Error: Faltan datos para publicar el comentario.");
        return;
    }

    try {
        if (commentId) {
            await UpdateComment(commentId, content);  
        } else {
            await CommentPost(postId, content);
        }

        loadMyPost();
        document.getElementById("commentModal").style.display = "none";
        document.getElementById("description").value = "";
    } catch (error) {
        console.error("Error al manejar el comentario:", error);
    }

    delete commentForm.dataset.idComment;
}


document.getElementById("commentForm").addEventListener("submit", handleFormSubmit);

// Formulario de post
async function handlePostSubmit(event) {
    event.preventDefault();
    const postId = document.getElementById("postId").value; 
    const description = document.getElementById("description").value.trim();
    const tagsInput = document.getElementById("tags").value.trim();
    const mainLink = document.getElementById("mainLink").value.trim();
    const optionalLink1 = document.getElementById("optionalLink1").value.trim();



    if (!description) {
        console.warn("Error: Faltan campos obligatorios.");
        return;
    }


    let tagList = tagsInput.split("#")
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag);

    tagList = tagList.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));

    const photos = [mainLink, optionalLink1].filter(photo => photo);

    const createPostDTO = {
        description: description,
        listTag: tagList,
        listPhoto: photos
    };

    if (postId) {
        console.log(createPostDTO)
        await updatePost(postId, createPostDTO);
    } else {
        await createPost(createPostDTO);
    }

    event.target.reset();
    document.getElementById("postId").value = '';
    console.log("Datos enviados:", createPostDTO);


    return createPostDTO;
}



async function loadPostData(post) {
    try {

        document.getElementById('postId').value = post.showPostDTO.postid;
        document.getElementById('description').value = post.showPostDTO.description;
        console.log(post.tagDTO)
        const tags = post.tagDTO ? post.tagDTO.map(tag => `#${tag.tagContent}`).join(' ') : '';
        document.getElementById('tags').value = tags;

        const photos = post.photoDTOurl ? post.photoDTOurl.map(photo => photo.url) : [];
        console.log(photos)

        document.getElementById('mainLink').value = photos[0] || '';
        document.getElementById('optionalLink1').value = photos[1] || '';


    } catch (error) {
        console.error('Error cargando post:', error);
    }
}


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


function toggleVisibility(element, show) {
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
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



// ==============================================
// Funciones para actualizar el perfil y estadísticas
// ==============================================

const updateUserProfile = (user) => {
    // Busca los elementos del perfil en el DOM y verifica que existan
    const nameEl = document.getElementById('name');
    const userNameEl = document.getElementById('userName');
    const biographyEl = document.getElementById('biography');
    const photoEl = document.getElementById('photo');
    const buttonContainer = document.querySelector('.button-settings');
  
    if (!nameEl || !userNameEl || !biographyEl || !photoEl || !buttonContainer) {
      console.error('Uno o más elementos del perfil no se encontraron en el DOM.');
      return;
    }
  
    nameEl.textContent = user.name;
    userNameEl.textContent = `@${user.userName}`;
    biographyEl.textContent = user.biography;
    photoEl.src = user.photo;
  
    buttonContainer.innerHTML = '';
    if (user.userName === currentUser.userName) {
      const editButton = document.createElement('button');
      editButton.textContent = "Editar";
      editButton.id = 'openprofilemodal';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', () => {
        console.log('Editar perfil:', user);
        document.getElementById('ModalEdit').style.display = 'block';
      });
      buttonContainer.appendChild(editButton);
    } else {
      const followButton = document.createElement('button');
      followButton.textContent = "Seguir";
      followButton.classList.add('follow-button');
      followButton.addEventListener('click', () => {
        console.log('Seguir a usuario:', user);
        // Aquí puedes llamar a followUser(user.email);
      });
      buttonContainer.appendChild(followButton);
    }
  };
  
  const updateStats = async (user) => {
    try {
      const [posts, followers, following] = await Promise.all([
        fetchData(`post/user/${user.email}`),
        fetchData(`follow/followers/${user.userName}`),
        fetchData(`follow/following/${user.userName}`)
      ]);
  
      // Busca los elementos donde se mostrarán las estadísticas
      const postsEl = document.getElementById('mypost');
      const followersEl = document.getElementById('myfollowers');
      const followingEl = document.getElementById('myfollowed');
  
      if (!postsEl || !followersEl || !followingEl) {
        console.error('Uno o más elementos de estadísticas no se encontraron.');
        return;
      }
  
      postsEl.textContent = posts.length;
      followersEl.textContent = followers.length;
      followingEl.textContent = following.length;
    } catch (error) {
      console.error('Error al obtener las estadísticas:', error);
      showError('Error al obtener los datos.');
    }
  };
  
  const showError = (message) => {
    console.error(message);
  };
  

  const setupButtons = (userName, email) => {
    const forYouButton = document.querySelector('.post-button');
    const likesButton = document.querySelector('.likes-button');
    const galleryButton = document.querySelector('.photo-button');
    const followersButton = document.querySelector('#myfollowers');
    const followingButton = document.querySelector('#myfollowed');
  
    if (forYouButton) {
      forYouButton.onclick = () => {
        loadMyPost(email);
      };
      loadMyPost(email);
    }
    if (likesButton) {
      likesButton.onclick = () => loadLikePost(email);
    }
    if (followersButton) {
      followersButton.onclick = () => loadFollowers(userName);
    }
    if (followingButton) {
      followingButton.onclick = () => loadFollowing(userName);
    }
    if (galleryButton) {
      galleryButton.onclick = () => loadgallery(email);
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
      console.error('Detalle del error en loadUserProfile:', error);
      showError('Error al cargar el perfil del usuario.');
    }
  }
  
 
  document.addEventListener('DOMContentLoaded', () => {
    // --- Formularios y modales ---
    const form = document.getElementById("myForm");
    if (form) {
      form.addEventListener("submit", handlePostSubmit);
      console.log("Formulario encontrado y evento añadido.");
    } else {
      console.error("Error: No se encontró el formulario.");
    }
  
    const modal = document.getElementById("myModal");
    const modaledit = document.getElementById("ModalEdit");
    const openModal = document.getElementById("openModal");
    const openModaledit = document.getElementById("openprofilemodal");
  
    if (openModal) {
      openModal.addEventListener('click', () => {
        modal.style.display = "block";
      });
    } else {
      console.error("Error: No se encontró el botón de abrir modal.");
    }
  
    if (openModaledit) {
      openModaledit.addEventListener('click', () => {
        modaledit.style.display = "block";
      });
    } else {
      console.error("Error: No se encontró el botón de abrir modal edit.");
    }
  
    const span = document.getElementsByClassName("close")[0];
    const spanedit = document.getElementsByClassName("closeedit")[0];
  
    if (span) {
      span.addEventListener('click', () => {
        modal.style.display = "none";
      });
    } else {
      console.error("Error: No se encontró el elemento para cerrar el modal.");
    }
  
    if (spanedit) {
      spanedit.addEventListener('click', () => {
        modaledit.style.display = "none";
      });
    } else {
      console.error("Error: No se encontró el elemento para cerrar el modal edit.");
    }
  
    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        modaledit.style.display = "none";
      }
    });
  
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let email = urlParams.get('email');
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (!email && localUser) {
        email = localUser.email;
      }
      if (email) {
        loadUserProfile(email);
        console.log("Perfil cargado para:", email);
      } else {
        showError('No se encontró el usuario local o el email proporcionado.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    }
  
    window.handleUserClick = async function (user) {
      try {
        console.log("handleUserClick llamado para:", user.email);
        toggleVisibility(profileContainer, true);
        toggleVisibility(feedContainer, false);
        toggleVisibility(notificationsContainer, false);
        toggleVisibility(searchContainer, false);
        toggleVisibility(mainContainer, true);
        toggleVisibility(homeLink, true);
        toggleVisibility(profileLink, true);
        window.scrollTo(0, 0);
  
        // Carga el perfil del usuario clickeado
        await loadUserProfile(user.email);
      } catch (error) {
        console.error("Error al manejar el clic del usuario:", error);
      }
    };
  
    // --- Cargar perfil del usuario logueado ---
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser && localUser.email) {
      loadUserProfile(localUser.email);
    } else {
      console.error("No se encontró el usuario local o su email.");
    }
  
    // --- Renderizar notificaciones ---
    renderNotificsation();
  
    // --- Configuración de visibilidad de secciones ---
    window.addEventListener('load', () => {
      toggleVisibility(profileContainer, false);
      toggleVisibility(feedContainer, true);
      toggleVisibility(notificationsContainer, false);
    });
  
    // --- Configuración de botones de navegación ---
    if (homeLink) {
      homeLink.addEventListener('click', () => {
        toggleVisibility(profileContainer, false);
        toggleVisibility(feedContainer, true);
        toggleVisibility(mainContainer, true);
        toggleVisibility(notificationsContainer, false);
        loadPosts();
      });
    }
  
    if (profileLink) {
      profileLink.addEventListener('click', () => {
        toggleVisibility(profileContainer, true);
        toggleVisibility(feedContainer, false);
        toggleVisibility(notificationsContainer, false);
        toggleVisibility(mainContainer, true);
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser && localUser.email) {
          loadUserProfile(localUser.email);
        }
      });
    }
  
    if (notificationsLink) {
      notificationsLink.addEventListener('click', () => {
        toggleVisibility(profileContainer, false);
        toggleVisibility(feedContainer, false);
        toggleVisibility(notificationsContainer, true);
        toggleVisibility(mainContainer, false);
        toggleVisibility(searchContainer, false);
      });
    }
  
    if (searchLink) {
      searchLink.addEventListener('click', () => {
        toggleVisibility(profileContainer, false);
        toggleVisibility(feedContainer, false);
        toggleVisibility(notificationsContainer, false);
        toggleVisibility(searchContainer, true);
        toggleVisibility(mainContainer, false);
      });
    }
  });
  