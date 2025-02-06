import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import avatar from "../../assets/images/avatar.jpg";
import LikeComments from "./Partials/LikeComments";
import { request } from "../../utils/api";

const Posts = ({ apiUrl, onUpdate }) => {
  const authToken = useSelector((state) => state.auth.token);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [apiUrl]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await request(
          `${apiUrl}?page=${page}`,
          null,
          "GET",
          authToken,
          true
        );

        if (result?.success) {
          setPosts((prevPosts) => [...prevPosts, ...result?.data?.data]);
          setHasMore(result?.data?.data.length > 0);
        } else {
          throw new Error(result?.message || "Failed to fetch posts");
        }
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchPosts();
    }
  }, [apiUrl, authToken, page]);

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

    try {
      const response = await request(
        `/posts/delete/${postId}`,
        null,
        "DELETE",
        authToken,
        true
      );

      if (!response?.success) {
        throw new Error(response?.message || "Failed to delete post");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setPosts((prevPosts) => [
        ...prevPosts,
        posts.find((post) => post.id === postId),
      ]);
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (apiError) return <p className="text-danger">Error: {apiError}</p>;

  return (
    <div className="posts-container">
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post, index) => (
          <div className="post" key={`${post.id}-${index}`}>
            <div className="user-block">
              <img
                className="img-circle img-bordered-sm"
                src={post.user?.profile_picture_url ?? avatar}
                alt="user image"
              />
              <span className="username">
                <a href="#">{post.user?.full_name}</a>
                {post.user_id === userId && (
                  <>
                    <a
                      className="float-right btn-tool"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <i className="fas fa-times"></i>
                    </a>
                    <a
                      className="float-right btn-tool"
                      onClick={() => onUpdate(post)} // Call the onUpdate function with the selected post
                    >
                      <i className="fas fa-edit"></i>
                    </a>
                  </>
                )}
              </span>
              <span className="description">
                Shared {post?.created_at_human}
              </span>
            </div>

            <p>{post.content}</p>

            {post.media_url && (
              <img
                src={post.media_url}
                alt="Post media"
                className="img-fluid rounded"
                style={{ width: "300px", height: "200px", objectFit: "cover" }}
              />
            )}

            <LikeComments post={post} />
          </div>
        ))
      )}
      {hasMore && (
        <button className="btn btn-primary mt-3" onClick={loadMorePosts}>
          See More
        </button>
      )}
    </div>
  );
};

export default Posts;
