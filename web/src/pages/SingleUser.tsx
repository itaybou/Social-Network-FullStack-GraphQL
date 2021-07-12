import "../styles/primary.css";
import "../styles/profile.css";

import { Link, useHistory, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { CURRENT_USER_QUERY } from "./Profile";
import CloseButton from "../components/assets/CloseButton";
import FollowUser from "../components/FollowUser";
import Following from "../components/Following";
import ProfilePicture from "../components/assets/ProfilePicture";
import React from "react";
import UnfollowUser from "../components/UnfollowUser";

// import UnfollowUser from "../components/UnfollowUser";

export const USER_QUERY = gql`
  query USER_QUERY($userId: String!) {
    user(userId: $userId) {
      user {
        id
        name
        following {
          id
          followId
          name
          avatar
        }
        profile {
          id
          avatar
          website
          bio
          location
        }
      }
      followers {
        id
        followId
        name
        avatar
      }
    }
  }
`;

interface ParamType {
  id: string;
}

interface FollowerIds {
  followId: string;
  id: string;
}

function SingleUser() {
  const history = useHistory();
  const { id } = useParams<ParamType>();

  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: {
      userId: id,
    },
  });

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(CURRENT_USER_QUERY);

  if (loading || userLoading) return <p>Loading...</p>;
  if (error || userError) return <p>{error?.message ?? userError?.message}</p>;

  const followingIds = userData.current_user.user.following.map(
    (follow: FollowerIds) => follow.followId
  );

  const follows = userData.current_user.user.following.map(
    (follow: FollowerIds) => follow
  );

  const getFollowId = follows.filter(
    (follow: any) => follow.followId === data.user?.user?.id
  );

  return (
    <div className="main-component">
      <div className="profile-info">
        <div className="profile-head">
          <CloseButton back={true} action={() => history.goBack()} />
          <span>
            <h3>{data.user?.user?.name}</h3>
          </span>
        </div>
        <div className="avatar">
          <ProfilePicture image={data.user?.user?.profile?.avatar} big={true} />
        </div>
        {data.user?.user?.id !== userData.current_user?.user?.id ? (
          <div className="make-profile">
            {followingIds.includes(data.user?.user?.id) ? (
              <UnfollowUser
                id={getFollowId[0].id}
                userId={data.user?.user?.id}
              />
            ) : (
              <FollowUser
                id={data.user?.user?.id}
                name={data.user?.user?.name}
                avatar={data.user?.user?.profile?.avatar}
              />
            )}
          </div>
        ) : (
          <div className="make-profile" style={{ marginTop: "25px" }} />
        )}

        <h3 className="name">{data.user?.user?.name}</h3>

        {data.user?.user?.profile?.bio && (
          <div className="website">
            <span>Bio</span>
            <small style={{ fontWeight: 400 }}>
              {data.user?.user?.profile?.bio}
            </small>
          </div>
        )}

        {data.user?.user?.profile?.location && (
          <div style={{ marginTop: "10px" }} className="website">
            <span>Location</span>
            <small style={{ fontWeight: 400 }}>
              <i className="fas fa-map-marker-alt"> </i>{" "}
              {data.user?.user?.profile?.location}
            </small>
          </div>
        )}
        {data.user?.user?.profile ? (
          <div style={{ marginTop: "10px" }} className="website">
            <span>Website</span>
            <Link
              className="website-link"
              to={{
                pathname: `http://${data.user?.user?.profile.website}`,
              }}
              target="_blank"
            >
              <i className="fas fa-link"> </i>{" "}
              {data.user?.user?.profile.website}
            </Link>
          </div>
        ) : null}

        <div className="followers">
          {/* <Following /> */}
          <Following followers={false} following={data.user?.user?.following} />
          <Following followers={true} following={data.user?.followers} />
        </div>
      </div>
    </div>
  );
}

export default SingleUser;
