import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Layouts/Navbar";
import ContentHeader from "../components/Layouts/ContentHeader";
import Footer from "../components/Layouts/Footer";
import { request } from "../utils/api";
import { useSelector } from "react-redux";
import avatar from "../assets/images/avatar.jpg";

export default function SearchResults() {
  const authToken = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState({});
  const location = useLocation();

  // Extract query parameter
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    fetchUsers(query);
  }, [query]);

  const fetchUsers = async (searchTerm) => {
    setLoading(true);
    try {
      let url = searchTerm
        ? `/user/search?search=${searchTerm}`
        : `/user/search?search`;
      const response = await request(url, null, "GET", authToken);

      // Assuming API response includes a 'followed' field indicating if user is followed
      const usersData = response.data.map((user) => ({
        ...user,
        followed: user.followed || false,
      }));

      setUsers(usersData);
      setFollowedUsers(
        usersData.reduce((acc, user) => {
          acc[user.id] = user.followed;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
    setLoading(false);
  };

  const handleFollow = async (userId) => {
    try {
      const response = await request(
        `/follow/${userId}`,
        null,
        "POST",
        authToken
      );

      if (response.success) {
        setFollowedUsers((prev) => ({
          ...prev,
          [userId]: true,
        }));
      }
    } catch (error) {
      console.error("Error following user:", error.message);
    }
  };

  return (
    <div className="wrapper">
      <Navbar />
      <div className="content-wrapper">
        <ContentHeader />

        <section className="content">
          <div className="card card-solid">
            <div className="card-body pb-0">
              {loading ? (
                <p>Loading...</p>
              ) : users.length > 0 ? (
                <div className="row">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
                    >
                      <div className="card bg-light d-flex flex-fill">
                        <div className="card-header text-muted border-bottom-0">
                          @{user.user_name || "N/A"}
                        </div>
                        <div className="card-body pt-0">
                          <div className="row">
                            <div className="col-7">
                              <h2 className="lead">
                                <b>{user.full_name || "N/A"}</b>
                              </h2>
                              <p className="text-muted text-sm">
                                <b>About: </b>{" "}
                                {user.bio || "No details provided"}
                              </p>
                            </div>
                            <div className="col-5 text-center">
                              <img
                                src={user.profile_picture || avatar}
                                alt="user-avatar"
                                className="img-circle img-fluid"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="text-right">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleFollow(user.id)}
                              disabled={
                                followedUsers[user.id] || user.is_following
                              }
                            >
                              {followedUsers[user.id] || user.is_following
                                ? "Followed"
                                : "Follow"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No users found for "{query}".</p>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
