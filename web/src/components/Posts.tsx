import "../styles/allPosts.css";

import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import CreateComment from "./CreateComment";
import LikePost from "./LikePost";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import ProfilePicture from "./assets/ProfilePicture";
import UnlikePost from "./UnlikePost";
import moment from "moment";

export const POSTS_PER_PAGE = 5;

export const POSTS_QUERY = gql`
  query POSTS_QUERY($skip: Int!, $take: Int!) {
    posts(skip: $skip, take: $take) {
      total
      posts {
        id
        createdAt
        content
        likes {
          id
        }
        comments {
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
  }
`;

interface PostsType {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    profile: {
      avatar: string;
    };
  };
  likes: [];
  comments: [];
}

export interface LikePosts {
  id: string;
  post: {
    id: string;
  };
}

function Posts() {
  const [page, setPage] = useState<number>(1);
  const {
    loading,
    error,
    data,
    refetch: refetchPosts,
  } = useQuery(POSTS_QUERY, {
    variables: {
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    },
  });

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CURRENT_USER_QUERY);

  if (loading || userLoading) return <p>Loading...</p>;
  if (error || userError) return <p>{error?.message ?? userError?.message}</p>;

  return (
    <div className="posts-container">
      {data.posts.posts.map((post: PostsType) => (
        <div key={post.id} className="post-container">
          <Link to={`/post/${post.id}`} style={{ userSelect: "text" }}>
            {/* // TODO: fix a tags nesting because of Links */}
            <div className="post-header">
              <ProfilePicture
                style={{ marginInlineEnd: "10px" }}
                image={post.author?.profile?.avatar}
                big={false}
              />
              <div className="header-titles">
                <Link to={`/user/${post.author.id}`}>
                  <h4 className="post-author-name">{post.author.name} </h4>
                </Link>
                <p className="date-time post-text">
                  {moment(post.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <p className="post-text post-content">{post.content}</p>
          </Link>
          <div className="likes">
            {userData.current_user.user.likePosts
              .map((t: LikePosts) => t.post.id)
              .includes(post.id) ? (
              <span key={post.id} className="small-text">
                <UnlikePost
                  id={
                    userData.current_user.user.likePosts.filter(
                      (like: LikePosts) => like.post.id === post.id
                    )[0].id
                  }
                />
                {post.likes.length}
              </span>
            ) : (
              <span>
                <LikePost id={post.id} />
                {post.likes.length}
              </span>
            )}
            <span className="small-text">
              <CreateComment
                avatar={post.author?.profile?.avatar}
                name={post.author.name}
                post={post.content}
                postId={post.id}
              />
              {post.comments.length > 0 ? post.comments.length : null}
            </span>
          </div>

          {/*
          <div className="likes">
            {meData.me.likedTweet
              .map((t: LikedTweets) => t.tweet.id)
              .includes(tweet.id) ? (
              <span>
                <DeleteLike
                  id={
                    meData.me.likedTweet.filter(
                      (like: LikedTweets) => like.tweet.id === tweet.id
                    )[0].id
                  }
                />
                {tweet.likes.length}
              </span>
            ) : (
              <span>
                <LikeTweet id={tweet.id} />
                {tweet.likes.length}
              </span>
            )}

          </div> */}
        </div>
      ))}
      <Pagination
        onPageChange={async (p) => {
          setPage(p);
          await refetchPosts({
            skip: (p - 1) * POSTS_PER_PAGE,
            take: POSTS_PER_PAGE,
          });
        }}
        totalCount={data.posts.total}
        currentPage={page}
        pageSize={POSTS_PER_PAGE}
        className="pagination-bar"
      />
    </div>
  );
}

export default Posts;
