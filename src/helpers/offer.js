import axios from 'axios';

export const getOffer = async (id, asset, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/asset/${asset}/offer`, {
        headers: {
            authtoken
        }
    });
}

export const getAllOffers = async (asset) => {
    return await axios.get(`${process.env.REACT_APP_API}/asset/${asset}/offers`);
}

export const getOffersSent = async (id, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/offers/sent`, {
        headers: {
            authtoken
        }
    });
}

export const getOffersReceived = async (id, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/offers/received`, {
        headers: {
            authtoken
        }
    });
}

export const makeOffer = async (id, asset, payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/${id}/asset/${asset}/offer`, payload, {
        headers: {
            authtoken
        }
    });
}

export const updateMyOffer = async (id, offer, payload, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/offer/${offer}/update`, payload, {
        headers: {
            authtoken
        }
    });
}

export const rejectOffer = async (id, offer, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/offer/${offer}/reject`, {}, {
        headers: {
            authtoken
        }
    });
}

export const acceptOffer = async (id, asset, offer, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/offer/${offer}/accept`, { asset }, {
        headers: {
            authtoken
        }
    });
}

export const withdrawOffer = async (id, offer, authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/user/${id}/offer/${offer}/withdraw`, {
        headers: {
            authtoken
        }
    });
}

export const cancelTxn = async (id, asset, offer, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/offer/${offer}/cancel`, { asset }, {
        headers: {
            authtoken
        }
    });
}