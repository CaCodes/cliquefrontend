import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AuthLayout from "../components/AuthLayout";
import logo from "../assets/logo.png";
import { TextLabelInput } from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../services/authService";
import Spinner from "../components/Spinner";
import { saveUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { errorHandler, setCookie } from "../utils/utils";
import { showToast } from "../redux/slices/toastSlice";

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  return (
    <AuthLayout>
      <div>
        <img src={logo} alt="" className="logo" />
      </div>
      <div>
        <h1 className="auth_header">Welcome Back!</h1>
        <p className="text_sm">Enter your details to access your account</p>
      </div>
      <div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={async (values) => {
            setLoading(true);
            const response = await signin(values);
            if (!response.error) {
              setLoading(false);
              sessionStorage.setItem("cliqueToken", response.data.data.token);

              // save user data 
              dispatch(saveUser(response.data.data.user));

              // setting cookie as userID + token
              // using "CliQueX*" as a seperator and "cl_tag" as a code name for the cookie
              let cookieValue = response.data.data.user._id + "CliQueX*" + response.data.data.token
              setCookie("cl_tag", cookieValue, 7)

              dispatch(
                showToast({
                  status: "success",
                  message: "Log in successful",
                })
              );
              navigate("/dashboard")
            } else {
              setLoading(false);
              dispatch(
                showToast({
                  status: "error",
                  message: errorHandler(response.data),
                })
              );
            }
          }}
        >
          <Form>
            <div className="input_wrap">
              <TextLabelInput
                label="Email"
                name="email"
                type="email"
                placeholder="Email Address"
              />
              <TextLabelInput
                label="Password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <p className="form_text secondary_text semibold text_sm pointer">
              Forgot your password?
            </p>
            <button
              className="form_btn primary_bg semibold"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Log In"}
            </button>
          </Form>
        </Formik>
        <p className="form_text text_center">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <span className="secondary_text pointer semibold">Sign up</span>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
