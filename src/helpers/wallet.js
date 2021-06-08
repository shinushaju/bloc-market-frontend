import axios from 'axios';

export const fetchWalletBalance = async (address, authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/${address}/wallet/balance`, {
        headers: {
            authtoken
        }
    });
}