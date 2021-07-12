import "../styles/allPosts.css";

import React, { useState } from "react";

import CloseButton from "./assets/CloseButton";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import ProfilePicture from "./assets/ProfilePicture";
import { customStyles } from "../styles/customModalStyles";

export interface FollowingType {
  id: string;
  name: string;
  avatar: string;
  followId: string;
}

interface FollowingProps {
  following: FollowingType[];
  followers: boolean;
}

export default function Following({ following, followers }: FollowingProps) {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <p onClick={openModal}>
        {following?.length}
        <br />
        {followers ? <small>followers</small> : <small>following</small>}
      </p>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <CloseButton action={closeModal} back={false} />
        <div className="header" />
        <div style={{ marginLeft: "20px" }}>
          {following.map((follow: FollowingType) => (
            <>
              <div
                key={follow.id}
                className="post-header"
                style={{ marginTop: "10px" }}
              >
                <ProfilePicture
                  style={{ marginInlineEnd: "10px" }}
                  image={follow?.avatar ? follow.avatar : undefined}
                  big={false}
                />
                <div className="header-titles">
                  <Link to={`/user/${follow?.followId}`}>
                    <h5 className="post-author-name-inner">{follow?.name}</h5>
                  </Link>
                </div>
              </div>
              <div className="header" style={{ marginBottom: "10px" }} />
            </>
          ))}
        </div>
      </Modal>
    </div>
  );
}
