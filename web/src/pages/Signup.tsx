import "../styles/login.css";

import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import Logo from "../components/assets/Logo";
import React from "react";

const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface SignupValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const history = useHistory();
  const [signup] = useMutation(SIGNUP_MUTATION);

  const initialValues: SignupValues = {
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords don't match"),
    name: yup
      .string()
      .max(20, "Name must be 20 characters or less")
      .required("Name is required"),
  });

  return (
    <div className="container">
      <Logo />
      <h3>Signup</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await signup({ variables: values });

          localStorage.setItem("token", response.data.signup.token);
          setSubmitting(false);
          history.push("/login"); // TODO: change to login
        }}
      >
        <Form>
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage className="error" name="email" component="div" />
          <Field name="name" type="text" placeholder="Name" />
          <ErrorMessage className="error" name="name" component="div" />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage className="error" name="password" component="div" />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <ErrorMessage
            className="error"
            name="confirmPassword"
            component="div"
          />
          <button className="login-button" type="submit">
            <span>Signup</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Already have an account?</h4>
        <Link className="link" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
