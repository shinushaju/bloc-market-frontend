import axios from 'axios';

// get usernames of all users
export const getOwners = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/owners`);
}

// get usernames of all users
export const getUsernames = async (authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/usernames`, {
        headers: {
            authtoken
        }
    });
}

// get info of a single user using username
export const getUserInfo = async (username) => {
    return await axios.get(`${process.env.REACT_APP_API}/users/${username}/info`);
}

// get info of a single user using id
export const getUserInfoById = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/users/id/${id}/info`);
}


// update username of user
export const updateUsername = async (id, payload, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/update/username`, payload, {
        headers: {
            authtoken
        }
    });
}

// update profile name of user
export const updateName = async (id, payload, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/update/name`, payload, {
        headers: {
            authtoken
        }
    });
}


// get favourite assets of a specific user
export const getFavourites = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/favourites`);
}

// add an asset to favourites assets of a specific user
export const addToFavourites = async (id, asset, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/${id}/favourites`, { asset }, {
        headers: {
            authtoken
        }
    });
}


// remove an asset from favourites assets of a specific user
export const removeFromFavourites = async (id, asset, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/favourites/${asset}`, {}, {
        headers: {
            authtoken
        }
    });
}

