export function walletReducer(state = null, action) {
    switch (action.type) {
        case "WALLET_BALANCE":
            return action.payload;
        default:
            return state;
    }
}