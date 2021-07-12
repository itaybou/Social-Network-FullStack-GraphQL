import "../styles/allPosts.css";
import "../styles/profile.css";

import { Link, useHistory, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { CURRENT_USER_QUERY } from "./Profile";
import CloseButton from "../components/assets/CloseButton";
import CreateComment from "../components/CreateComment";
import CreateCommentReply from "../components/CreateCommentReply";
import LikePost from "../components/LikePost";
import { LikePosts } from "../components/Posts";
import ProfilePicture from "../components/assets/ProfilePicture";
import React from "react";
import UnlikePost from "../components/UnlikePost";
import moment from "moment";

export const POST_QUERY = gql`
  query POST_QUERY($postId: String!) {
    post(postId: $postId) {
      id
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
      comments {
        id
        content
        createdAt
        user {
          id
          name
          profile {
            id
            avatar
          }
        }
        comments {
          id
          content
          createdAt
          user {
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
  }
`;

interface ParamType {
  id: string;
}

interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    profile: {
      id: string;
      avatar: string;
    };
  };
  comments: CommentType[];
}

function SinglePost() {
  const history = useHistory();
  const { id } = useParams<ParamType>();

  const { loading, error, data } = useQuery(POST_QUERY, {
    variables: { postId: id },
  });

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CURRENT_USER_QUERY);

  if (loading || userLoading) return <p>Loading...</p>;
  if (error || userError) return <p>{error?.message ?? userError?.message}</p>;

  return (
    <div className="main-component">
      <div className="page-info">
        <div className="profile-head">
          <CloseButton back={true} action={() => history.goBack()} />
          <h3 className="page-title">Post</h3>
          {/* <HomePagePost /> */}
        </div>
      </div>
      <div className="header" />
      <div className="post-header">
        <ProfilePicture
          style={{ marginInlineEnd: "10px" }}
          image={data.post?.author?.profile?.avatar}
          big={false}
        />
        <div className="header-titles">
          <Link to={`/user/${data.post.author.id}`}>
            <h4 className="post-author-name">{data.post.author.name} </h4>
          </Link>
          <p className="date-time post-text">
            {moment(data.post.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <p className="post-text comment-post-content">{data.post.content}</p>
      <div className="likes">
        {userData.current_user.user.likePosts
          .map((t: LikePosts) => t.post.id)
          .includes(id) ? (
          <span className="small-text">
            <UnlikePost
              id={
                userData.current_user.user.likePosts.filter(
                  (like: LikePosts) => like.post.id === id
                )[0].id
              }
            />
            {data.post.likes.length}
          </span>
        ) : (
          <span>
            <LikePost id={id} />
            {data.post.likes.length}
          </span>
        )}
        <span className="small-text">
          <CreateComment
            avatar={data.post?.author?.profile?.avatar}
            name={data.post.author.name}
            post={data.post.content}
            postId={data.post.id}
          />
          {data.post.comments.length > 0 ? data.post.comments.length : null}
        </span>
      </div>
      <div className="seperator-section">
        <h5 className="page-title">Comments</h5>
      </div>
      {[...data.post.comments]
        .sort(
          (c1: CommentType, c2: CommentType) =>
            new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()
        )
        .map((comment: CommentType) => (
          <>
            <div key={comment.id} className="post-header">
              <ProfilePicture
                style={{ marginInlineEnd: "10px" }}
                image={comment.user?.profile?.avatar}
                big={false}
              />
              <div className="header-titles">
                <Link to={`/user/${comment.user.id}`}>
                  <h5 className="post-author-name-inner">
                    {comment.user.name}{" "}
                  </h5>
                </Link>
                <p className="date-time post-text">
                  {moment(comment.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <p className="post-text comment-post-content">{comment.content}</p>
            <div className="likes">
              <span className="small-text">
                <CreateCommentReply
                  name={comment.user.name}
                  avatar={comment.user?.profile?.avatar}
                  postId={data.post.id}
                  comment={comment.content}
                  commentId={comment.id}
                />
                {comment.comments.length}
              </span>
            </div>
            <div className="header" />
            {[...comment.comments]
              .sort(
                (c1: CommentType, c2: CommentType) =>
                  new Date(c2.createdAt).getTime() -
                  new Date(c1.createdAt).getTime()
              )
              .map((commentComment: CommentType) => (
                <>
                  <div key={commentComment.id} className="comment-comment">
                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <div className="comment-connector" />
                    </div>
                    <div>
                      <div className="post-header">
                        <ProfilePicture
                          style={{ marginInlineEnd: "10px" }}
                          image={commentComment.user?.profile?.avatar}
                          big={false}
                        />
                        <div className="header-titles">
                          <Link to={`/user/${commentComment.user.id}`}>
                            <h5 className="post-author-name-inner-inner">
                              {commentComment.user.name}
                            </h5>
                          </Link>
                          <p className="date-time post-text">
                            {moment(commentComment.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      <p className="post-text comment-post-content">
                        {commentComment.content}
                      </p>

                      <div className="header" />
                    </div>
                  </div>
                </>
              ))}
          </>
        ))}
    </div>
  );
}

export default SinglePost;
