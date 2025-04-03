import express from "express";
import DBOperations from "./DBOperations";
import axios from "axios";

const app = express();
const dbOperations = new DBOperations();

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const result = await dbOperations.saveData(req.body);
    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/:u3Id", async (req, res) => {
  try {
    const { u3Id } = req.params;
    const userData = await axios.get(
      `http://localhost:3000/users/u3ID/${u3Id}`
    );
    const result = await dbOperations.getData({ u3Id });
    const combinedData = { ...userData.data, ...result };
    res.status(200).json(combinedData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post("/create_match", async (req, res) => {
  try {
    const payload = req.body;
    const contentID = payload.contentId;
    const profileIDs = payload.profileIds;
    profileIDs.forEach(async (u3Id: string) => {
      const userApiData = await axios.get(
        `http://localhost:3000/users/u3ID/${u3Id}`
      );
      const timezone = userApiData.data.timezone;
      const DbData = await dbOperations.getData({ u3Id });
      const result = dbOperations.addMatch({ contentID, timezone, DbData });
      res
        .status(201)
        .json({ message: "Matches inserted successfully", result });
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(4500, () => {
  console.log("Server is running on port 4500");
});

export default app;
