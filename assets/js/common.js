
// Función para limpiar el localStorage
export function clearLocalStorage() {
    localStorage.clear();
    console.log("El localStorage ha sido borrado.");
}

// Función para manejar el cierre de sesión
export function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', clearLocalStorage);
    }
}

// Función para calcular el tiempo transcurrido desde la creación de un post
export function timeAgo(creationDate) {
    const now = new Date();
    const postDate = new Date(creationDate);

    if (isNaN(postDate)) {
        return 'Invalid date';
    }

    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInSeconds < 60) {
        return `about ${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 60) {
        return `about ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `about ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 30) {
        return `about ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
        return `about ${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
        return `about ${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
}

// Función para renderizar un post
export function renderPost(data, index) {
    const template = document.getElementById('post-template');
    const clone = template.content.cloneNode(true);

    const postDTO = data.showPostDTO;
    const user = postDTO.user;

    clone.querySelector('#photo').src = user.photo;
    clone.querySelector('#name').textContent = user.name;
    clone.querySelector('#userName').textContent = `@${user.userName}`;
    clone.querySelector('#post-content').textContent = postDTO.description;
    clone.querySelector('#comments-count').textContent = data.commentDTO.length;
    clone.querySelector('#likes-count').textContent = data.likePostDTO.length;
    clone.querySelector('#hour').textContent = timeAgo(postDTO.creationDate);

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

    document.getElementById('post-container').appendChild(clone);
}

// Función para cargar tags
export async function loadTags() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/tag/tagDTO', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Invalid');
        }
        const data = await response.json();
        const sortedTags = data.sort((a, b) => b.count - a.count);
        sortedTags.slice(0, 3).forEach(tag => renderTags(tag));
    } catch (error) {
        console.error('Error fetching tags:', error);
    }
}

// Función para renderizar tags
export function renderTags(data) {
    const template = document.getElementById('tags-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('#tagstemplatename').textContent = `#${data.content}`;
    clone.querySelector('#tagstemplateposts').textContent = `${data.count} publicaciones`;

    document.getElementById('tendencias').appendChild(clone);
}

// Función para cargar posts por tag
export async function loadPostsByTag(tag) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/post/tag/${tag}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los posts por tag');
        }
        const data = await response.json();
        document.getElementById('post-container').innerHTML = '';
        data.forEach((post, index) => renderPost(post, index));
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
    }
}