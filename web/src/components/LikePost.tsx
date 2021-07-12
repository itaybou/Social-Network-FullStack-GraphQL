import { POPULAR_POSTS_QUERY, oneWeekAgo } from "./PopularPosts";
import { POSTS_PER_PAGE, POSTS_QUERY } from "./Posts";
import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import React from "react";

const LIKE_POST_MUTATION = gql`
  mutation LIKE_POST($id: String!) {
    like_post(id: $id) {
      id
    }
  }
`;

interface LikePostProps {
  id: string;
}

function LikePost({ id }: LikePostProps) {
  const [likePost, { data }] = useMutation(LIKE_POST_MUTATION, {
    refetchQueries: [
      {
        query: POSTS_QUERY,
        variables: { skip: 0, take: POSTS_PER_PAGE },
      },
      { query: CURRENT_USER_QUERY },
      {
        query: POPULAR_POSTS_QUERY,
        variables: { minDatetime: oneWeekAgo().toDateString() },
      },
    ],
  });

  const handleLikePost = async () => {
    await likePost({ variables: { id } });
  };

  return (
    <span
      onClick={handleLikePost}
      style={{ marginRight: "5px", cursor: "pointer" }}
    >
      <i className="far fa-thumbs-up" aria-hidden="true" />
    </span>
  );
}

export default LikePost;
