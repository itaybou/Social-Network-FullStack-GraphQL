import "../styles/leftNav.css";

import { Link } from "react-router-dom";
import LogoImg from "../styles/assets/logo.png";
import Logout from "./Logout";
import Post from "./Post";
import React from "react";

function LeftNav() {
  return (
    <div className="leftNav">
      <Link to="/">
        <img src={LogoImg} alt="logo" style={{ width: "40px" }} />
      </Link>
      <Link to="/">
        <h2 className="menu-item">
          <i className="fa fa-home" aria-hidden="true" />{" "}
          <span className="title">Home</span>
        </h2>
      </Link>
      <Link to="/profile">
        <h2 className="menu-item">
          <i className="fa fa-user" aria-hidden="true" />{" "}
          <span className="title">Profile</span>
        </h2>
      </Link>
      <Link to="/coming">
        <h2 className="menu-item">
          <i className="fa fa-envelope" aria-hidden="true" />{" "}
          <span className="title">Messages</span>
        </h2>
      </Link>
      <Link to="/coming">
        <h2 className="menu-item">
          <i className="fa fa-bell" aria-hidden="true" />{" "}
          <span className="title">Notifications</span>
        </h2>
      </Link>
      <Link to="/coming">
        <h2 className="menu-item">
          <i className="fa fa-ellipsis-h" aria-hidden="true" />{" "}
          <span className="title">More</span>
        </h2>
      </Link>

      <Post />
      <Logout />
    </div>
  );
}

export default LeftNav;
