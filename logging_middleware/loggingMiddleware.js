import axios from "axios";

// API endpoint
const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

/**
 * Reusable Logging Middleware Function
 *
 * @param {string} stack
 * @param {string} level
 * @param {string} packageName
 * @param {string} message
 */
export default async function Log(stack, level, packageName, message) {
  try {
    const logData = { stack, level, package: packageName, message };
    const response = await axios.post(LOG_API_URL, logData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Log created:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to send log:", error.message);
    return { error: error.message };
  }
}