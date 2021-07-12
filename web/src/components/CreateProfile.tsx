import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import Modal from "react-modal";
import { customStyles } from "../styles/customModalStyles";

const CREATE_PROFILE_MUTATION = gql`
  mutation CREATE_PROFILE(
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    create_profile(
      bio: $bio
      location: $location
      website: $website
      avatar: $avatar
    ) {
      id
    }
  }
`;

interface ProfileValues {
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

function CreateProfile() {
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const [modalIsOpen, setIsOpen] = useState(false);
  const initialValues: ProfileValues = {
    bio: "",
    location: "",
    website: "",
    avatar: "",
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="btn-reverse">
        Create Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createProfile({ variables: values });
            setSubmitting(false);
            setIsOpen(false);
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage name="bio" component="div" />
            <Field name="location" type="location" placeholder="Location" />
            <ErrorMessage name="location" component="div" />
            <Field name="website" type="website" placeholder="Website" />
            <ErrorMessage name="website" component="div" />
            <button className="login-button" type="submit">
              <span>Create Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}

export default CreateProfile;
