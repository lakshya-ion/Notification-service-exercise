import request from "supertest";
import express from "express";
import DBOperations from "../src/DBOperations";
import axios from "axios";
import router from "../src/Router";
const app = express();
app.use("/", router);

describe("Unit Tests for data routes", () => {
  describe("Get /", () => {
    test("GET /:u3Id should return 200 and call getData", async () => {
      jest.spyOn(DBOperations.prototype, "getData").mockResolvedValue({
        profileName: "Energy M&A",
        u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
        type: "Digest",
        isActive: true,
        schedule: {
          monday: ["08:00"],
          friday: ["08:00"],
        },
      });
      jest.spyOn(axios, "get").mockResolvedValue({
        data: {
          u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
          firstName: "Jignesh",
          lastName: "Patel",
          email: "jignesh.patel@iongroup.com",
          timezone: "Asia/Shanghai",
        },
      });
      const u3Id = "76DB413D-6B4F-4F88-9821-C12E306D7BD3";
      const res = await request(app).get(`/${u3Id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
        firstName: "Jignesh",
        lastName: "Patel",
        email: "jignesh.patel@iongroup.com",
        timezone: "Asia/Shanghai",
        profileName: "Energy M&A",
        type: "Digest",
        isActive: true,
        schedule: {
          monday: ["08:00"],
          friday: ["08:00"],
        },
      });

      expect(DBOperations.prototype.getData).toHaveBeenCalledTimes(1);
    });

    test("GET /:u3Id should return 404 if data is not found", async () => {
      jest
        .spyOn(DBOperations.prototype, "getData")
        .mockRejectedValue(new Error("No data found for the given u3Id"));
      jest.spyOn(axios, "get").mockResolvedValue("");
      const u3Id = "76DB413D-6B4F-4F88-9821-C12E306D7BD3";
      const res = await request(app).get(`/${u3Id}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "No data found for the given u3Id" });
    });
  });

  describe("Unit Tests for data routes", () => {
    describe("POST /", () => {
      test("should return 201 and call saveData", async () => {
        const mockData = {
          profileName: "Energy M&A",
          u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
          type: "Digest",
          isActive: true,
          schedule: {
            monday: ["08:00"],
            friday: ["08:00"],
          },
        };
        const mockResponse = { id: "123", ...mockData };

        jest
          .spyOn(DBOperations.prototype, "saveData")
          .mockResolvedValue(mockResponse);

        const res = await request(app).post("/").send(mockData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
          message: "Data inserted successfully",
          result: mockResponse,
        });
        expect(DBOperations.prototype.saveData).toHaveBeenCalledWith(mockData);
      });

      test("should return 400 if saveData throws an error", async () => {
        const mockData = {
          profileName: "Energy M&A",
          type: "Digest",
          isActive: true,
          schedule: {
            monday: ["08:00"],
            friday: ["08:00"],
          },
        }; //no u3id in the data

        jest
          .spyOn(DBOperations.prototype, "saveData")
          .mockRejectedValue(new Error("Error in validating data"));

        const res = await request(app).post("/").send(mockData);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Error in validating data" });
      });
    });
  });
});
