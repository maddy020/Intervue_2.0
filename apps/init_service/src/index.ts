require("dotenv").config();
import express from "express";
import cors from "cors";
import { copyS3Folder } from "@repo/aws_utils";
import { AccessToken } from "livekit-server-sdk";
import { Queue } from "bullmq";
import prisma from "@repo/prismaclient";

const app = express();
const queue = new Queue("Intervue", {
  connection: {
    host: "redis.cloud.rishavrtwt.tech",
  },
});
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

app.post("/schedulemeet", async (req, res) => {
  try {
    const { replId, scheduleTime, participants, interviewer } = req.body;
    const currTime = new Date();
    const t = new Date(scheduleTime);
    const delay = t.getTime() - currTime.getTime();
    await queue.add(
      replId,
      {
        data: {
          participants,
          replId,
          interviewer,
          scheduleTime,
        },
      },
      {
        delay: delay,
        removeOnComplete: true,
        removeOnFail: true,
        jobId: replId,
      }
    );
    const p = participants.map((participant: { id: string }) => ({
      userId: participant.id,
    }));
    const newMeet = await prisma.meet.create({
      data: {
        roomId: replId,
        userId: interviewer.id,
        status: "scheduled",
        participants: {
          create: p,
        },
        dateandTime: scheduleTime,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
    return res.json({ status: "meeting scheduled", newMeet: newMeet });
  } catch (error) {
    console.log("Error in scheduling meeting", error);
    return res.json({ status: "error in scheduling meeting" });
  }
});

app.get("/allUsers", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
    res.json({ allUsers });
  } catch (err) {
    console.log("Error in getting all users", err);
  }
});

app.post("/addUser", async (req, res) => {
  try {
    const { email, name } = req.body;
    await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });
    res.json({ status: "User added" });
  } catch (error) {
    console.error(error);
  }
});

app.get("/interviewsToConduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allmeet = await prisma.meet.findMany({
      where: {
        userId: id,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json({ allmeet });
  } catch (error) {
    console.log("Error in getting all meetings", error);
  }
});

app.get("/interviewsToAttend/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allmeet = await prisma.meet.findMany({
      where: {
        participants: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json({ allmeet });
  } catch (error) {
    console.log("Error while handle Interviews to Attend", error);
  }
});

app.get("/currentUser/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const currentUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    res.json({ currentUser });
  } catch (error) {
    console.log("Error in getting current user", error);
  }
});

app.delete("/deleteMeet/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const replId = await prisma.meet.findFirst({
      where: {
        id: id,
      },
      select: {
        roomId: true,
      },
    });

    if (replId) {
      await queue.remove(replId.roomId);
      console.log(`Removed job with id ${replId.roomId}`);
    }

    await prisma.meetsParticipants.deleteMany({
      where: {
        meetId: id,
      },
    });

    await prisma.meet.delete({
      where: {
        id: id,
      },
    });

    res.json({ status: "meeting deleted" });
  } catch (error) {
    console.log("Error in deleting meeting", error);
    res.status(500).json({ error: "Error in deleting meeting" });
  }
});

app.listen(8000, async () => {
  console.log("App is running on port 8000");
  // setTimeout(async () => {
  //   await axios.post("http://localhost:3002/startWorker");
  // }, 10000);
});
