import express from "express";
import cors from "cors";
import { copyS3Folder } from "@repo/aws_utils";

const app = express();
app.use(cors());
app.use(express.json());
app.post("/project", async (req, res) => {
  try {
    const { replId, language } = req.body;
    console.log(replId);
    console.log(language);
    if (!replId) {
      res.status(400).send("Bad request");
      return;
    }
    await copyS3Folder(`base/${language}`, `code/${replId}`);
    res.send("Project Created");
  } catch (error) {
    console.error(error);
  }
});

app.listen(8000, () => console.log("App is running on port 8000"));
