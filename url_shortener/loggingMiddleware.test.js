import Log from './middlewares/loggingMiddleware.js';


jest.mock("axios");
const axios = require("axios");

describe("Logging Middleware Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should log successfully (backend error handler)", async () => {
    axios.post.mockResolvedValue({
      data: {
        logID: "12345",
        message: "log created successfully"
      }
    });

    const result = await Log("backend", "error", "handler", "received string, expected bool");

    expect(axios.post).toHaveBeenCalledWith(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack: "backend",
        level: "error",
        package: "handler",
        message: "received string, expected bool"
      },
      expect.any(Object)
    );

    expect(result).toEqual({
      logID: "12345",
      message: "log created successfully"
    });
  });

  test("Should fail with invalid stack", async () => {
    axios.post.mockRejectedValue(new Error("Request failed with status 400"));

    const result = await Log("invalid_stack", "error", "handler", "bad stack value");

    expect(result).toHaveProperty("error");
    expect(result.error).toContain("Request failed");
  });

  test("Should fail if API unreachable", async () => {
    axios.post.mockRejectedValue(new Error("connect ECONNREFUSED"));

    const result = await Log("backend", "fatal", "db", "Critical database failure");

    expect(result).toHaveProperty("error");
    expect(result.error).toContain("connect ECONNREFUSED");
  });
});