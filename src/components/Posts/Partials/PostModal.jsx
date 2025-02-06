import { useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone"; // Import react-dropzone
import { FaTrashAlt } from "react-icons/fa"; // For trash icon (remove file)
import { useForm } from "react-hook-form"; // Import useForm

function PostModal({
  isOpen,
  onClose,
  onSave,
  postData,
  modalTitle,
  buttonText,
  onSubmit,
  modalMode,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // Effect to pre-fill form fields when postData changes
  useEffect(() => {
    if (postData) {
      setValue("content", postData.content || "");
      setValue("file", postData.file || null); // Update file as part of form state
    } else {
      setValue("content", "");
      setValue("file", null); // Reset file when no postData
    }
  }, [postData, setValue]);

  // Handle file drop (react-dropzone)
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, video/*",
    onDrop: (acceptedFiles) => {
      // Here, we use setValue to update the file in the form state
      setValue("file", acceptedFiles[0]);
    },
  });

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setValue("file", null); // Remove file from form state
  }, [setValue]);

  // Handle form submission
  const handleSave = useCallback(
    async (data) => {
      const postDataToSend = { content: data.content, file: data.file };

      if (postData) {
        await onSubmit(postDataToSend, postData.id);
      } else {
        await onSubmit(postDataToSend);
      }

      onClose();
    },
    [onSubmit, postData, onClose]
  );

  const currentFile = getValues("file");

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      tabIndex="-1"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow-lg rounded">
          <div className="modal-header">
            <h5 className="modal-title text-primary">{modalTitle}</h5>
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
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="form-group">
                <label htmlFor="postContent">
                  <strong>Write your post:</strong>
                </label>
                <textarea
                  className={`form-control rounded-3 p-3 ${
                    errors.content ? "is-invalid" : ""
                  }`}
                  id="postContent"
                  rows="4"
                  placeholder="What's on your mind?"
                  {...register("content", { required: "Content is required" })}
                />
                {errors.content && (
                  <div className="invalid-feedback">
                    {errors.content.message}
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="form-group">
                <label>
                  <strong>Upload Image/Video</strong>
                </label>
                <div
                  {...getRootProps({
                    className: "dropzone border p-4 rounded text-center",
                  })}
                  className="bg-light text-muted"
                >
                  <input {...getInputProps()} />
                  <p>
                    <strong>Drag & Drop an image/video here</strong>
                  </p>
                  <p>Or click to select a file</p>
                </div>

                {/* Display uploaded file */}
                {currentFile && (
                  <div className="mt-3">
                    <h6>
                      <strong>Uploaded File:</strong>
                    </h6>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span
                        className="text-truncate"
                        style={{ maxWidth: "80%" }}
                      >
                        {currentFile.name}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={handleRemoveFile}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {buttonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
