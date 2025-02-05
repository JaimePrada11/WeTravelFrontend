document.addEventListener('DOMContentLoaded', function () {
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

    async function loadPost() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8080/api/combine', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            const data = await response.json();
            data.forEach(post => renderPost(post));
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }

    function renderPost(data) {
        const template = document.getElementById('post-template');
        const clone = template.content.cloneNode(true);

        const postDTO = data.showPostDTO;
        const user = postDTO.user;

        clone.querySelector('img').src = user.photo;
        clone.querySelector('h2').textContent = user.name;
        clone.querySelector('p.text-sm').textContent = `@${user.userName}`;
        clone.querySelector('#post-content').textContent = postDTO.description;
        clone.querySelector('#comments-count').textContent = data.commentDTO.length;
        clone.querySelector('#likes-count').textContent = data.likePostDTO.length;

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

        document.getElementById('post-container').appendChild(clone);
    }

    loadPost();
});
