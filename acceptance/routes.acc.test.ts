import request from "supertest";
import express from "express";
import router from "../src/Routes";
import axios from "axios";
import DBOperations from "../src/DBOperations";

const app = express();
app.use(express.json());
app.use("/", router); //now the mock app will be using router as the middleware

let mockFindOne = jest.fn().mockResolvedValue(null);
jest.mock("mongodb", () => {
  //creating mock for the MongoDb
  return {
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue({ insertedId: "mockId" }),
          findOne: mockFindOne,
        }),
      }),
    })),
  };
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

describe("Routes test suite", () => {
  let dbOperations;
  beforeEach(() => {
    dbOperations = new DBOperations();
    dbOperations.connectDB();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET/ ", () => {
    test("Should return success on getting data", async () => {
      mockFindOne.mockResolvedValueOnce(mockProfileData);
      jest.spyOn(axios, "get").mockResolvedValue({ data: mockUserDetails });
      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );
      //user-api is mocked and the getData function will be called
      //hence the findone should return something in mongo

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ...mockUserDetails, ...mockProfileData });
    });
    test("should return error if the data does not exist in the db", async () => {
      jest.spyOn(axios, "get").mockResolvedValue({ data: mockUserDetails });
      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "User data not found" });
    });
    test("should return error if the user api is not able to give correct data", async () => {
      jest.spyOn(axios, "get").mockRejectedValue(new Error("User API failed"));

      const res = await request(app).get(
        `/notification-profiles/${mockProfileData.u3Id}`
      );
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        error:
          "Failed to fetch user data for u3Id: 76DB413D-6B4F-4F88-9821-C12E306D7BD3",
      });
    });
  });
  describe("POST/", () => {
    test("should return success on saving data correctly", async () => {
      const res = await request(app)
        .post("/notification-profiles")
        .send(mockProfileData);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toEqual("Data inserted successfully");
    });
    test("should return failure with status 409 if data already exists", async () => {
      mockFindOne.mockResolvedValueOnce({ user: "lakshya", mentor: "ashwini" });
      const res = await request(app)
        .post("/notification-profiles")
        .send(mockProfileData);
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toEqual("Data already exists");
    });

    test("should return 201 when match is inserted successfully", async () => {
      mockFindOne.mockResolvedValueOnce(mockProfileData);
      jest
        .spyOn(axios, "get")
        .mockResolvedValueOnce({ data: { timezone: "Asia/Shanghai" } });

      const res = await request(app)
        .post("/notification-matches")
        .send({
          contentId: "content-123",
          profileIds: [mockProfileData.u3Id],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Matches inserted successfully");
    });

    test("should return 400 when profileIds is empty", async () => {
      const res = await request(app).post("/notification-matches").send({
        contentId: "content-123",
        profileIds: [],
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid request payload");
    });

    test("should return 502 when user API fails", async () => {
      jest
        .spyOn(axios, "get")
        .mockRejectedValueOnce(new Error("User api failure"));

      const res = await request(app)
        .post("/notification-matches")
        .send({
          contentId: "content-123",
          profileIds: [mockProfileData.u3Id],
        });

      expect(res.statusCode).toBe(502);
      expect(res.body.error).toBe(
        "Failed to fetch user data for u3Id: 76DB413D-6B4F-4F88-9821-C12E306D7BD3"
      );
    });

    test("should return 404 when no profile data is found", async () => {
      jest
        .spyOn(axios, "get")
        .mockResolvedValueOnce({ data: { timezone: "Asia/Shanghai" } });

      const res = await request(app)
        .post("/notification-matches")
        .send({
          contentId: "content-123",
          profileIds: [mockProfileData.u3Id],
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe(
        `No profile data found for u3Id: ${mockProfileData.u3Id}`
      );
    });
  });
});
