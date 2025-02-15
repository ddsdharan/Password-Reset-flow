import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { AppContext } from "../../contexts/AppState";
import { API } from "../../global";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    background:
        "linear-gradient(124deg, rgba(131,58,180,1) 0%, rgba(165,50,138,1) 50%, rgba(170,49,132,1) 75%, rgba(192,44,105,1) 100%)",
    "&:hover": {
        backgroundColor: purple[700],
    },
}));

export function Login() {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const loginUser = async (userDetail) => {
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                body: JSON.stringify(userDetail),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const content = await res.json();

            if (content.message === "ok") {
                const userData = content.user;
                localStorage.setItem("token", content.data);
                localStorage.setItem("userEmail", userData.Email);
                localStorage.setItem("userType", "student");
                setToken(content.data);
                console.log("Logged in successfully!");
                toast.success("Logged in successfully!", { position: "top-right" });
                setTimeout(() => {
                    navigate("/Home");
                }, 1500);
            } else {
                toast.error(content.message, { position: "top-right" });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login.", { position: "top-right" });
        }
    };

    const initialValues = {
        Email: "",
        Password: "",
    };

    const userValidationSchema = Yup.object({
        Email: Yup.string().email("Invalid email address").required("Required"),
        Password: Yup.string().required("Required"),
    });

    const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
        useFormik({
            initialValues,
            validationSchema: userValidationSchema,
            onSubmit: (userDetail) => {
                loginUser(userDetail);
            },
        });

    return (
        <div className="add-user-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit} className="add-user-form">
                    <Typography variant="h4" pb={2} sx={{ textAlign: "center" }}>
                        Login
                    </Typography>

                    <TextField
                        className="add-user-name"
                        label="Email"
                        type="email"
                        name="Email"
                        value={values.Email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.Email && Boolean(errors.Email)}
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
                        error={touched.Password && Boolean(errors.Password)}
                        helperText={touched.Password && errors.Password ? errors.Password : ""}
                    />

                    <ColorButton
                        className="add-user-btn"
                        type="submit"
                        variant="contained"
                    >
                        Login
                    </ColorButton>

                    <div className="text-center" style={{ color: "blue" }}>
                        <Link to="/Register">New user?</Link>
                        <br />
                        <br />
                        <Link to="/ForgetPassword">Forgot password</Link>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
