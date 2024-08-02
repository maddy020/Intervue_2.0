import { Job, Worker } from "bullmq";
import axios from "axios";

console.log("Worker initiated");

const requestHandler = async (job: Job) => {
  try {
    const res = await axios.post("http://localhost:3002/start", {
      replId: job.data.data.replId as string,
    });
    console.log(res);
  } catch (error) {
    console.log("Error in creating the worker", error);
  }
};
const worker = new Worker("Intervue", (job: Job) => requestHandler(job), {
  connection: {
    host: "redis.cloud.rishavrtwt.tech",
  },
});

worker.on("completed", (job: Job) => {
  console.log(`Job ${job.id} has completed`);
});

worker.on("failed", (job: Job | undefined, err) => {
  console.log(`Job ${job?.id} has failed with error ${err.message}`);
});
