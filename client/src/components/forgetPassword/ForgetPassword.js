import { Typography } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import TextField from '@mui/material/TextField'
import { API } from '../../global';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../App.css";
import { ColorButton } from '../login/Login';

export function ForgetPassword() {
    const [errorMsg, setErrorMsg] = useState("");

    const forgetPassword = (emailDetail) => {
        fetch(`${API}/forgetPassword`, {
            method: "POST",
            body: JSON.stringify(emailDetail),
            headers: {
                "Content-Type": "application/json",

            },
        }).then((data) => data.json())
            .then((data1) => {
                setErrorMsg(data1.message);
            }
            );


    };
    const initialValues = {
        Email: '',
    }
    const userValidationSchema = Yup.object({
        Email: Yup.string().email("Must be a valid email").required('Required'),
    })

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } = useFormik({
        initialValues: initialValues,
        validationSchema: userValidationSchema,
        onSubmit: (emailDetail) => {
            forgetPassword(emailDetail);
        },
    });
    const style1 = errorMsg === "User found and sent password reset mail " ? { color: "green" } : { color: "red" }

    return <div className="add-user-container" >
        <div className="wrapper" style={{
            position: "relative",
            textAlign: "center",
            borderStyle: "solid",
            borderWidth: "5px",
            display: "inline-block"
        }}>
            <form
                onSubmit={handleSubmit}
                className="add-user-form" >
                <Typography variant="h4" pb={2}
                    sx={{
                        textAlign: 'center',
                    }}>
                    E-mail Details
                </Typography>

                <TextField
                    className="add-user-name"
                    label=" Registered Email"
                    placeholder='Example@email.com'
                    type="Email"
                    value={values.Email}
                    name="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.Email && errors.Email ? true : false}
                    helperText={touched.Email && errors.Email ? errors.Email : ""}
                />
                <ColorButton className="add-user-btn"
                    type="submit"
                    variant="contained">submit</ColorButton>
                <div className="text-center" style={style1}>
                    {errorMsg}
                </div>
                <div className="text-center" style={{ color: "blue" }}>
                    <Link to="/Register">Create  Account!</Link>
                    <br />
                    <br />
                    <Link to="/Login">I can remember my password now!</Link>
                </div>
            </form>
        </div>
    </div>;
}