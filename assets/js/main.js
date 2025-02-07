const URL = 'http://localhost:8080/'

export async function fetchData(endpoint) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
            throw new Error('Error en la solicitud');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en deleteData:', error);
        throw error;
    }
}

