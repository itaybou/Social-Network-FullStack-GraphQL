import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "../pages/Profile";
import React from "react";
import { USER_QUERY } from "../pages/SingleUser";

const UNFOLLOW_USER_MUTATION = gql`
  mutation UNFOLLOW_USER_MUTATION($followId: String!) {
    unfollow(followId: $followId) {
      id
    }
  }
`;

interface UnfollowProps {
  id: string;
  userId: string;
}

function UnfollowUser({ id, userId }: UnfollowProps) {
  const [unfollow] = useMutation(UNFOLLOW_USER_MUTATION, {
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { userId: userId } },
    ],
  });

  const handleUnfollow = async () => {
    await unfollow({ variables: { followId: id } });
  };

  return (
    <div>
      <button onClick={handleUnfollow} className="btn-reverse">
        Unfollow
      </button>
    </div>
  );
}

export default UnfollowUser;
