
export function assetReducer(state = null, action) {
    switch (action.type) {
        case "LOADED_ASSET_DETAILS":
            return action.payload;
        case "INCREMENTED_FAV_COUNT":
            return { ...state, favourites: action.payload }
        case "DECREMENTED_FAV_COUNT":
            return { ...state, favourites: action.payload }
        default:
            return state;
    }
}