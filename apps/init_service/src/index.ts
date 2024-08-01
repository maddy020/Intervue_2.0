require("dotenv").config();
import express from "express";
import cors from "cors";
import { copyS3Folder } from "@repo/aws_utils";
import { AccessToken } from "livekit-server-sdk";

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

const createToken = async (replId: string, username: string) => {
  if (replId == "" && username == "") return;
  console.log(process.env.LIVEKIT_API_KEY);
  console.log(process.env.LIVEKIT_API_SECRET);
  const ind = username.indexOf("user");
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: username,
      name: username.substring(0, ind),
    }
  );
  console.log("Repl id in backend", replId);
  at.addGrant({ roomJoin: true, room: replId });

  return await at.toJwt();
};

app.get("/getToken", async (req, res) => {
  const { username, replId } = req.query;
  const token = await createToken(replId as string, username as string);
  res.json({ token: token });
});

app.listen(8000, () => console.log("App is running on port 8000"));
