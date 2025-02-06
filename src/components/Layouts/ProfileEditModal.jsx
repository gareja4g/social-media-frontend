import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

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

const ProfileEditModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = useSelector((state) => state.auth.token);

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const { getRootProps: coverRootProps, getInputProps: coverInputProps } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => setCoverPhoto(acceptedFiles[0]),
    });

  const { getRootProps: profileRootProps, getInputProps: profileInputProps } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => setProfilePicture(acceptedFiles[0]),
    });

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
  };
  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
  };

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append("email", data.email);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("bio", data.bio);
    formData.append("post_visibility", data.post_visibility);
    formData.append("profile_visibility", data.profile_visibility);
    if (coverPhoto) formData.append("cover_photo", coverPhoto);
    if (profilePicture) formData.append("profile_picture", profilePicture);
    flattenFormData(data, formData);

    try {
      const response = await fetch(`${API_BASE_URL}/user/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Update failed");
      }

      toast.success("Profile updated successfully!");
      onClose(); // Close the modal after success
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* Wrap inputs inside the form and connect with handleSubmit */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="profileForm"
              encType="multipart/form-data"
            >
              {/* Email Input */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>

              {/* First Name Input */}
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("first_name", {
                    required: "First Name is required",
                    maxLength: {
                      value: 50,
                      message: "First Name can't be longer than 50 characters",
                    },
                  })}
                />
                {errors.first_name && (
                  <p className="text-danger">{errors.first_name.message}</p>
                )}
              </div>

              {/* Last Name Input */}
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("last_name", {
                    required: "Last Name is required",
                    maxLength: {
                      value: 50,
                      message: "Last Name can't be longer than 50 characters",
                    },
                  })}
                />
                {errors.last_name && (
                  <p className="text-danger">{errors.last_name.message}</p>
                )}
              </div>

              {/* Bio Textarea */}
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="form-control"
                  {...register("bio", {
                    required: "Bio is required",
                    maxLength: {
                      value: 250,
                      message: "Bio can't be more than 250 characters",
                    },
                  })}
                  rows="3"
                />
                {errors.bio && (
                  <p className="text-danger">{errors.bio.message}</p>
                )}
              </div>

              {/* Post Visibility Dropdown */}
              <div className="form-group">
                <label>Post Visibility</label>
                <select
                  className="form-control"
                  {...register("post_visibility", {
                    required: "Post visibility is required",
                  })}
                >
                  <option value="">Select Visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends</option>
                </select>
                {errors.post_visibility && (
                  <p className="text-danger">
                    {errors.post_visibility.message}
                  </p>
                )}
              </div>

              {/* Profile Visibility Dropdown */}
              <div className="form-group">
                <label>Profile Visibility</label>
                <select
                  className="form-control"
                  {...register("profile_visibility", {
                    required: "Profile visibility is required",
                  })}
                >
                  <option value="">Select Visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends</option>
                </select>
                {errors.profile_visibility && (
                  <p className="text-danger">
                    {errors.profile_visibility.message}
                  </p>
                )}
              </div>

              {/* Profile Photo Section */}
              <div className="form-group">
                <label>
                  <strong>Upload Profile Photo</strong>
                </label>
                <div
                  {...profileRootProps({
                    className: "dropzone border p-4 rounded text-center",
                  })}
                  className="bg-light text-muted"
                >
                  <input {...profileInputProps()} />
                  <p>
                    <strong>Drag & Drop an image here</strong>
                  </p>
                  <p>Or click to select a file</p>
                </div>
                {profilePicture && (
                  <div className="mt-3">
                    <h6>
                      <strong>Profile Photo:</strong>
                    </h6>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span
                        className="text-truncate"
                        style={{ maxWidth: "80%" }}
                      >
                        {profilePicture.name}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={handleRemoveProfilePicture}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Photo Section */}
              <div className="form-group">
                <label>
                  <strong>Upload Cover Photo</strong>
                </label>
                <div
                  {...coverRootProps({
                    className: "dropzone border p-4 rounded text-center",
                  })}
                  className="bg-light text-muted"
                >
                  <input {...coverInputProps()} />
                  <p>
                    <strong>Drag & Drop an image here</strong>
                  </p>
                  <p>Or click to select a file</p>
                </div>
                {coverPhoto && (
                  <div className="mt-3">
                    <h6>
                      <strong>Cover Photo:</strong>
                    </h6>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span
                        className="text-truncate"
                        style={{ maxWidth: "80%" }}
                      >
                        {coverPhoto.name}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={handleRemoveCoverPhoto}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Save button inside the form */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={Object.keys(errors).length > 0}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
