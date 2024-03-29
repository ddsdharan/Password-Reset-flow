import React from 'react';
import { Link } from 'react-router-dom';
import pagenotfoundImage from "./pagenotfound.jpg";

export const NotFound = () => {
    return (
        <div className="notFound">
            <div className="pageNotFound">
                <Link to="/Login">Go back to login page</Link>
                <br />
                <br />
                <h1>Oops..! 404 Page Not Found</h1>
                <p>Looks like you came to wrong page on our server</p>
                <img className="imageForNotFound" height="500" width="500" src={pagenotfoundImage} alt="not found" />
            </div>

        </div>
    )
}