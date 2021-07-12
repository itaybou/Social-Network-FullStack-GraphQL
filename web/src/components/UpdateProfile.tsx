import "../styles/primary.css";
import "../styles/profile.css";

import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { ChangeEvent, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import Modal from "react-modal";
import ProfilePicture from "./assets/ProfilePicture";
import { customStyles } from "../styles/customModalStyles";
import { sha256 } from "js-sha256";

const UPDATE_PROFILE_MUTATION = gql`
  mutation UPDATE_PROFILE(
    $id: String!
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    update_profile(
      id: $id
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
  id: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

function UpdateProfile() {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(data.current_user?.profile?.avatar ?? "");
  const [imageLoading, setImageLoading] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const initialValues: ProfileValues = {
    id: data.current_user.user.profile.id,
    bio: data.current_user.user.profile.bio,
    location: data.current_user.user.profile.location,
    website: data.current_user.user.profile.website,
    avatar: data.current_user?.profile?.avatar,
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const data = new FormData();

    if (files && files[0]) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const upload_preset = "social";
      const signature = sha256(
        `timestamp=${timestamp}&upload_preset=${upload_preset}${process.env.REACT_APP_CLOUDINARY_API_SECRET}`
      );
      data.append("file", files[0]);
      data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY ?? "");
      data.append("upload_preset", "social");
      data.append("timestamp", String(timestamp));
      data.append("signature", signature);
      setImageLoading(true);

      const endpoint = process.env.REACT_APP_CLOUDINARY_ENDPOINT;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
        });

        const file = await res.json();
        setImage(file.secure_url);
      }
      setImageLoading(false);
    }
  };

  return (
    <div>
      <button onClick={openModal} className="btn-small btn-reverse">
        Update Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <input
          type="file"
          name="place"
          placeholder="Upload Avatar"
          onChange={uploadImage}
          ref={inputFile}
          style={{ display: "none" }}
        />
        {imageLoading ? (
          <h3>Loading...</h3>
        ) : (
          <span
            className="avatar-update"
            onClick={() => inputFile.current && inputFile.current.click()}
          >
            <ProfilePicture
              style={{ marginBottom: "20px" }}
              image={image}
              big={true}
            />
          </span>
        )}
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await updateProfile({ variables: { ...values, avatar: image } });
            setSubmitting(false);
            setIsOpen(false);
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage className="error" name="bio" component="div" />
            <Field name="location" type="location" placeholder="Location" />
            <ErrorMessage className="error" name="location" component="div" />
            <Field name="website" type="website" placeholder="Website" />
            <ErrorMessage className="error" name="website" component="div" />
            <button className="login-button" type="submit">
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}

export default UpdateProfile;
