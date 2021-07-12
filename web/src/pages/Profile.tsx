import "../styles/profile.css";

import { Link, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import CloseButton from "../components/assets/CloseButton";
import CreateProfile from "../components/CreateProfile";
import Following from "../components/Following";
import LikedPosts from "../components/LikedPosts";
import ProfilePicture from "../components/assets/ProfilePicture";
import UpdateProfile from "../components/UpdateProfile";

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    current_user {
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
          bio
          location
          website
          avatar
        }
        likePosts {
          id
          likedAt
          post {
            id
            content
            createdAt
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
      followers {
        id
        followId
        name
        avatar
      }
    }
  }
`;

function Profile() {
  const history = useHistory();
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="main-component">
      <div className="profile-info">
        <div className="profile-head">
          <CloseButton back={true} action={() => history.goBack()} />
          <span>
            <h3>{data.current_user.user.name}</h3>
          </span>
        </div>
        <div className="avatar">
          <ProfilePicture
            image={data.current_user?.profile?.avatar}
            big={true}
          />
        </div>
        <div className="make-profile">
          {data.current_user.user.profile ? (
            <UpdateProfile />
          ) : (
            <CreateProfile />
          )}
        </div>

        <h3 className="name">{data.current_user.user.name}</h3>

        {data.current_user?.profile?.bio && (
          <div className="website">
            <span>Bio</span>
            <small style={{ fontWeight: 400 }}>
              {data.current_user?.profile?.bio}
            </small>
          </div>
        )}

        {data.current_user?.profile?.location && (
          <div style={{ marginTop: "10px" }} className="website">
            <span>Location</span>
            <small style={{ fontWeight: 400 }}>
              <i className="fas fa-map-marker-alt"> </i>{" "}
              {data.current_user?.profile?.location}
            </small>
          </div>
        )}
        {data.current_user.user.profile ? (
          <div style={{ marginTop: "10px" }} className="website">
            <span>Website</span>
            <Link
              className="website-link"
              to={{
                pathname: `http://${data.current_user.user.profile.website}`,
              }}
              target="_blank"
            >
              <i className="fas fa-link"> </i>{" "}
              {data.current_user.user.profile.website}
            </Link>
          </div>
        ) : null}

        <div className="followers">
          <Following
            followers={false}
            following={data.current_user?.user?.following}
          />
          <Following
            followers={true}
            following={data.current_user?.followers}
          />
        </div>
      </div>
      <LikedPosts likedPosts={data.current_user.user.likePosts} />
    </div>
  );
}

export default Profile;
