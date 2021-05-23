
export function userReducer(state = null, action) {
    switch (action.type) {
        case "CURRENT_USER":
            return action.payload;
        case "DISPLAY_NAME_UPDATE":
            return { ...state, name: action.payload }
        case "DISPLAY_PICTURE_UPDATE":
            return { ...state, picture: action.payload }
        case "USERNAME_UPDATE":
            return { ...state, username: action.payload }
        case "LOGOUT":
            return action.payload;
        default:
            return state;
    }
}