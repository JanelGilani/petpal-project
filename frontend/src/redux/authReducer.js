import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: false,
    token: "",
    objectId: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action) {
            return {
                ...state,
                authenticated: action.payload.auth,
                token: action.payload.token,
                objectId: action.payload.objectId
            };
        }
    }
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
