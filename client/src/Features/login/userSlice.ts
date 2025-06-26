import { createSlice } from "@reduxjs/toolkit"

export type UserState = {
    token: string | null
    user: {
        user_id: number,
        first_name : string,
        last_name: string,
        email: string
    } | null

 }

 const initialState: UserState = {
    token : null,
    user: null
 }

 const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
        },
        //logout
    }


 })

 export const { loginSuccess } = userSlice.actions
 export default userSlice.reducer