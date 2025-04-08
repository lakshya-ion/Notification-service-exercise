import { validateData } from "../../src/schemaValidator";
import request from "supertest";
import express from "express";
import DBOperations from "../../src/DBOperations";
import axios from "axios";
import router from "../../src/Routes";

const app = express();
app.use(express.json());
app.use("/", router);

jest.mock("../../src/schemaValidator", () => ({
  validateData: jest.fn().mockReturnValue(true),
}));

describe("Unit Tests for data routes", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Ensures clean state for each test
  });

  const mockProfileData = {
    profileName: "Energy M&A",
    u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
    type: "Digest",
    isActive: true,
    schedule: {
      monday: ["08:00"],
      friday: ["08:00"],
    },
  };

  const mockUserDetails = {
    u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
    firstName: "Jignesh",
    lastName: "Patel",
    email: "jignesh.patel@iongroup.com",
    timezone: "Asia/Shanghai",
  };

  describe("GET /notification-profiles/:u3Id", () => {
    test("should return 200 and call getData", async () => {
      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockResolvedValue(mockProfileData);
      jest.spyOn(axios, "get").mockResolvedValue({ data: mockUserDetails });

      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ...mockUserDetails, ...mockProfileData });
      expect(DBOperations.prototype.getData).toHaveBeenCalledTimes(1);
    });

    test("should return 404 if data is not found", async () => {
      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockRejectedValue(new Error("No data found for the given u3Id"));
      jest.spyOn(axios, "get").mockResolvedValue("");

      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User data not found" });
    });

    test("should return 500 if database connection fails", async () => {
      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockRejectedValue(new Error("Database connection failed"));
      jest.spyOn(axios, "get").mockResolvedValue("");

      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });

    test("should return 500 if external API call fails", async () => {
      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockResolvedValue(mockProfileData);
      jest
        .spyOn(axios, "get")
        .mockRejectedValue(new Error("Failed to fetch user data"));

      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: `Failed to fetch user data for u3Id: ${mockProfileData.u3Id}`,
      });
    });
  });

  describe("POST /notification-profiles", () => {
    test("should return 201 and call saveData", async () => {
      const mockResponse = { id: "123", ...mockProfileData };

      jest
        .spyOn(DBOperations.prototype, "saveData")
        .mockResolvedValue(mockResponse);

      const res = await request(app)
        .post("/notification-profiles")
        .send(mockProfileData);

      expect(validateData).toHaveBeenCalledWith(mockProfileData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: "Data inserted successfully",
        result: mockResponse,
      });
      expect(DBOperations.prototype.saveData).toHaveBeenCalledWith(
        mockProfileData
      );
    });

    test("should return 500 if database connection fails", async () => {
      jest
        .spyOn(DBOperations.prototype, "saveData")
        .mockRejectedValue(new Error("Database connection failed"));

      const res = await request(app)
        .post("/notification-profiles")
        .send(mockProfileData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("POST /notification-matches", () => {
    const mockMatchRequest = {
      contentId:
        "https://notifications-content-store.mmgapi.net/content/intel-prime-3027806",
      profileIds: ["60dd16219914b6002c47cb9b", "60de734bd410ae002cfce206"],
    };

    test("should return 201 and call saveMatch", async () => {
      const mockMatchResponse = {};

      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockResolvedValue(mockProfileData);
      jest
        .spyOn(DBOperations.prototype, "saveMatch")
        .mockResolvedValue(mockMatchResponse);
      jest.spyOn(axios, "get").mockResolvedValue({ data: mockUserDetails });

      const res = await request(app)
        .post("/notification-matches")
        .send(mockMatchRequest);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: "Matches inserted successfully" });
      expect(DBOperations.prototype.saveMatch).toHaveBeenCalled();
    });

    test("should return 500 when saveMatch fails", async () => {
      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockResolvedValue(mockProfileData);
      jest
        .spyOn(DBOperations.prototype, "saveMatch")
        .mockRejectedValue(new Error("Failed to insert match"));
      jest.spyOn(axios, "get").mockResolvedValue({ data: mockUserDetails });

      const res = await request(app)
        .post("/notification-matches")
        .send(mockMatchRequest);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: `Failed to insert match for u3Id: 60dd16219914b6002c47cb9b`,
      });
    });

    test("should return 400 if request body is missing required fields", async () => {
      const invalidMatchRequest = { contentId: "https://example.com/content" };

      const res = await request(app)
        .post("/notification-matches")
        .send(invalidMatchRequest);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Invalid request payload",
      });
    });
  });
});
