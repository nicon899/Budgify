import { BASE_URL } from '@/util/dataManager';
import React, { useContext, useEffect, useState } from 'react';
import { storageService } from '../util/StorageService';

export type LoginOptions = {
    email: string;
    password: string;
};

export type LoginResponse = {
    status: 'ok';
    data: string;
};

export type RegisterOptions = {
    email: string;
    username: string;
    password: string;
};

export type JWTTokenData = {
    id: number;
    name: string;
    email: string;
    iat: string;
    exp: string;
};

export type AuthContext = {
    token: string | null;
    actions: {
        login: (options: LoginOptions) => Promise<string | null>;
        register: (options: RegisterOptions) => Promise<void>;
        getTokenData: () => JWTTokenData | null;
        logout: () => void;
    };
};

export const initialAuthContext = {
    actions: {
        getTokenData: () => null,
        login: async () => undefined,
        logout: () => undefined,
        register: async () => undefined,
    },
    token: null,
};

export const authContext = React.createContext<AuthContext>(initialAuthContext);

export const AuthProvider = ({ children }) => {
    const [token, _setToken] = useState<string | null>(null);

    const setToken = async (newToken: string | null) => {
        await storageService.setItem('auth-token', newToken);
        _setToken(newToken);
    };

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await storageService.getItem('auth-token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                const userLoginOptions = await storageService.getItem('user-login-options');
                if (userLoginOptions) {
                    const parsedOptions: LoginOptions = JSON.parse(userLoginOptions);
                    return login(parsedOptions);
                }
            }
        };
        fetchToken();
    }, []);

    const login = async (values: LoginOptions) => {
        const loginRequest = await fetch(`${BASE_URL}/user/login`, {
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (loginRequest.status === 200) {
            const { data } = await loginRequest.json();
            const token = data.token
            setToken(token);
            return data;
        } else {
            return null;
        }
    };

    const register = async (values: RegisterOptions) => {
        const registerRequest = await fetch('/api/user', {
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (registerRequest.status === 200) {
            const { data } = await registerRequest.json();
            setToken(data.token);
        } else if (registerRequest.status === 400) {
            throw new Error('E-Mail is already in use');
        } else {
            throw new Error('Error while registering');
        }
    };

    const getTokenData = () => {
        if (token) {
            return JSON.parse(atob(token.split('.')[1]));
        }
        return null;
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <authContext.Provider
            value={{
                actions: {
                    getTokenData,
                    login,
                    logout,
                    register,
                },
                token,
            }
            }
        >
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);
