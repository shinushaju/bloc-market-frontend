import { combineReducers } from 'redux';
import { userReducer } from './userReducer'
import { assetReducer } from './assetReducer'
import { allAssetsReducer } from './allAssetsReducer';
import { walletReducer } from './walletReducer';

const rootReducer = combineReducers({
    user: userReducer,
    asset: assetReducer,
    assets: allAssetsReducer,
    wallet: walletReducer
});

export default rootReducer;