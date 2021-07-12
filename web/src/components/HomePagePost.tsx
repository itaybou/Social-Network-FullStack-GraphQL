import "../styles/home.css";
import "../styles/post.css";

import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { POSTS_PER_PAGE, POSTS_QUERY } from "./Posts";
import { gql, useMutation } from "@apollo/client";

import React from "react";

const CREATE_POST_MUTATION = gql`
  mutation CREATE_POST($content: String!) {
    create_post(content: $content) {
      id
    }
  }
`;

interface PostValues {
  content: string;
}

function HomePagePost() {
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [
      {
        query: POSTS_QUERY,
        variables: { skip: 0, take: POSTS_PER_PAGE },
      },
    ],
  });

  const validationSchema = yup.object({
    content: yup
      .string()
      .required("Posts must have content.")
      .min(1, "Post must include more than 1 character.")
      .max(257, "Post must include less than 257 character."),
  });
  const initialValues: PostValues = {
    content: "",
  };

  return (
    <div className="home-page-post">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          await createPost({ variables: values });

          setSubmitting(false);
          resetForm();
        }}
      >
        <Form>
          <Field
            className="post-text"
            name="content"
            type="text"
            as="textarea"
            placeholder="What's happenning..."
          />
          <ErrorMessage className="error" name="content" component="div" />
          <button className="home-post-button" type="submit">
            <span>Post</span>
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default HomePagePost;
