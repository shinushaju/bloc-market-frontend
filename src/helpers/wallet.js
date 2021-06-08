import axios from 'axios';

export const fetchWalletBalance = async (address, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${address}/wallet/balance`, {
        headers: {
            authtoken
        }
    });
}

export const depositBlocCoins = async (address, payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/${address}/wallet/deposit`, payload, {
        headers: {
            authtoken
        }
    });
}