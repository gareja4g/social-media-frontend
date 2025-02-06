import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import avatar from "../../assets/images/avatar.jpg";
import cover from "../../assets/images/cover.jpg";
import ProfileEditModal from "./ProfileEditModal";
import { request } from "../../utils/api";

export default function MyProfile() {
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [profile, setProfile] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bio, setBio] = useState(""); // state to store bio while editing
  const authToken = useSelector((state) => state.auth.token);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      dispatch(logout());
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (!authToken) {
    dispatch(logout());
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setBio(profile?.bio || "");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (updatedBio) => {
    setBio(updatedBio);
    console.log("Updated bio:", updatedBio);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await request("/user", null, "GET", authToken, true);

        if (result?.success) {
          setProfile(result?.data);
        } else {
          throw new Error(result?.message || "Failed to fetch profile data");
        }
      } catch (error) {
        setApiError(error.message);
      }
    };

    if (authToken && !profile) {
      fetchProfile();
    }
  }, [authToken, profile]); // Only rerun if authToken or profile changes

  if (apiError) {
    return <p className="text-danger">Error: {apiError}</p>;
  }

  if (!profile) {
    return (
      <div className="col-md-3">
        <div className="card card-primary card-outline">
          <div className="card-body box-profile">
            <div
              className="cover-container"
              style={{
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "200px",
                width: "100%",
                position: "relative",
              }}
            >
              <div className="text-center">
                <img
                  className="profile-user-img img-fluid img-circle"
                  src={avatar}
                  alt="User profile picture"
                />
              </div>
            </div>
            <h3 className="profile-username text-center">Loading...</h3>
            <p className="text-muted text-center">Loading...</p>

            <ul className="list-group list-group-unbordered mb-3">
              <li className="list-group-item">
                <b>Followers</b> <a className="float-right">0</a>
              </li>
              <li className="list-group-item">
                <b>Following</b> <a className="float-right">0</a>
              </li>
              <li className="list-group-item">
                <b>Posts</b> <a className="float-right">0</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-3">
      <div className="card card-primary card-outline">
        <div className="card-body box-profile">
          <div
            className="cover-container"
            style={{
              backgroundImage: `url(${profile?.cover_photo_url ?? cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "200px",
              width: "100%",
              position: "relative",
            }}
          >
            <div className="text-center">
              <img
                className="profile-user-img img-fluid img-circle"
                src={profile?.profile_picture_url ?? avatar}
                alt="User profile picture"
              />
            </div>
          </div>
          <h3 className="profile-username text-center">{profile.full_name}</h3>
          <p className="text-muted text-center">@{profile.user_name}</p>

          <ul className="list-group list-group-unbordered mb-3">
            <li className="list-group-item">
              <b>Followers</b>{" "}
              <a className="float-right">{profile?.followers_count ?? 0}</a>
            </li>
            <li className="list-group-item">
              <b>Following</b>{" "}
              <a className="float-right">{profile?.following_count ?? 0}</a>
            </li>
            <li className="list-group-item">
              <b>Posts</b>{" "}
              <a className="float-right">{profile?.posts_count ?? 0}</a>
            </li>
          </ul>

          <div className="d-flex justify-content-between">
            <button onClick={handleOpenModal} className="btn btn-primary">
              <b>Edit</b>
            </button>
            <button onClick={handleLogout} className="btn btn-primary">
              <b>Log out</b>
            </button>
          </div>
        </div>
      </div>

      {profile?.bio && (
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">About Me</h3>
          </div>
          <div className="card-body">
            <p className="text-muted">{profile.bio}</p>
          </div>
        </div>
      )}

      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        initialBio={profile?.bio || ""}
      />
    </div>
  );
}
