import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ApiDomain } from "../../utils/APIDomain"
import type { RootState } from "../../app/store"

export type TCar =  { 
    carModel: string,
     year: string, 
     color: string,
      rentalRate: string, 
      availability: boolean, 
      locationID: number
     }

     export const carsAPI = createApi({
        reducerPath: "carsAPI",
        baseQuery: fetchBaseQuery({
            baseUrl: ApiDomain,
            prepareHeaders: (headers, {getState}) => {
                const token = (getState() as RootState).user.token
                if(token){
                    headers.set('Authorization', `Bearer ${token}`)
                }
                headers.set('Content-Type', 'application/json')

            }
        }),

        tagTypes: ["Cars"],
        endpoints: (builder) => ({
            createCar: builder.mutation<TCar, Partial<TCar>>({
                query :(newCar) => ({
                    url: "/cars",
                    method: "POST",
                    body: newCar,
                }),
                invalidatesTags: ['Cars']
        }),
        getCars: builder.query<{ data: TCar[] }, void>({
            query: () => '/cars',
            providesTags: ['Cars'],

        }),

        updateCar: builder.mutation<TCar, Partial<TCar> & {id : number}>({
            query: (updatedCar) => ({
                url: `/car/${updatedCar.id}`,
                method: 'PUT',
                body: updatedCar
            }),
            invalidatesTags: ['Cars']

        }),

        deleteCar: builder.mutation<{success: boolean, id: number}, number>({
            query: (id) => ({
                url: `/car/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Cars']
        }),
        //Cars for specific user
     }) 

    })