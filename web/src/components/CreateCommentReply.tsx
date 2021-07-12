import "../styles/post.css";
import "../styles/allPosts.css";

import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import CloseButton from "./assets/CloseButton";
import Modal from "react-modal";
import { POST_QUERY } from "../pages/SinglePost";
import ProfilePicture from "./assets/ProfilePicture";
import { customStyles } from "../styles/customModalStyles";

const CREATE_COMMENT_REPLY_MUTATION = gql`
  mutation CREATE_COMMENT_REPLY(
    $content: String!
    $postId: String!
    $commentId: String!
  ) {
    create_comment_reply(
      content: $content
      postId: $postId
      commentId: $commentId
    ) {
      id
    }
  }
`;

interface CommentReplyValues {
  content: string;
}

interface CommentReplyProps {
  name: string;
  avatar: string;
  postId: string;
  comment: string;
  commentId: string;
}

function CreateCommentReply({
  comment,
  name,
  avatar,
  postId,
  commentId,
}: CommentReplyProps) {
  const [createCommentReply] = useMutation(CREATE_COMMENT_REPLY_MUTATION, {
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      { query: POST_QUERY, variables: { postId } },
    ],
  });

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  const [modalIsOpen, setIsOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error?.message}</p>;

  const initialValues: CommentReplyValues = {
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
        <p className="post-text comment-post-content">{comment}</p>
        <div className="header" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            await createCommentReply({
              variables: { ...values, postId, commentId },
            });

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

export default CreateCommentReply;
