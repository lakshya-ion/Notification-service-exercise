import express from "express";
import { validateData } from "./schemaValidator";
import DBOperations from "./DBOperations";
import axios from "axios";

const app = express();
const dbOperations = new DBOperations();

app.use(express.json());

async function fetchUserData(u3Id: string) {
  try {
    const response = await axios.get(
      `http://localhost:3000/users/u3ID/${u3Id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user data for u3Id: ${u3Id}`);
  }
}

app.post("/notification-profiles", async (req, res) => {
  try {
    try {
      validateData(req.body);
    } catch (error) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const result = await dbOperations.saveData(req.body);
    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    if (error.message.includes("exists")) {
      return res.status(409).json({ error: "Data already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/notification-profiles/:u3Id", async (req, res) => {
  try {
    const { u3Id } = req.params;

    let userData;
    try {
      userData = await fetchUserData(u3Id);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    const dbData = await dbOperations.getData({ u3Id });
    const combinedData = { ...userData, ...dbData };

    res.status(200).json(combinedData);
  } catch (error) {
    if (error.message.includes("No data found")) {
      return res.status(404).json({ error: "User data not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/notification-matches", async (req, res) => {
  try {
    const { contentId, profileIds } = req.body;

    if (!contentId || !Array.isArray(profileIds) || profileIds.length === 0) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    for (const u3Id of profileIds) {
      let timezone, DbData;

      try {
        const userApiData = await fetchUserData(u3Id);
        timezone = userApiData.timezone;
      } catch (error) {
        return res.status(502).json({ error: error.message });
      }

      try {
        DbData = await dbOperations.getData({ u3Id });
      } catch (dbError) {
        return res
          .status(404)
          .json({ error: `No profile data found for u3Id: ${u3Id}` });
      }

      try {
        await dbOperations.saveMatch({
          contentID: contentId,
          timezone,
          DbData,
        });
      } catch (matchError) {
        return res
          .status(500)
          .json({ error: `Failed to insert match for u3Id: ${u3Id}` });
      }
    }

    res.status(201).json({ message: "Matches inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(4500, () => {
  console.log("Server is running on port 4500");
});

export default app;
