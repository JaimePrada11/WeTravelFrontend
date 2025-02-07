import { timeAgo, fetchData } from './utils.js';

export async function loadMyPost() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const data = await fetchData(`post/user/${user.email}`);
    if (data) {
        document.getElementById('post-container').innerHTML = '';
        data.forEach((post, index) => renderPost(post, index));  
    }
}

export async function loadLikePost() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const data = await fetchData(`post/liked/${user.email}`);
    if (data) {
        document.getElementById('post-container').innerHTML = '';
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

export function renderTags(data) {
    const template = document.getElementById('tags-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('#tagstemplatename').textContent = `#${data.content}`;
    clone.querySelector('#tagstemplateposts').textContent = `${data.count} publicaciones`;

    document.getElementById('tendencias').appendChild(clone);
}

document.addEventListener('DOMContentLoaded', () => {
    loadMyPost();
    loadTags();
});
