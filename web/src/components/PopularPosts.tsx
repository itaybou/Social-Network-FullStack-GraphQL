import "../styles/popularPosts.css";
import "../styles/allPosts.css";

import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

import { Link } from "react-router-dom";
import ProfilePicture from "./assets/ProfilePicture";
import moment from "moment";

export const POPULAR_POSTS_QUERY = gql`
  query POPULAR_POSTS_QUERY($minDatetime: String!) {
    popular_posts(minDatetime: $minDatetime) {
      id
      createdAt
      content
      likes {
        id
      }
      author {
        id
        name
        profile {
          id
          avatar
        }
      }
    }
  }
`;

interface PopularPostsType {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    profile: {
      id: string;
      avatar: string;
    };
  };
  likes: {
    id: string;
    length: number;
  };
}

export function oneWeekAgo() {
  var date = new Date();

  //Change it so that it is 7 days in the past.
  var pastDate = date.getDate() - 7;
  date.setDate(pastDate);
  return date;
}

function PopularPosts() {
  const weekAgo = useMemo(() => oneWeekAgo().toDateString(), []);

  const { loading, error, data } = useQuery(POPULAR_POSTS_QUERY, {
    variables: { minDatetime: weekAgo },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="popular-posts">
      <h3 className="trending">Trending</h3>
      {data.popular_posts.map((post: PopularPostsType) => (
        <Link
          key={post.id}
          className="posts-link"
          to={`/post/${post.id}`}
          style={{ userSelect: "text" }}
        >
          <div className="popular-post-container" key={post.id}>
            <div className="date-title">
              <div className="title-logo">
                <ProfilePicture
                  image={post.author?.profile?.avatar}
                  big={false}
                />
                <p className="popular-post-content">{post.content}</p>
              </div>
              <p className="date">{moment(post.createdAt).fromNow()}</p>
            </div>
            <div className="popular-post-likes">
              <h4 className="popular-post-author-name">{post.author.name} </h4>
              {post.likes.length > 0 ? (
                <span className="likes-text">Likes {post.likes.length}</span>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PopularPosts;
