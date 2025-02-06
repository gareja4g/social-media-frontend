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
export const request = async (
  url,
  data = null,
  method = "POST",
  token = null
) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if ((method === "POST" || method === "PUT") && data) {
      let formData = new FormData();
      flattenFormData(data, formData);
      options.body = formData;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const result = await response.json();

    if (!response.ok || !result.success) {
      if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(", ");
        throw new Error(errorMessages || result.message || "Request failed");
      } else {
        throw new Error(result.message || "Request failed");
      }
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};
