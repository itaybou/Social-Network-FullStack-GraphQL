import "../styles/post.css";
import "../styles/allPosts.css";

import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { POSTS_PER_PAGE, POSTS_QUERY } from "./Posts";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import CloseButton from "./assets/CloseButton";
import Modal from "react-modal";
import ProfilePicture from "./assets/ProfilePicture";
import { customStyles } from "../styles/customModalStyles";

const CREATE_COMMENT_MUTATION = gql`
  mutation CREATE_COMMENT($content: String!, $postId: String!) {
    create_comment(content: $content, postId: $postId) {
      id
    }
  }
`;

interface CommentValues {
  content: string;
}

interface CommentProps {
  post: string;
  name: string;
  avatar: string;
  postId: string;
}

function CreateComment({ post, name, avatar, postId }: CommentProps) {
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      {
        query: POSTS_QUERY,
        variables: { skip: 0, take: POSTS_PER_PAGE },
      },
    ],
  });

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  const [modalIsOpen, setIsOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error?.message}</p>;

  const initialValues: CommentValues = {
    content: "",
  };

  const validationSchema = yup.object({
    content: yup
      .string()
      .required("Comments must have content.")
      .min(1, "Comment must include more than 1 character.")
      .max(257, "Comment must include less than 257 character."),
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <span>
      <span
        onClick={openModal}
        style={{ marginRight: "5px", cursor: "pointer" }}
      >
        <i className="far fa-comment" aria-hidden="true" />
      </span>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <CloseButton back={false} action={closeModal} />
        <div className="header" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr 8fr",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <ProfilePicture
            style={{ marginInlineEnd: "10px" }}
            image={avatar}
            big={false}
          />
          <h5 style={{ margin: "0" }}>{name}</h5>
        </div>
        <p className="post-text comment-post-content">{post}</p>
        <div className="header" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            await createComment({ variables: { ...values, postId } });

            setSubmitting(false);
            setIsOpen(false);
            resetForm();
          }}
        >
          <Form>
            <div className="comment-post-section">
              <ProfilePicture
                image={data.current_user?.profile?.avatar}
                big={false}
              />
              <div style={{ width: "100%" }}>
                <Field
                  className="post-text"
                  name="content"
                  type="text"
                  as="textarea"
                  placeholder="Post your comment..."
                />
                <ErrorMessage
                  className="error"
                  name="content"
                  component="div"
                />
              </div>
            </div>
            <div className="footer" />
            <button className="post-button" type="submit">
              <span>Comment</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </span>
  );
}

export default CreateComment;
