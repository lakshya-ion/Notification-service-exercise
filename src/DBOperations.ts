import { MongoClient } from "mongodb";
import moment from "moment-timezone";
import { convertSchedule } from "./convertSchedule";
const URL = "mongodb://localhost:27017";
const DB_NAME = "growthteam";
const COLLECTION_NAME = "test";
const COLLECTION_NAME_MATCH = "matches";

class DBOperations {
  client = null;

  async connectDB(mongoUrl?: string) {
    if (!this.client) {
      try {
        const url = mongoUrl || URL;
        this.client = new MongoClient(url);
        await this.client.connect();
        console.log(`Connected to mongoClient`);
      } catch (error) {
        // console.error("Database connection error:", error);
        throw new Error("Database connection failed");
      }
    }
  }

  async closeConnection() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log("Database connection closed.");
    }
  }

  async saveData(data) {
    try {
      if (!this.client) {
        await this.connectDB();
      }

      const db = this.client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const existingData = await collection.findOne({ u3Id: data.u3Id });
      if (existingData) {
        throw new Error("The data entered already exists");
      }

      const result = await collection.insertOne(data);
      console.log("Data inserted successfully:", result.insertedId);
      return result;
    } catch (error) {
      // console.error("Error inserting data:", error);
      throw error;
    }
  }

  async getData(data) {
    try {
      if (!this.client) {
        await this.connectDB();
      }

      const db = this.client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const retrievedData = await collection.findOne({ u3Id: data.u3Id });
      if (!retrievedData) {
        throw new Error("No data found for the given u3Id");
      }

      return { ...data, ...retrievedData };
    } catch (error) {
      // console.error("Error retrieving data:", error);
      throw error;
    }
  }

  async saveMatch(data: any) {
    try {
      await this.connectDB();
      const db = this.client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME_MATCH);

      const existingData = await collection.findOne({ u3Id: data.u3Id });
      if (existingData) {
        throw new Error("The data entered already exists");
      }
      const contentID = data.contentID;
      const dbData = data.DbData;
      const timezone = data.timezone;
      const u3ID = dbData.u3Id;
      const createTime = new Date();

      let deliveryTime: string;
      if (dbData.type === "Digest") {
        const scheduleTimes = convertSchedule(dbData.schedule, timezone);
        deliveryTime =
          scheduleTimes.length > 0
            ? scheduleTimes[0]
            : createTime.toISOString();
      } else {
        deliveryTime = moment
          .tz(createTime, timezone)
          .tz("America/New_York")
          .toISOString();
      }

      const insData = {
        profileId: u3ID,
        contentID: contentID,
        created: createTime,
        deliveryTime: deliveryTime,
      };

      const inserted = await collection.insertOne(insData);
      console.log("Match inserted successfully:", inserted.insertedId);
      return inserted;
    } catch (error) {
      // console.error("Error inserting match:", error.message);
      throw new Error(`Failed to insert match: ${error.message}`);
    }
  }
}

export default DBOperations;
