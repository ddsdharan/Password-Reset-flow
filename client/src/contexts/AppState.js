import { createContext } from 'react';
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const token = localStorage.getItem('token');
export const AppContext = createContext();


export const Appstate = (props) => {
    // const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));

    return (
        <AppContext.Provider
            value={{
                token,
                setToken,
            }}
        >
            {props.children}
        </AppContext.Provider>
    )
}

export default Appstate;