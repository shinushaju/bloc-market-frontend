import axios from 'axios';

// get marketplace all acitivities
export const getActivity = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/activity`);
}

// get acitivity history of an asset
export const getAssetHistory = async (asset) => {
    return await axios.get(`${process.env.REACT_APP_API}/activity/asset/${asset}/history`);
}

// log activity when a new NFT is minted.
export const mintedNFT = async (payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/activity/minted-nft`, payload, {
        headers: {
            authtoken
        }
    });
}

// log activity when an NFT is listed for sale.
export const listedNFT = async (payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/activity/listed-nft`, payload, {
        headers: {
            authtoken
        }
    });
}

// log activity when an NFT is transferred between users.
export const transferredNFT = async (payload, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/activity/transferred-nft`, payload, {
        headers: {
            authtoken
        }
    });
}