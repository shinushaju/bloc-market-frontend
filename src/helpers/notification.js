import axios from 'axios';

export const newNotifications = async (id, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${id}/notifications/new`, {
        headers: {
            authtoken
        }
    });
}

export const markNotificationsAsRead = async (id, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/notifications/mark-read`, {
        headers: {
            authtoken
        }
    });
}

export const markOneNotificationAsRead = async (id, notification, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/${id}/notification/${notification}/mark-read`, {
        headers: {
            authtoken
        }
    });
}

export const makeOfferNotification = async (payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/notification/add/offer/made`, payload, {
        headers: {
            authtoken
        }
    });
}
