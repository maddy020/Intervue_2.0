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
kubeconfig.loadFromDefault();
// kubeconfig.loadFromCluster();
// kubeconfig.loadFromString(`apiVersion: v1
// clusters:
// - cluster:
//     certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUzTWpRd01ERXpNekF3SGhjTk1qUXdPREU0TVRjeE5UTXdXaGNOTXpRd09ERTJNVGN4TlRNdwpXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUzTWpRd01ERXpNekF3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFUbTY3RFYwbG50K3N0UjU5cU1ZaHdteTIyM0FwazNCWFBmNnBEVm44cTgKejR1VXNLQ05zbVlVT3diczExci9XSGg1bk5zNUlHVEs2bjJ5b0JkeTZvbFhvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVVRLWFZoWXRRbHNkUUVCL2RNdmhNCjdQMHZNbTR3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQU0rM1VHU05vWXBqR0RjSDZvajdvV0ZyaWdRZ1lxWWQKcTR3QXloK1FqWE5WQWlBeE5PdDNiekdKVkxMN1pzRVhlNW1BblBvOWFBQjdLdWZ1Z1krWlRsYlptUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
//     server: https://212.2.244.249:6443
//   name: intervue_platform
// contexts:
// - context:
//     cluster: intervue_platform
//     user: intervue_platform
//   name: intervue_platform
// current-context: intervue_platform
// kind: Config
// preferences: {}
// users:
// - name: intervue_platform
//   user:
//     client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrVENDQVRlZ0F3SUJBZ0lJVXJLdGNPL0UrS0l3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOekkwTURBeE16TXdNQjRYRFRJME1EZ3hPREUzTVRVek1Gb1hEVEkxTURneApPREUzTVRVek1Gb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJOT0FvOTcwc1BxOHVRNGIKZjRKTHNRVFgzd0pYVEM4cjgvYXlYb1BlZlp3bHNrNkNEOEEyeFkzMjJ4ci9nRTRuUWZVYW9ibUZTbCszNmZnagplS3VCY0NHalNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCVExHSU83R0R1NC9XK3VrQURCaU00YkVaNUlCVEFLQmdncWhrak9QUVFEQWdOSUFEQkYKQWlFQS9hN1pMUmNxU05GdWdWQ0YyN3ppVk11akNRWGtvYUFkeXlja0R5dThUZkFDSUIyaHZtOXFqaXQ5ZDVvUwp4MHNHTURIQTd3MGp6d0V5dTBjY1ZnSCtqYjcrCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJlRENDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdFkyeHAKWlc1MExXTmhRREUzTWpRd01ERXpNekF3SGhjTk1qUXdPREU0TVRjeE5UTXdXaGNOTXpRd09ERTJNVGN4TlRNdwpXakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwWlc1MExXTmhRREUzTWpRd01ERXpNekF3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFTWlUrZXhva1RPYkxsMjU5ZzByTEpmUS94MEdtb0FVUTQ4TVJXMWI4K08Kb1NSeVJBQjZ2STdXeEswT09qL3Q2bTZpLzd4eHZvdHhrRWZMa2QrN1lZdStvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVXl4aUR1eGc3dVAxdnJwQUF3WWpPCkd4R2VTQVV3Q2dZSUtvWkl6ajBFQXdJRFNRQXdSZ0loQU5RVHdXdUs3Y0VaSTd0YnpOTWV5USttbUJVNCtwMWMKU1dSOUl4ZjJyNGd2QWlFQWovcGZXNUd3T2g3Z2svWVBSaUJvNVZrNDF1azlaNVgyOUVRamNzV2o2Vjg9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
//     client-key-data: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSU95WWc1bi9aamZCVFE5a25zQTRGUjZnblNmaHdlRk5YcitqRFlxTk5KWUdvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFMDRDajN2U3crcnk1RGh0L2drdXhCTmZmQWxkTUx5dno5ckplZzk1OW5DV3lUb0lQd0RiRgpqZmJiR3YrQVRpZEI5UnFodVlWS1g3ZnArQ040cTRGd0lRPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=`);
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
