import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import cors from "cors";
import {
  KubeConfig,
  AppsV1Api,
  CoreV1Api,
  NetworkingV1Api,
} from "@kubernetes/client-node";

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3002;

const kubeconfig = new KubeConfig();
// kubeconfig.loadFromCluster();
kubeconfig.loadFromString(`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJlRENDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUzTWpNMk1UUTBOVE13SGhjTk1qUXdPREUwTURVME56TXpXaGNOTXpRd09ERXlNRFUwTnpNegpXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUzTWpNMk1UUTBOVE13V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFSSXNBamw1SU1mOU1ETmMxN25zY2ZTeXplem9UVWo3YnVJbTMvS0lVeFQKSzRlZXZsNGRIMXpvaHVhU2tRbVYxV0xzSFFEV2FSZ0dNQWo3aldYMXJoOG9vMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVTJLdXgzWkpoeFJLSEJSMThrR1FqCjJzblU1and3Q2dZSUtvWkl6ajBFQXdJRFNRQXdSZ0loQUpnUjF5VkdreTI5b2tkSGU3aDgwWFhNWkFWNzVnMkwKSHAvK05IajBFcko5QWlFQTZ5K2NlS0UwRlRFd2o4b3pLVGlRVFlQYmV5SkxFMjNTdUVlME83MjZPWGs9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: https://212.2.240.152:6443
  name: collabiq
contexts:
- context:
    cluster: collabiq
    user: collabiq
  name: collabiq
current-context: collabiq
kind: Config
preferences: {}
users:
- name: collabiq
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrVENDQVRlZ0F3SUJBZ0lJSjhTbEJHcnlDeEF3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOekl6TmpFME5EVXpNQjRYRFRJME1EZ3hOREExTkRjek0xb1hEVEkxTURneApOREExTkRjek0xb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJBUEpNRUFGaFFCUStwMSsKZW5ueTdLTXhDY1RUWHJUQzBxUGJpbDdUVTUyb1BhTkRkd3NwRSs0eEJZeFFDTGp5VXNBNnFnZFBYb1h4TkZRTAo0NUFpM2E2alNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCVHVxc2p2MmxuQWd6MCsyZWMrS0J2ZlFxSUdtVEFLQmdncWhrak9QUVFEQWdOSUFEQkYKQWlBNHJZelMrbjRMa1BRSHVuQTl5RExYTURrMlZaOWtyQUpwVys0NWFrWFRCZ0loQUlORGM0YzZXMzA5eXBQNQpEK1BKWkM3d1VJQ0xlckVQS2o4NkMwbU5HcC9SCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdFkyeHAKWlc1MExXTmhRREUzTWpNMk1UUTBOVE13SGhjTk1qUXdPREUwTURVME56TXpXaGNOTXpRd09ERXlNRFUwTnpNegpXakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwWlc1MExXTmhRREUzTWpNMk1UUTBOVE13V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFRb0xXdm4wL3pHUlo4cWsvbWIxbE82cTFSVUpJRGNQeTRPTVZodnNFSGsKUDd2K2dJM09EVk5hZnJ0NHB5YkVISGhsNUQweDJsODlieWoxcGF5ZkM3QnFvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVTdxckk3OXBad0lNOVB0bm5QaWdiCjMwS2lCcGt3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUlnT3lUQnRNOXNMWmNpVjFnVjkvR0t1ZWJMQWN4Yk5udWMKcmhaYkFVa2g0aUVDSVFDSzUyaTRpSGQ5Nk5iZi9YUlhXMitVaktaVTR6ZTd0OHFKdDZmUncxaEU4dz09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    client-key-data: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSVB5THNFZHB3ZlRTaU5SbnlwS1AwR0IvTTFEc3MwUTV1bitSU2NkWkJBenBvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFQThrd1FBV0ZBRkQ2blg1NmVmTHNvekVKeE5OZXRNTFNvOXVLWHROVG5hZzlvME4zQ3lrVAo3akVGakZBSXVQSlN3RHFxQjA5ZWhmRTBWQXZqa0NMZHJnPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=`);
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

// Updated utility function to handle multi-document YAML files
const readAndParseKubeYaml = (filePath: string, replId: string): Array<any> => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
    let docString = doc.toString();
    const regex = new RegExp(`service_name`, "g");
    docString = docString.replace(regex, replId);
    console.log(docString);
    return yaml.parse(docString);
  });
  return docs;
};

app.post("/start", async (req, res) => {
  const { replId } = req.body; // Assume a unique identifier for each user
  const namespace = "default"; // Assuming a default namespace, adjust as needed

  try {
    const kubeManifests = readAndParseKubeYaml(
      path.join(__dirname, "../service.yaml"),
      replId
    );
    for (const manifest of kubeManifests) {
      switch (manifest.kind) {
        case "Deployment":
          await appsV1Api.createNamespacedDeployment(namespace, manifest);
          break;
        case "Service":
          await coreV1Api.createNamespacedService(namespace, manifest);
          break;
        case "Ingress":
          await networkingV1Api.createNamespacedIngress(namespace, manifest);
          break;
        default:
          console.log(`Unsupported kind: ${manifest.kind}`);
      }
    }
    res.status(200).send({ message: "Resources created successfully" });
  } catch (error) {
    console.error("Failed to create resources", error);
    res.status(500).send({ message: "Failed to create resources" });
  }
});

app.post("/startWorker", async (req, res) => {
  const namespace = "default";
  try {
    const kubeManifests = readAndParseKubeYaml(
      path.join(__dirname, "../worker.yaml"),
      ""
    );
    for (const manifest of kubeManifests) {
      switch (manifest.kind) {
        case "Deployment":
          await appsV1Api.createNamespacedDeployment(namespace, manifest);
          break;
        default:
          console.log(`Unsupported kind: ${manifest.kind}`);
      }
    }
    res.status(200).send({ message: "Created Worker" });
  } catch (error) {
    console.error("Failed to create worker", error);
    res.status(500).send({ message: "Failed to create worker" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
