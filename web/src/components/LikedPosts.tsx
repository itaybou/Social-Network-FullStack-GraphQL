import { Link } from "react-router-dom";
import ProfilePicture from "./assets/ProfilePicture";
import React from "react";
import moment from "moment";

interface AllPosts {
  id: number;
  likedAt: Date;
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      profile: {
        avatar: string;
      };
    };
    content: string;
    createdAt: Date;
  };
}

interface LikedPostsProps {
  likedPosts: AllPosts[];
}

function LikedPosts({ likedPosts }: LikedPostsProps) {
  return (
    <div>
      {[...likedPosts]
        .sort(
          (p1: AllPosts, p2: AllPosts) =>
            new Date(p2.likedAt).getTime() - new Date(p1.likedAt).getTime()
        )
        .map((post: AllPosts) => (
          <>
            <div key={post.id} className="post-header">
              <ProfilePicture
                style={{ marginInlineEnd: "10px" }}
                image={post.post.author?.profile?.avatar}
                big={false}
              />
              <div className="header-titles">
                <Link to={`/user/${post.post?.author?.id}`}>
                  <h5 className="post-author-name-inner">
                    {post.post.author?.name}
                  </h5>
                </Link>
                <p className="date-time post-text">
                  {moment(post.post.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <Link to={`/post/${post.post?.id}`}>
              <p className="post-text comment-post-content">
                {post.post.content}
              </p>
            </Link>
            <p className="date-time post-text" style={{ marginLeft: "10px" }}>
              {`Liked ${moment(post.likedAt).fromNow()}`}
            </p>

            <div className="header" />
          </>
        ))}
    </div>
  );
}

export default LikedPosts;
