import "../styles/login.css";

import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import Logo from "../components/assets/Logo";
import React from "react";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface LoginValues {
  email: string;
  password: string;
}

function Login() {
  const history = useHistory();
  const [login] = useMutation(LOGIN_MUTATION);

  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .max(20, "Password must be 20 characters or less")
      .required("Password is required"),
  });

  return (
    <div className="container">
      <Logo />
      <h3>Login to Social</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await login({ variables: values });

          localStorage.setItem("token", response.data.login.token);
          setSubmitting(false);
          history.push("/");
          window.location.reload();
        }}
      >
        <Form>
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage className="error" name="email" component="div" />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage className="error" name="password" component="div" />
          <button className="login-button" type="submit">
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Don't have an account?</h4>
        <Link className="link" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
