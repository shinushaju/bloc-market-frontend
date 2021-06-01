import axios from 'axios';

export const makeOfferNotification = async (payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/notification/add/offer/made`, payload, {
        headers: {
            authtoken
        }
    });
}