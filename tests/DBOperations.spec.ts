import { validateData } from "../src/schemaValidator";
import { MongoClient } from "mongodb";
import DBOperations from "../src/DBOperations";
import { convertSchedule } from "../src/convertSchedule";

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

jest.mock("../src/convertSchedule", () => ({
  convertSchedule: jest.fn().mockReturnValue(["2025-03-31T12:00:00.000Z"]),
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
  describe("saveMatch Tests", () => {
    test("saveMatch should save the match successfully", async () => {
      const mockData = {
        contentID:
          "https://notifications-content-store.mmgapi.net/content/intel-prime-3027806",
        profileIds: ["60dd16219914b6002c47cb9b", "60de734bd410ae002cfce206"],
        timezone: "America/New_York",
        DbData: {
          u3Id: "60dd16219914b6002c47cb9b",
          type: "Digest",
          schedule: {
            monday: ["08:00"],
            friday: ["08:00"],
          },
        },
      };

      const result = await dbOperations.saveMatch(mockData);

      expect(MongoClient).toHaveBeenCalled();
      expect(convertSchedule).toHaveBeenCalledWith(
        mockData.DbData.schedule,
        mockData.timezone
      );
      expect(result).toEqual({ insertedId: "mockId" });
    });

    test("saveMatch should throw an error if the record already exists", async () => {
      const mockData = {
        u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
        contentID: "content123",
        timezone: "America/Los_Angeles",
        DbData: {
          u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
          type: "Digest",
          schedule: {
            monday: ["08:00"],
            friday: ["08:00"],
          },
        },
      };

      jest
        .spyOn(dbOperations.client.db().collection(), "findOne")
        .mockResolvedValue({ u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529" });

      await expect(dbOperations.saveMatch(mockData)).rejects.toThrow(
        "The data entered already exists"
      );
    });

    test("saveMatch should handle non-Digest types correctly", async () => {
      const mockData = {
        u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
        contentID: "content456",
        timezone: "Asia/Tokyo",
        DbData: {
          u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
          type: "Instant",
        },
      };

      const result = await dbOperations.saveMatch(mockData);

      expect(MongoClient).toHaveBeenCalled();
      expect(result).toEqual({ insertedId: "mockId" });
    });
  });
});
