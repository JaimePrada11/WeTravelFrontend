const URL = 'http://localhost:8080/demo-0.0.1-SNAPSHOT/api/'

export async function fetchData(endpoint) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en fetchData:', error);
        throw error;
    }
}

export async function postData(endpoint, data) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en postData:', error);
        throw error;
    }
}

export async function putData(endpoint, data) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en putData:', error);
        throw error;
    }
}

export async function patchData(endpoint, data) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en patchData:', error);
        throw error;
    }
}


export async function deleteData(endpoint) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
        
    } catch (error) {
        console.error('Error en deleteData:', error);
        throw error;
    }
}



export function timeAgo(creationDate) {
    const now = new Date();
    const postDate = new Date(creationDate);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInSeconds < 60) return `about ${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    if (diffInMinutes < 60) return `about ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `about ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `about ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    if (diffInMonths < 12) return `about ${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    return `about ${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}
