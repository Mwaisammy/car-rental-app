import { combineReducers } from "@reduxjs/toolkit"
import { usersAPI } from "../Features/user/userAPI"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web
import { configureStore } from "@reduxjs/toolkit"
import { loginAPI } from "../Features/login/loginApi"
import userSlice from "../Features/login/userSlice"
import { carsAPI } from "../Features/cars/carsAPI"

const persistConfig = {
    key: 'root',
    version: 1,  
    storage
}

// Reducers - a reducer is a function that takes the current state and an action, and returns a new state

const rootReducer = combineReducers({
    [usersAPI.reducerPath]: usersAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    [carsAPI.reducerPath]: carsAPI.reducer,
    // Add other reducers here 

    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    // Middleware to enable RTK Query, which allows us to make API( UsersApi, LoginApi) calls and manage state
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for Redux Persist
    })
    .concat(usersAPI.middleware) 
    .concat(loginAPI.middleware)
    .concat(carsAPI.middleware)

    // Add the usersAPI middleware to the store
})


export const persistedStore = persistStore(store)
export type RootState = ReturnType<typeof store.getState> //tracks the state of the store
