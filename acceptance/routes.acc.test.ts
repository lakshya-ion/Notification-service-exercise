import request from "supertest";
import express from "express";
import router from "../src/Routes";
import { MongoClient } from "mongodb";
const app = express();
app.use(express.json());
app.use("/", router);

const testProfileData = {
  profileName: "Energy M&A",
  u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
  type: "Digest",
  isActive: true,
  schedule: {
    monday: ["08:00"],
    friday: ["08:00"],
  },
};
const testUserDetails = {
  u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
  firstName: "Jignesh",
  lastName: "Patel",
  email: "jignesh.patel@iongroup.com",
  timezone: "Asia/Shanghai",
};

const testMatchData = {
  contentId:
    "https://notifications-content-store.mmgapi.net/content/intel-prime-3027806",
  profileIds: ["76DB413D-6B4F-4F88-9821-C12E306D7BD3"],
};
describe("acceptance tests suite", () => {
  afterAll(async () => {
    let client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    const testColl = client.db("growthteam").collection("test");
    const matchColl = client.db("growthteam").collection("matches");
    testColl.deleteMany({ u3Id: testUserDetails.u3Id });
    matchColl.deleteMany({ profileId: testUserDetails.u3Id });
    // to clear the data, we add to the real db
  });
  test("POST/notification-profiles should POST the data correctly to the db", async () => {
    const res = await request(app)
      .post("/notification-profiles")
      .send(testProfileData);
    expect(res.statusCode).toBe(201);
  });
  test("POST/notification-profiles show error if we try to POST the duplicate data to the db", async () => {
    const res = await request(app)
      .post("/notification-profiles")
      .send(testProfileData);
    expect(res.statusCode).toBe(409);
  });
  test(" GET/notification-profiles Should return success to the user, on fetching the user data", async () => {
    const res = await request(app).get(
      `/notification-profiles/${testProfileData.u3Id}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      ...testUserDetails,
      ...testProfileData,
    });
  });
  test("POST/ notification-matches should post appropriately in the db", async () => {
    const res = await request(app)
      .post("/notification-matches")
      .send(testMatchData);
    expect(res.statusCode).toBe(201);
  });
});
