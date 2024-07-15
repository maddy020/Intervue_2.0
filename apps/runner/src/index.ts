import express from "express";
import { initWs } from "./ws";
import cors from "cors";
import { createServer } from "http";

const app = express();
app.use(cors());

const httpServer = createServer(app);
initWs(httpServer);
httpServer.listen(3005, () => console.log("Server is running on port 3005"));
