import "../styles/post.css";

import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { POSTS_PER_PAGE, POSTS_QUERY } from "./Posts";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import CloseButton from "./assets/CloseButton";
import Modal from "react-modal";
import { customStyles } from "../styles/customModalStyles";

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

function Post() {
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      {
        query: POSTS_QUERY,
        variables: { skip: 0, take: POSTS_PER_PAGE },
      },
    ],
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  const initialValues: PostValues = {
    content: "",
  };

  const validationSchema = yup.object({
    content: yup
      .string()
      .required("Posts must have content.")
      .min(1, "Post must include more than 1 character.")
      .max(257, "Post must include less than 257 character."),
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <button
        onClick={openModal}
        className="btn-solid btn-small"
        style={{ marginRight: "10px", marginTop: "30px" }}
      >
        <span style={{ padding: "10px 50px 10px 50px" }}>Post</span>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <CloseButton back={false} action={closeModal} />
        <div className="header" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            await createPost({ variables: values });

            setSubmitting(false);
            setIsOpen(false);
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
            <div className="footer" />
            <button className="post-button" type="submit">
              <span>Post</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}

export default Post;
