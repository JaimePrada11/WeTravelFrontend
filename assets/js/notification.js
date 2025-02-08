async function loadForYouNotificationsByUsername() {
    try {
        const token = localStorage.getItem('token');
        const user= JSON.parse(localStorage.getItem('user'));
        const username = user.userName;
        console.log(user);
        console.log(username);
         const response = await fetch(`http://localhost:8080/api/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        // /${user.userName} con ese traigo las notificaciones por username  
        if (!response.ok) {
            throw new Error('Error al obtener los posts de For You');
        }
        const data = await response.json();
        console.log(data);
      
        return data
    } catch (error) {
        console.error('Error fetching For You posts:', error);
    }
}




async function renderNotificsation(){
      data  =  await loadForYouNotificationsByUsername();
      

      data.forEach(element => {
     const elementype =  element.tipo
     console.log(elementype)
        
      });


}



renderNotificsation()


async function loadNotificationComment(element){

    const template = document.getElementById('Noti-like-template');
    const clone = template.content.cloneNode(true);
    clone.querySelector('#template2-profile-img').src =  element.userPhoto;
    clone.querySelector('#template2-name').textContent = element.name;
    clone.querySelector('#hora').textContent = element.;





    

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
        description,
        listTag: tagList,
        listPhoto: photos
    };

    console.log("Datos enviados:", createPostDTO);
    PostPostfunction(createPostDTO);
    return createPostDTO;
}


// Funcio enviar un post a la base de datos 


async function PostPostfunction(createPostDTO) {

    try {
        const token = localStorage.getItem('token');
        const user= JSON.parse(localStorage.getItem('user'));
        const email = user.email;
        console.log(user);
        console.log(email);

        const response = await fetch(`http://localhost:8080/api/post/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(createPostDTO)
        });

        if (!response.ok) {
            throw new Error('Creation post is not okay');
        }

        const data = await response.json();
        console.log(data);
      
        return data
    } catch (error) {
        console.error('Error Creating your post:', error);
    }


    
}


