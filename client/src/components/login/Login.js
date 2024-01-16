import { Typography, Button } from "@mui/material";
import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { API } from "../../global";
import { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { AppContext } from "../../contexts/AppState";
import "./Login.css"
export const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    background:
        "linear-gradient(124deg, rgba(131,58,180,1) 0%, rgba(165,50,138,1) 50%, rgba(170,49,132,1) 75%, rgba(192,44,105,1) 100%);",
    "&:hover": {
        backgroundColor: purple[700],
    },
}));

export function Login() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");


    const loginUser = (userDetail) => {
        fetch(`${API}/login`, {
            method: "POST",
            body: JSON.stringify(userDetail),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((content) => {
                if (content.message === "ok") {
                    let userData = content.user;
                    localStorage.setItem("token", content.data);
                    localStorage.setItem('userEmail', userData.Email);
                    localStorage.setItem('userType', "student");
                    setToken(content.data)
                    return navigate("/Home")
                }
                else {
                    setErrorMsg(content.message)
                }
            })
            .catch((err) => console.error);
    };
    const initialValues = {
        Email: "",
        Password: "",
    };
    const userValidationSchema = Yup.object({
        Email: Yup.string().email().required("Required"),
        Password: Yup.string().required("Required"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues: initialValues,
            validationSchema: userValidationSchema,
            onSubmit: (userDetail) => {
                setErrorMsg("");
                loginUser(userDetail);
            },
        });

    return (
        <div className="add-user-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit} className="add-user-form">
                    <Typography
                        variant="h4"
                        pb={2}
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Login
                    </Typography>

                    <TextField
                        className="add-user-name"
                        label="Email"
                        type="Email"
                        value={values.Email}
                        name="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.Email && errors.Email ? true : false}
                        helperText={touched.Email && errors.Email ? errors.Email : ""}
                    />
                    <TextField
                        className="add-user-name"
                        label="Password"
                        type="password"
                        value={values.Password}
                        name="Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.Password && errors.Password ? true : false}
                        helperText={
                            touched.Password && errors.Password ? errors.Password : ""
                        }
                    />
                    <ColorButton
                        className="add-user-btn"
                        type="submit"
                        variant="contained"
                    >Login
                    </ColorButton>
                    <div className="text-center" style={{ color: "red" }}>
                        {errorMsg}
                    </div>
                    <div className="text-center" style={{ color: "blue" }}>
                        <Link to="/Register">New User</Link>
                        <br />
                        <br />
                        <Link to="/ForgetPassword">Forget Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}