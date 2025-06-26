import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from "@reduxjs/toolkit/query/react"
import { ApiDomain } from "../../utils/APIDomain";
export type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: number;
    isVerified: boolean;
    verificationCode: number;
}

export type TverifyUser = {
    email: string,
    verificationCode: string
}

//Reducer-> this that happen when a user is being registered

export const usersAPI = createApi({
    reducerPath: 'usersAPI',
    baseQuery: fetchBaseQuery({
       baseUrl: ApiDomain, //describe the api domain on api - localhost:8081

    }),
    tagTypes:['Users'], // Used for invalidation i.e send user to the database and refetch and display from DB
    endpoints: (builder) => ({
        createUsers: builder.mutation<TUser, Partial<TUser>>({
            query: (newUser) => ({
                url: '/auth/register', //route to db
                method: 'POST',
                body: newUser
            }),
            invalidatesTags: ['Users']

        }),

        verifyUser: builder.mutation<{message: string}, TverifyUser >({
            query: (data) => ({
                url: '/auth/verify', //route to verify user
                method: 'POST',
                body: data
            }) 
        })
    })
})