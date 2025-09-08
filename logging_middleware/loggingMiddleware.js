import axios from "axios";

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

/**
 * Logging Middleware (reusable)
 *
 * @param {string} stack - Stack or service name
 * @param {string} level - Log level (info, error, warn, debug, etc.)
 * @param {string} packageName - Name of the package/module
 * @param {string} message - Log message
 * @returns {Promise<Object>} Response data or error object
 */
const Log = async (stack, level, packageName, message) => {
  try {
    const payload = {
      stack,
      level,
      package: packageName,
      message,
    };

    const { data } = await axios.post(LOG_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Log created:", data);
    return data;
  } catch (err) {
    console.error("Failed to send log:", err.message);
    return { error: err.message };
  }
};

export default Log;
