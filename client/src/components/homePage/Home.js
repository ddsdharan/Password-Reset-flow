import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/Login')
    }
    return (
        <>
            <div className="Heading"><h1>HOME PAGE</h1></div>
            <h3>Hello ${FirstName}</h3>
            <div className="home-content"><p>This is a project to practice password reset flow
                using React, MongoDB, NodeJS, Express along with few frameworks</p></div>
            <div className="logout-button"><button type="button" class="btn btn-dark" onClick={handleLogOut}>Log Out</button>
            </div>
        </>
    )
}
