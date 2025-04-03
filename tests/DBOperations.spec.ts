import { validateData } from "../src/schemaValidator";
import { MongoClient } from "mongodb";
import DBOperations from "../src/DBOperations";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue({ insertedId: "mockId" }),
          findOne: jest.fn().mockResolvedValue(null),
        }),
      }),
    })),
  };
});
jest.mock("../src/schemaValidator", () => ({
  validateData: jest.fn().mockReturnValue(true),
}));

describe("DBOperations test suite", () => {
  let dbOperations;

  beforeEach(() => {
    dbOperations = new DBOperations();
    dbOperations.connectDB();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("saveData Tests", () => {
    test("saveData should save the data to db successfully", async () => {
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

      const result = await dbOperations.saveData(mockData);

      expect(validateData).toHaveBeenCalledWith(mockData);
      expect(MongoClient).toHaveBeenCalled();
      expect(result).toEqual({ insertedId: "mockId" });
    });
    test("saveData should return an error if the record is found in the db", async () => {
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
      jest
        .spyOn(dbOperations.client.db().collection(), "findOne")
        .mockReturnValue({ user: "lakshya", u3Id: "123456" });
      await expect(dbOperations.saveData(mockData)).rejects.toThrow(
        "The data entered already exists"
      );
    });
  });
  describe("getData test suite", () => {
    test("getData should return the full data from the DB", async () => {
      const u3Id = "402A3266-CD0B-4F3E-8193-FE83AE880529";
      const mockData = {
        u3Id,
        profileName: "Energy M&A",
        type: "Digest",
        isActive: true,
        schedule: {
          monday: ["08:00"],
          friday: ["08:00"],
        },
      };
      jest
        .spyOn(dbOperations.client.db().collection(), "findOne")
        .mockResolvedValue(mockData);

      const result = await dbOperations.getData({ u3Id: u3Id });

      expect(result).toEqual(mockData);
    });
    test("getData should return an error, if the data is not found", async () => {
      const u3ID = "402A3266-CD0B-4F3E-8193-FE83AE880529";

      await expect(dbOperations.getData({ u3ID: u3ID })).rejects.toThrow(
        "No data found for the given u3Id"
      );
    });
  });
});
