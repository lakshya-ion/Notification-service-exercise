import DBOperations from "../../src/DBOperations";
import { convertSchedule } from "../../src/convertSchedule";
import { MongoClient } from "mongodb";

const mongoUrl = "mongodb://localhost:27010";
const testDbName = "growthteam";
const testCollection = "test";
const matchesCollection = "matches";

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

const matchPayload = {
  contentID:
    "https://notifications-content-store.mmgapi.net/content/intel-prime-3027806",
  profileIds: ["76DB413D-6B4F-4F88-9821-C12E306D7BD3"],
  timezone: mockUserDetails.timezone,
  DbData: {
    u3Id: mockProfileData.u3Id,
    type: mockProfileData.type,
    schedule: mockProfileData.schedule,
  },
};

describe("DBOperations Integration Tests", () => {
  let dbOperations: DBOperations;
  let mongoClient: MongoClient;

  beforeAll(async () => {
    dbOperations = new DBOperations();
    await dbOperations.connectDB(mongoUrl);
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
  });

  afterAll(async () => {
    const db = mongoClient.db(testDbName);
    await db.collection(testCollection).deleteMany({});
    await db.collection(matchesCollection).deleteMany({});
    await mongoClient.close();
    await dbOperations.closeConnection();
  });

  describe("saveData", () => {
    test("should save profile data successfully", async () => {
      const result = await dbOperations.saveData(mockProfileData);
      expect(result.insertedId).toBeDefined();
    });

    test("should throw error if data already exists", async () => {
      await expect(dbOperations.saveData(mockProfileData)).rejects.toThrow(
        "The data entered already exists"
      );
    });
  });

  describe("getData", () => {
    test("should retrieve the inserted profile data", async () => {
      const result = await dbOperations.getData({ u3Id: mockProfileData.u3Id });
      expect(result.profileName).toBe(mockProfileData.profileName);
      expect(result.type).toBe(mockProfileData.type);
    });

    test("should throw error for non-existent u3Id", async () => {
      await expect(
        dbOperations.getData({ u3Id: "non-existent-id" })
      ).rejects.toThrow("No data found for the given u3Id");
    });
  });

  describe("saveMatch", () => {
    test("should save a match with correct deliveryTime", async () => {
      const expectedDeliveryTime = convertSchedule(
        mockProfileData.schedule,
        mockUserDetails.timezone
      )[0];

      const result = await dbOperations.saveMatch(matchPayload);
      expect(result.insertedId).toBeDefined();

      const db = mongoClient.db(testDbName);
      const inserted = await db
        .collection(matchesCollection)
        .findOne({ profileId: mockProfileData.u3Id });

      expect(inserted.deliveryTime).toBe(expectedDeliveryTime);
    });

    test("should throw error if match already exists", async () => {
      await expect(dbOperations.saveMatch(matchPayload)).rejects.toThrow(
        "The data entered already exists"
      );
    });
  });
});
