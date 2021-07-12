import "../styles/logout.css";

import React, { useState } from "react";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import Modal from "react-modal";
import ProfilePicture from "./assets/ProfilePicture";
import { logoutModalStyles } from "../styles/logoutModalStyles";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

function Logout() {
  const history = useHistory();

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  const [modalIsOpen, setIsOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <div className="logout">
      <span
        onClick={openModal}
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      >
        <h4 className="logout-div">
          <ProfilePicture
            className="btn-logout"
            image={data.current_user?.profile?.avatar}
            big={false}
          />
          <span style={{ marginLeft: "10px", marginTop: "-10px" }}>
            {data.current_user.user.name}
          </span>
          <span style={{ marginLeft: "30px" }}>
            <i className="fas fa-ellipsis-h"></i>
          </span>
        </h4>
      </span>
      <div style={{ position: "absolute", bottom: 0 }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Modal"
          style={logoutModalStyles}
        >
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            <p style={{ borderBottom: "1px solid black" }}>
              Log out @{data.current_user.user.name}
            </p>
          </span>
        </Modal>
      </div>
    </div>
  );
}

export default Logout;
