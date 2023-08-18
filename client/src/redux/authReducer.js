import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: false,
    token: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action) {
            return {
                ...state,
                authenticated: action.payload.auth,
                token: action.payload.token
            };
        }
    }
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
