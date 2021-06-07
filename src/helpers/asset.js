import axios from 'axios';

export const getAllAssets = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/assets`);
}

export const getAssetInfo = async (asset) => {
    return await axios.get(`${process.env.REACT_APP_API}/assets/${asset}`);
}

export const getAssetInfoById = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/assets/${id}`);
}

export const getMyAssets = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/assets/owned`);
}

export const getMyCreatedAssets = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/assets/created`);
}

export const getMyAssetsOnSale = async (id, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/assets/on-sale`, {
        headers: {
            authtoken
        }
    });
}

export const getMyAssetsByCollection = async (id, collection) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/${collection}/assets`);
}

export const createAsset = async (id, payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/${id}/asset/create`, payload, {
        headers: {
            authtoken
        }
    });
}

export const updateAsset = async (id, asset, payload, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/asset/update/${asset}`, payload, {
        headers: {
            authtoken
        }
    });
}


export const updateAssetPrice = async (id, asset, payload, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/asset/update/${asset}/price`, payload, {
        headers: {
            authtoken
        }
    });
}


export const getFavouriteCount = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/assets/${id}/favourites`);
}

export const incrementFavouriteCount = async (id) => {
    return await axios.put(`${process.env.REACT_APP_API}/assets/${id}/favourites/increment`);
}

export const decrementFavouriteCount = async (id) => {
    return await axios.put(`${process.env.REACT_APP_API}/assets/${id}/favourites/decrement`);
}