import "../styles/home.css";

import HomePagePost from "../components/HomePagePost";
import Posts from "../components/Posts";
import React from "react";
import { gql } from "@apollo/client";

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    current_user {
      id
      name
      profile {
        id
        bio
        location
        website
        avatar
      }
    }
  }
`;

function Home() {
  return (
    <div className="main-component">
      <div className="home-header">
        <h3 className="home-title">Home</h3>
        <HomePagePost />
      </div>
      <Posts />
    </div>
  );
}

export default Home;
