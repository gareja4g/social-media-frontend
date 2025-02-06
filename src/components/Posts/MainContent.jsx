import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import PostModal from "./Partials/PostModal";
import Posts from "./Posts";

const flattenFormData = (data, formData, prefix = "") => {
  Object.entries(data).forEach(([key, value]) => {
    const fieldName = prefix ? `${prefix}[${key}]` : key;

    if (value instanceof FileList) {
      // Handle file uploads
      for (let i = 0; i < value.length; i++) {
        formData.append(fieldName, value[i]);
      }
    } else if (typeof value === "object" && value !== null) {
      // Recursively flatten nested objects
      flattenFormData(value, formData, fieldName);
    } else {
      // Append regular form fields
      formData.append(fieldName, value);
    }
  });
};

export default function MainContent() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = useSelector((state) => state.auth.token);
  const [activeTab, setActiveTab] = useState("explore");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentPost, setCurrentPost] = useState(null);

  const apiUrl = `/posts/${
    activeTab === "explore" ? "relevant-post" : "my-post"
  }`;

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setModalMode("create");
    setCurrentPost(null);
    setShowModal(true);
  }, []);

  const handleOpenUpdateModal = useCallback((post) => {
    setModalMode("update");
    setCurrentPost(post);
    setShowModal(true);
  }, []);

  const handleSavePost = useCallback(
    async (postData, postId) => {
      try {
        let formData = new FormData();
        if (postData?.file) formData.append("media", postData?.file);
        flattenFormData(postData, formData);

        const url = postId
          ? `${API_BASE_URL}/posts/update/${postId}`
          : `${API_BASE_URL}/posts/store`;

        const method = "POST";

        // Debugging output
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${authToken}`,
            // No Content-Type header for FormData
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to save the post");
        }

        toast.success(
          postId ? "Post updated successfully!" : "Post created successfully!"
        );
      } catch (error) {
        console.error("Error saving post:", error);
        toast.error(error.message);
      }
    },
    [authToken]
  );

  return (
    <div>
      <div className="card-header p-2">
        <div className="row">
          <div className="col-sm-6">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "explore" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("explore")}
                >
                  Explore
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "mypost" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("mypost")}
                >
                  My Post
                </a>
              </li>
            </ul>
          </div>
          <div className="col-sm-6">
            <button
              className="btn btn-primary float-sm-right"
              onClick={handleOpenCreateModal}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="tab-content">
          <div
            className={`tab-pane ${
              activeTab === "explore" || activeTab === "mypost" ? "active" : ""
            }`}
            id={activeTab}
          >
            <Posts apiUrl={apiUrl} onUpdate={handleOpenUpdateModal} />
          </div>
        </div>
      </div>

      <PostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePost}
        postData={currentPost}
        modalTitle={modalMode === "create" ? "Create Post" : "Update Post"}
        buttonText={modalMode === "create" ? "Create" : "Update"}
        onSubmit={handleSavePost}
        modalMode={modalMode}
      />
    </div>
  );
}
