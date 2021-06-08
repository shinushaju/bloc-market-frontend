export function walletReducer(state = null, action) {
    switch (action.type) {
        case "WALLET_BALANCE":
            return action.payload;
        case "UPDATE_WALLET_BALANCE":
            return { ...state, balance: action.payload }
        default:
            return state;
    }
}