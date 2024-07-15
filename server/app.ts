import express from "express";
import cors from "cors";
import { createSign } from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };
const rsaPrivateKey = process.env.RSA_PRIVATE_KEY!;

type SignedData = string;

/* This function creates the signature that is used by the client
   to ensure data integrity using the function 'createSign' from the crypto standard module
*/
function signData(data: string): SignedData {
  const sign = createSign("SHA256");
  sign.update(data);
  sign.end();

  return sign.sign(rsaPrivateKey, "hex");
}

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  /*
    Now there's also a signature for the data in the payload
  */
  res.json({
    data: database.data,
    signature: signData(database.data),
  });
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
