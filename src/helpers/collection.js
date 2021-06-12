import axios from 'axios';

export const getAllCollections = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/collections`);
}

// get all collection names
export const getCollectionNames = async (authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/collections/names`, {
        headers: {
            authtoken
        }
    });
}

export const getCollection = async (slug) => {
    return await axios.get(`${process.env.REACT_APP_API}/collection/${slug}`);
}

export const getMyCollections = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/collections`);
}

export const createCollection = async (id, payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/${id}/collection/create`, payload, {
        headers: {
            authtoken
        }
    });
}

export const updateCollection = async (id, collection, payload, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/collection/update/${collection}`, payload, {
        headers: {
            authtoken
        }
    });
}

export const deleteCollection = async (id, collection, authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/user/${id}/collection/delete/${collection}`, {
        headers: {
            authtoken
        }
    });
}
