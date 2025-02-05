document.addEventListener('DOMContentLoaded', function () {
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
});


document.addEventListener('DOMContentLoaded', function () {

    async function loadTags() {
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

    



    function renderTags(data) {
        const template = document.getElementById('tags-template');
        const clone = template.content.cloneNode(true);

        const tagElement = clone.querySelector('#tagstemplatename');
        tagElement.textContent = `#${data.content}`;
        clone.querySelector('#tagstemplateposts').textContent = `${data.count} publicaciones`;

        tagElement.addEventListener('click', function (event) {
            event.preventDefault();
            loadPostsByTag(data.content);
        });

        document.getElementById('tendencias').appendChild(clone);
    }


    loadTags();


   
});

