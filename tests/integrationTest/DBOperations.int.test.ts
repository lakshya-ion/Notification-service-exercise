import DBOperations from "../../src/DBOperations";
import { MongoClient } from "mongodb";
import { convertSchedule } from "../../src/convertSchedule";

let mockInsertOne = jest.fn().mockResolvedValue({ insertedId: "mockId" });
let mockFindOne = jest.fn().mockResolvedValue(null);

jest.mock("mongodb", () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: mockInsertOne,
        findOne: mockFindOne,
      }),
    }),
  })),
}));

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

describe("DBOperations integration: saveMatch and convertSchedule", () => {
  let dbOperations;

  beforeEach(() => {
    dbOperations = new DBOperations();
    dbOperations.connectDB();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("saveMatch should store and return correct deliveryTime from convertSchedule", async () => {
    const expectedDeliveryTime = convertSchedule(
      mockData.DbData.schedule,
      mockData.timezone
    )[0];

    const result = await dbOperations.saveMatch(mockData);

    expect(mockInsertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        profileId: mockData.DbData.u3Id,
        contentID: mockData.contentID,
        deliveryTime: expectedDeliveryTime,
      })
    );

    const insertedData = mockInsertOne.mock.calls[0][0]; //this will fetch the value from first mock, and the first value of it
    expect(insertedData.deliveryTime).toBe(expectedDeliveryTime);

    expect(result.insertedId).toBe("mockId");
  });
});
