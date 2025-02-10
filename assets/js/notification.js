import { timeAgo, fetchData, postData, deleteData, putData } from './utils.js';


async function loadForYouNotificationsByUsername() {
    try {
        // /${user.userName} con ese traigo las notificaciones por username  
        const user = localStorage.getItem("user")


        const response = await fetchData("notifications");

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
    console.log(data)
    data.forEach(element => {

        // if (element.status === true) {
        //     return
        // }
        if (element.tipo === 'Comment') {
            // console.log(element)
            loadNotificationComment(element)
        } if (element.tipo === 'Like') {

            loadNotificationLike(element);


        }
        if (element.tipo === 'Follow') {
            loadNotificationfollow(element);

            // console.log(element)
        }
    })
};



async function loadNotificationComment(element) {
    const template = document.getElementById('Noti-comment-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#template2-profile-img').src = element.userPhoto;
    clone.querySelector('#template2-name').textContent = `${element.name} has made  you a comment`;
    clone.querySelector('#template2-handle').textContent = `@${element.username}`;



    const checkButton = clone.querySelector('#checkButon');
    checkButton.addEventListener('click', async () => {

        await changeNotifcationstatus(element.idNotification);
    });

    document.getElementById('main').appendChild(clone);

}

async function loadNotificationLike(element) {
    const template = document.getElementById('Noti-like-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#template2-profile-img').src = element.userPhoto;
    clone.querySelector('#template2-name').textContent = `${element.name} has made you a Like`;
    clone.querySelector('#template2-handle').textContent = `@${element.username}`;
    const checkButton = clone.querySelector('#checkButon');
    checkButton.addEventListener('click', async () => {

        await changeNotifcationstatus(element.idNotification);
    });

    document.getElementById('main').appendChild(clone);

}
async function loadNotificationfollow(element) {
    const template = document.getElementById('Noti-follow-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#template2-profile-img').src = element.userPhoto;
    clone.querySelector('#template2-name').textContent = `${element.name} has followed you `;
    clone.querySelector('#template2-handle').textContent = `@${element.username}`;
    const checkButton = clone.querySelector('#checkButon');
    checkButton.addEventListener('click', async () => {

        await changeNotifcationstatus(element.idNotification);
    });
    document.getElementById('main').appendChild(clone);

}



async function changeNotifcationstatus(id) {
    try {
        // console.log(id);
        const response = await postData(`notifications/read/${id}`);

        // Imprimir la respuesta original para depurar


        if (!response.ok) {
            throw new Error('Error al marcar la notificación como leída');
        }

    } catch (error) {
        console.error('Error marcando la notificación como leída:', error);
    }
}



async function openEditModal(postId) {
    await loadPostData(postId);
    // Tu lógica para abrir el modal
    document.getElementById('myModal').style.display = 'block';
}



// Esto activa y desactiva el contenido e el Dom  
document.addEventListener("DOMContentLoaded", function () {
    // Esto carga el form en el Dom
    const form = document.getElementById("myForm");

    if (form) {
        form.addEventListener("submit", handleFormSubmit);
        console.log("Formulario encontrado y evento añadido.");
    } else {
        console.error("Error: No se encontró el formulario.");
    }


    renderNotificsation()

    // Esto es directamente para cargar el modal 

    var modal = document.getElementById("myModal");
    var openModal = document.getElementById("openModal");

    openModal.addEventListener('click', function () {
        modal.style.display = "block";
    });

    var span = document.getElementsByClassName("close")[0];

    span.addEventListener('click', function () {
        modal.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

});










//  esto es parte crea el DTO  CREATEDTO  necesario para crear un post 
async function handleFormSubmit(event) {
    event.preventDefault(); // Evita la recarga de la página
    const postId = document.getElementById("postId").value;
    const description = document.getElementById("description").value.trim();
    const tagsInput = document.getElementById("tags").value.trim();
    const mainLink = document.getElementById("mainLink").value.trim();
    const optionalLink1 = document.getElementById("optionalLink1").value.trim();
    const optionalLink2 = document.getElementById("optionalLink2").value.trim();



    if (!description || !tagsInput || !mainLink) {
        console.warn("Error: Faltan campos obligatorios.");
        return;
    }


    let tagList = tagsInput.split("#")
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag);

    // Convertir primera letra en mayúscula
    tagList = tagList.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));

    // Capturar hasta 3 fotos (filtrando vacíos)
    const photos = [mainLink, optionalLink1, optionalLink2].filter(photo => photo);

    // Crear el objeto DTO
    const createPostDTO = {
        description: description,
        listTag: tagList,
        listPhoto: photos
    };

    if (postId) {
        await PutPostfunction(postId, createPostDTO);
    } else {
        await PostPostfunction(createPostDTO);
    }

    event.target.reset();
    document.getElementById("postId").value = '';
    console.log("Datos enviados:", createPostDTO);
    PostPostfunction(createPostDTO);


    return createPostDTO;
}


// Funcio enviar un post a la base de datos 


async function PostPostfunction(createPostDTO) {

    try {

        const user = JSON.parse(localStorage.getItem('user'));
        const email = user.email;
        console.log(user);
        console.log(email);

        const response = await postData(`post/${email}`, createPostDTO)


        if (!response.ok) {
            throw new Error('Creation post is not okay');
        }


        return response
    } catch (error) {
        console.error('Error Creating your post:', error);
    }


}

async function PutPostfunction(postId, updatePostDTO) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await putData(`post/${postId}`, updatePostDTO);

        if (!response.ok) {
            throw new Error('Update post failed');
        }
        return response;
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

async function loadpost() {

    try {
        const response = await fetchData(`post`);

        if (!response.ok) {
            throw new Error('Update post failed');
        }
        return response;


    } catch (error) {
        console.error('Error cargando post:', error);
    }
}


async function loadPostData(postId) {
    try {
        const post = await fetchData(`post/postid/${postId}`);
        console.log("Respuesta completa:", post);
        // Rellenar campos del formulario
        document.getElementById('postId').value = post?.showPostDTO?.postid || '';
        document.getElementById('description').value = post?.showPostDTO?.description || '';



        const tags = post?.tagDTO?.map(tag => tag.tagContent) || [];
        document.getElementById('tags').value = tags.map(tag => `#${tag}`).join('');


        const photos = post?.photoDTOurl?.map(photo => photo.url) || [];


        document.getElementById('mainLink').value = photos[0] || '';
        document.getElementById('optionalLink1').value = photos[1] || '';
        document.getElementById('optionalLink2').value = photos[2] || '';


    } catch (error) {
        console.error('Error cargando post:', error);
    }
}

loadPostData(10) 