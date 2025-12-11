import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000/api";

const apiCall = async (methodType, path = "", body = null) => {
  try {
    const url = BASE_URL + path;

    const options = {
      method: methodType.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default apiCall;
