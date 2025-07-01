import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from "@reduxjs/toolkit/query/react"
import { ApiDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";
export type TUser = {
    customerID: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    role: "admin" | "user" ;
    image_url: string;
    verificationCode: string ;
    isVerified: boolean ;
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
        prepareHeaders: (headers, {getState}) => {
                       const token = (getState() as RootState).user.token
                       if(token){
                           headers.set('Authorization', `Bearer ${token}`)
                       }
                       headers.set('Content-Type', 'application/json')
       
                   }

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
        }),
          getUsers: builder.query<TUser[], void>({
            query: () => '/customers',
            providesTags: ['Users']
        }),
        updateUser: builder.mutation<TUser, Partial<TUser> & {id : number}>({
            query: (updatedUser) => ({
                url: `/customer/${updatedUser.id}`,
                method: 'PUT',
                body: updatedUser
            }),
            invalidatesTags: ['Users']
        }),
        getUserById: builder.query<TUser, number>({
            query: (id) => `/customer/${id}`,
        }),
       
        
        
    })  
})