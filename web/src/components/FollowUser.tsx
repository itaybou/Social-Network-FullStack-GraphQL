import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import React from "react";
import { USER_QUERY } from "../pages/SingleUser";

const FOLLOW_USER_MUTATION = gql`
  mutation FOLLOW_USER_MUTATION(
    $followId: String!
    $avatar: String!
    $name: String!
  ) {
    follow(followId: $followId, avatar: $avatar, name: $name) {
      id
    }
  }
`;

interface FollowProps {
  id: string;
  name: string;
  avatar: string;
}

function FollowUser({ id, name, avatar }: FollowProps) {
  const [follow] = useMutation(FOLLOW_USER_MUTATION, {
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { userId: id } },
    ],
  });

  const handleFollow = async () => {
    await follow({
      variables: {
        followId: id,
        name,
        avatar: avatar,
      },
    });
  };

  return (
    <div>
      <button onClick={handleFollow} className="btn-solid">
        Follow
      </button>
    </div>
  );
}

export default FollowUser;
