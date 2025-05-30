import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface rol { id: number, nombre: string }



export interface UserState {
    id: number,
    username: string,
    email: string,
    rol: rol | null,
    permisos: number[]



}

const loadUserFromLocalStorage = () => {
    try {
        const serializedUser = localStorage.getItem('user');
        if (serializedUser === null) {
            return null;
        }
        return JSON.parse(serializedUser);
    } catch (err) {
        console.error('Error al cargar datos desde localStorage:', err);
        return null;
    }
};



const initialState: UserState = loadUserFromLocalStorage() || { id: 0, username: '', email: '', rol: null, permisos: [] };

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ id: number, username: string, email: string, rol: rol, permisos: number[] }>) => {
            const userData = action.payload;
            localStorage.setItem('user', JSON.stringify(userData));
            // state.id = action.payload.id;
            // state.username = action.payload.username,
            //     state.email = action.payload.email
            // state.rol = action.payload.rol
            return userData;


        },
        logout: (state) => {

            localStorage.removeItem('user');
            state.id = 0;
            state.username = '';
            state.email = '';
            state.rol = null;
            state.permisos = []
        },

        updateUserInfo: (state, action: PayloadAction<{ username: string, email: string }>) => {
            const { username, email, } = action.payload

            state.username = username,
                state.email = email



        }


    }






})

export const { login, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer

