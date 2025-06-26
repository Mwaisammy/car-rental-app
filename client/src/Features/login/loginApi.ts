import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/APIDomain";

 export type TloginUser = {
    token: string;
    user: {
        user_id: number,
        first_name : string,
        last_name: string,
        email: string
    }

 }

 type LoginInputs = {
    email: string;
    password: string;
 }

 export const loginAPI = createApi({
    reducerPath: "loginAPI",
    baseQuery: fetchBaseQuery({baseUrl: ApiDomain}),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TloginUser, LoginInputs>({
            query: (loginData: LoginInputs) => ({
                url: '/auth/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ["Login"]
        })
    })
 })

