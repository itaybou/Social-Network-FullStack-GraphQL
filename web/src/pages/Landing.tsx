import "../styles/landing.css";

import { Link } from "react-router-dom";
import Logo from "../components/assets/Logo";
import React from "react";

function Landing() {
  return (
    <div className="main">
      <div className="wrapper">
        <div className="left-landing">
          <div className="items-wrapper">
            <div className="item">
              <span className="icon">
                <i className="fa fa-search" aria-hidden="true"></i>
              </span>
              <span className="label">Follow your interests.</span>
            </div>
            <div className="item">
              <span className="icon">
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>
              <span className="label">Hear what people are talking about.</span>
            </div>
            <div className="item">
              <span className="icon">
                <i className="fa fa-comment" aria-hidden="true"></i>
              </span>
              <span className="label">Join the converation.</span>
            </div>
          </div>
        </div>
        <div className="right-landing">
          <div className="center">
            <div className="center-inner">
              <Logo />
              <h1>
                See what's happening in
                <br />
                the world right now
              </h1>
              <span>Join Social Today.</span>
              <Link to="/signup" className="btn-sign-up">
                Sign Up
              </Link>
              <Link to="/login" className="btn-login">
                Sign In
              </Link>
            </div>
          </div>
          <div className="landing-footer">
            <div className="landing-footer-inner">
              <p>
                <strong>Terms Of Use</strong>
                <br />
                <small>
                  Iste quia eum dolorem quia voluptatum ipsum. Laborum est dolor
                  saepe quisquam nihil officiis. Et minima dolor sit eius sunt
                  quo eius repellendus. Non cumque et minima quidem. Alias
                  sapiente cumque error qui et sit totam consectetur. Laboriosam
                  rerum in et nemo nobis laboriosam voluptas asperiores.
                  <br />
                  <strong>Social™</strong>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
