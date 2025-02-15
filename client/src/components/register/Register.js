import React from "react";
import { Typography, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../../global";
import { ColorButton } from "../login/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function Register() {
    const navigate = useNavigate();

    const registerUser = async (newUser) => {
        try {
            const res = await fetch(`${API}/signup`, {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.message === "successful Signup") {
                toast.success("Registration complete!", {
                    position: "top-right",
                });
                setTimeout(() => navigate("/Login"), 1500);
            } else {
                toast.error(data.message, { position: "top-right" });
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration.", {
                position: "top-right",
            });
        }
    };

    const initialValues = {
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
    };

    const validationSchema = Yup.object({
        FirstName: Yup.string().required("Required"),
        LastName: Yup.string().required("Required"),
        Email: Yup.string().email("Must be a valid email").required("Required"),
        Password: Yup.string().min(8, "Must be at least 8 characters").required("Required"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues,
            validationSchema,
            onSubmit: (newUser) => {
                registerUser(newUser);
            },
        });

    return (
        <div className="add-user-container">
            <div
                className="wrapper"
                style={{
                    position: "relative",
                    textAlign: "center",
                    borderStyle: "solid",
                    borderWidth: "5px",
                    display: "inline-block",
                }}
            >
                <form onSubmit={handleSubmit} className="add-user-form">
                    <Typography variant="h4" pb={2} sx={{ textAlign: "center" }}>
                        Register User
                    </Typography>

                    <TextField
                        className="add-user-name"
                        label="First Name"
                        type="text"
                        name="FirstName"
                        value={values.FirstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.FirstName && errors.FirstName)}
                        helperText={touched.FirstName && errors.FirstName ? errors.FirstName : ""}
                    />

                    <TextField
                        className="add-user-name"
                        label="Last Name"
                        type="text"
                        name="LastName"
                        value={values.LastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.LastName && errors.LastName)}
                        helperText={touched.LastName && errors.LastName ? errors.LastName : ""}
                    />

                    <TextField
                        className="add-user-name"
                        label="Email"
                        type="email"
                        name="Email"
                        value={values.Email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.Email && errors.Email)}
                        helperText={touched.Email && errors.Email ? errors.Email : ""}
                    />

                    <TextField
                        className="add-user-name"
                        label="Password"
                        type="password"
                        name="Password"
                        value={values.Password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.Password && errors.Password)}
                        helperText={touched.Password && errors.Password ? errors.Password : ""}
                    />

                    <ColorButton className="add-user-btn" type="submit" variant="contained">
                        SignUp
                    </ColorButton>

                    <div className="text-center" style={{ color: "blue", marginTop: "10px" }}>
                        <Link to="/Login">Login!</Link>
                        <br />
                        <br />
                        <Link to="/ForgetPassword">Forget Password?</Link>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
