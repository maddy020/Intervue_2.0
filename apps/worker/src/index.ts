import { Worker } from "bullmq";
import axios from "axios";

console.log("Worker initiated");

const worker = new Worker(
  "Intervue",
  async (job) => {
    try {
      const res = await axios.post("http://localhost:3002/start", {
        replId: job.data.replId,
      });
      console.log(res);
    } catch (error) {
      console.log("Error in creating the worker", error);
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} has failed with error ${err.message}`);
});
