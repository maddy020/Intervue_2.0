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
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUzTWpNMk5UQTVNVE13SGhjTk1qUXdPREUwTVRVMU5URXpXaGNOTXpRd09ERXlNVFUxTlRFegpXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUzTWpNMk5UQTVNVE13V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFRdGJxYnVRM1IrM1FyeHgxRjFhVEwrMldkd001L1pvdEFPL1FhOFF5Rk0KZVoybTVwVDJCaHlhRGxWRzBlSEpZNzlCMFBCYi9GUzJoT1J0MVMyVzNwZ1VvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVVhOREZNZXJLb3NMRW1FaUtseCtUClRlSjBlajR3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQUsyc0hFVkRLTW0xSDJ1UE9yRUNZY1N6Q2F1Qi95ZTcKTjd4Y0gxU0hiR1pzQWlCOTRWWE04bzlaZlBIclBOZkRjQWlaK0lXdzhkNmorM1hKNEIxSjFBQzdRZz09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: https://212.2.246.76:6443
  name: prohire
contexts:
- context:
    cluster: prohire
    user: prohire
  name: prohire
current-context: prohire
kind: Config
preferences: {}
users:
- name: prohire
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrakNDQVRlZ0F3SUJBZ0lJVmJKbHVQVVk1Uzh3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOekl6TmpVd09URXpNQjRYRFRJME1EZ3hOREUxTlRVeE0xb1hEVEkxTURneApOREUxTlRVeE0xb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJHNmhsQ0lRb3hSTGtXbS8KemRLZ2VzZi9tTUgrblpFQ3V4NnMwV1htTTJESGRmWUsvaTZmWTNDb3pjaVI3Y0h3KzQ5U1hYcGRVaHQ2ejArSQp4TlpsdTRlalNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCU1ZRQ0hUVHJTMW1Zb09iMFE2ODB4REtTM0JUekFLQmdncWhrak9QUVFEQWdOSkFEQkcKQWlFQXpGUm1rRDBXOTFXZGE3Nm45bXJxRHdURVNhTlozdVQ4YnBzRVFLUndsb01DSVFEamR4L2wvSVpsaC9LMgpMVnUxM1R4SVFhUHBPSkQxMWFkRFAxN1NJRUZyZ3c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlCZGpDQ0FSMmdBd0lCQWdJQkFEQUtCZ2dxaGtqT1BRUURBakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwClpXNTBMV05oUURFM01qTTJOVEE1TVRNd0hoY05NalF3T0RFME1UVTFOVEV6V2hjTk16UXdPREV5TVRVMU5URXoKV2pBak1TRXdId1lEVlFRRERCaHJNM010WTJ4cFpXNTBMV05oUURFM01qTTJOVEE1TVRNd1dUQVRCZ2NxaGtqTwpQUUlCQmdncWhrak9QUU1CQndOQ0FBVGNOR1RsTlVBbllDODFETVlUUVEva295aWZVT00yd25oa3J1Q3dFYmVxCk1NSXRZdWlWN1RhbGFqMDBpNDZQbVBlQnlhbDZPVmJKZlZqa2l0QjFORHJLbzBJd1FEQU9CZ05WSFE4QkFmOEUKQkFNQ0FxUXdEd1lEVlIwVEFRSC9CQVV3QXdFQi96QWRCZ05WSFE0RUZnUVVsVUFoMDA2MHRabUtEbTlFT3ZOTQpReWt0d1U4d0NnWUlLb1pJemowRUF3SURSd0F3UkFJZ0tER1cwUjdKZ3FiYVRDSGNYS0c5bDBHZExnZGVWc3NoClJTTVE1bnhDbWp3Q0lFQmRiUUlqbUc5cWNzTkdYMWJHZk1iWVEzbUhPOGJTRzVYZGFQa0FkZ3JOCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    client-key-data: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSURBV0tpUkF3SHE3TkIvbHgrS1AvcUQ3ZlRXYWxMQld3YzRPWVl3U0tTNkxvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFYnFHVUloQ2pGRXVSYWIvTjBxQjZ4LytZd2Y2ZGtRSzdIcXpSWmVZellNZDE5Z3IrTHA5agpjS2pOeUpIdHdmRDdqMUpkZWwxU0czclBUNGpFMW1XN2h3PT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=`);
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
