import { createContext, useContext, useState } from "react";


const AuthContext = createContext({
    user: null,
    token: null,
    setToken: () => {},
    setUser: () => {},
});


export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (_token) => {
        _setToken(_token);
        if (_token) {
            localStorage.setItem('ACCESS_TOKEN', _token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, setToken, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
