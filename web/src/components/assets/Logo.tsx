import "../../styles/logo.css";

import LogoImg from "../../styles/assets/logo.png";
import React from "react";

function Logo() {
  return (
    <div className="logo-container">
      <img
        className="logo"
        src={LogoImg}
        alt="Logo"
        style={{ width: "50px" }}
      />
      <h1 className="logo-title">
        <span>Social.</span>
      </h1>
    </div>
  );
}

export default Logo;
