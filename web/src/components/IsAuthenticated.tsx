import { gql, useQuery } from "@apollo/client";

import React from "react";
import { Redirect } from "react-router-dom";

const IS_AUTHENTICATED = gql`
  query CURRENT_USER_QUERY {
    current_user {
      user {
        id
      }
    }
  }
`;

interface IsAuthenticatedProps {
  children?: React.ReactNode;
}

function IsAuthenticated({ children }: IsAuthenticatedProps) {
  const { loading, error, data } = useQuery(IS_AUTHENTICATED);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  if (!data.current_user) return <Redirect to={{ pathname: "/landing" }} />;

  return <>{children}</>;
}

export default IsAuthenticated;
