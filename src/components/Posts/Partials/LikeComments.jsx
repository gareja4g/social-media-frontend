import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const LikeComments = ({ post }) => {
  const { id, likes_count, comments_count, is_liked_by_user } = post;
  const [likes, setLikes] = useState(likes_count ?? 0);
  const [commentsVisible, setCommentsVisible] = useState(false); // Track visibility of comments
  const [commentsState, setCommentsState] = useState(comments_count ?? 0); // Track comment count
  const [commentsList, setCommentsList] = useState([]); // Store fetched comments
  const [isLiked, setIsLiked] = useState(is_liked_by_user);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = useSelector((state) => state.auth.token);

  const handleLike = async () => {
    const action = isLiked ? "unlike" : "like";
    const url = `${API_BASE_URL}/posts/${action}/${id}`;

    try {
      const result = await fetchAPI(url);

      if (result.success) {
        // Optimistic UI Update
        setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
        setIsLiked(!isLiked);
        toast.success(isLiked ? "Like removed!" : "Post liked!");
      } else {
        throw new Error(result.message || "Like action failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAPI = async (url, method = "POST", body = null) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const result = await response.json();
      return {
        success: response.ok,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const url = `${API_BASE_URL}/posts/comment/${id}`;
    const result = await fetchAPI(url, "POST", data);

    if (result.success) {
      // Increment the comment count locally after a successful submission
      setCommentsState((prevCount) => prevCount + 1);

      // Fetch updated comments after submitting
      const commentUrl = `${API_BASE_URL}/posts/comments/${id}`;
      const commentResult = await fetchAPI(commentUrl, "GET");

      if (commentResult.success) {
        setCommentsList(commentResult.data || []);
        toast.success("Comment added successfully!");
        reset();
      } else {
        toast.error(
          commentResult.message || "Failed to fetch updated comments"
        );
      }
    } else {
      toast.error(result.message || "Comment submission failed");
    }
  };

  const toggleCommentsVisibility = async () => {
    if (!commentsVisible && commentsList.length === 0) {
      // Fetch comments if they're not already loaded
      const url = `${API_BASE_URL}/posts/comments/${id}`;
      const result = await fetchAPI(url, "GET");

      if (result.success) {
        setCommentsList(result.data || []);
        setCommentsState(result.data?.length ?? 0);
      } else {
        toast.error(result.message || "Failed to fetch comments");
      }
    }

    setCommentsVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <p className="mt-2">
        <a className="link-black text-sm" onClick={handleLike}>
          <i
            className={
              isLiked
                ? "fas fa-thumbs-up mr-1 text-primary"
                : "far fa-thumbs-up mr-1"
            }
          ></i>
          {likes ?? 0} Like
        </a>
        <span className="float-right">
          <a className="link-black text-sm" onClick={toggleCommentsVisibility}>
            <i className="far fa-comments mr-1"></i> Comments ({commentsState})
          </a>
        </span>
      </p>

      {commentsVisible && (
        <div className="comments-list">
          {commentsList.length > 0 ? (
            commentsList.map((comment, index) => (
              <div key={index} className="comment d-flex flex-column mb-3">
                <div className="comment-header d-flex justify-content-between">
                  <span className="comment-username text-primary font-weight-bold">
                    @{comment.user.user_name}
                  </span>
                  <span className="comment-date text-muted">
                    {/* Assuming you have a `created_at` field in the comment object */}
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="comment-body">
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      )}

      <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group input-group-sm mb-0">
          <input
            className="form-control form-control-sm"
            placeholder="Write Comment"
            {...register("comment", { required: "Comment is required" })}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </div>
        {errors.comment && (
          <p className="text-danger">{errors.comment.message}</p>
        )}
      </form>
    </>
  );
};

export default LikeComments;
