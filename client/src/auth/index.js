
import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: ""
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, [auth.errorMessage]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try{
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                    errorMessage: auth.errorMessage
                }
            });
        }
    }catch{
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload:{
                loggedIn: false,
                user: null,
                errorMessage: auth.errorMessage
            }
        })
    }
    }

    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify, store) {
        try{
        const response = await api.registerUser(firstName, lastName, email, password, passwordVerify);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user,
                    errorMessage: ""
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }catch(response){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload:{
                loggedIn: false,
                user: null,
                errorMessage: response.response.data.errorMessage
            }
        })
    }
    }

    auth.loginUser = async function(email, password) {
        try{
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    errorMessage: ""
                }
            })
            history.push("/");
        }
    }catch(response){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload:{
                loggedIn: false,
                user: null,
                errorMessage: response.response.data.errorMessage
            }
        })
    }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.unmarkError = function(){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                loggedIn: false,
                user: null,
                errorMessage: ""
            }
        });
    }

    auth.hasErrorMessage = function (){
        if(auth.errorMessage){
            return true;
        }
        return false;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };