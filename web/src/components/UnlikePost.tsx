import { POPULAR_POSTS_QUERY, oneWeekAgo } from "./PopularPosts";
import { POSTS_PER_PAGE, POSTS_QUERY } from "./Posts";
import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import React from "react";

const UNLIKE_POST_MUTATION = gql`
  mutation UNLIKE_POST($id: String!) {
    unlike_post(id: $id) {
      id
    }
  }
`;

interface LikePostProps {
  id: string;
}

function UnlikePost({ id }: LikePostProps) {
  const [unlikePost] = useMutation(UNLIKE_POST_MUTATION, {
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

  const handleUnlikePost = async () => {
    await unlikePost({ variables: { id } });
  };

  return (
    <span
      onClick={handleUnlikePost}
      style={{ marginRight: "5px", cursor: "pointer" }}
    >
      <i className="fa fa-thumbs-up liked-post" aria-hidden="true" />
    </span>
  );
}
export default UnlikePost;
