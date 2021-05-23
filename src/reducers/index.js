import { combineReducers } from 'redux';
import { userReducer } from './userReducer'
import { assetReducer } from './assetReducer'
import { allAssetsReducer } from './allAssetsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    asset: assetReducer,
    assets: allAssetsReducer
});

export default rootReducer;