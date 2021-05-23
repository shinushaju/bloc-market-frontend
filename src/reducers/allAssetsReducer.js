export function allAssetsReducer(state = null, action) {
    switch (action.type) {
        case "LOADED_ALL_ASSETS":
            return action.payload;
        default:
            return state;
    }
}