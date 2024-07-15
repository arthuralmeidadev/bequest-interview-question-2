import React, { useEffect, useState } from "react";
import { KJUR } from 'jsrsasign';

const API_URL = "http://localhost:8080";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo7RM10IA+G/Lugp+qnVA
XXXnwexY3Djo40YZleGARDCfTeJqZTglORG84kU3SV8w9CQRwm6Wh8IVLpkbBqwQ
XPjU56JNXNp1qwSIIzuSFB3cIp6iEHJ+ddKVlC4xtULOaY7BvekNKzhOLY1dWA3V
odOOwetn9gqu8WYcY83MPeYlaCNvQJA644kxL0ybMWnYqJugxOntB4zr8VIFKnBa
or8+pdCj12DTAHv3WxJ2wdNnvBLWXH1temK8Xzjt/0ROeJ5eQq+veHp/+0YevPv9
Pr5VIF6deZPfJQ+O7BY/SP4aTMIE3IEXLPuJAwfkcotMdOqR5mtSDCSsm9czOzzL
2wIDAQAB
-----END PUBLIC KEY-----`;

function App() {
  const [data, setData] = useState<string>();
  const [signature, setSignature] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, signature } = await response.json();
    setData(data);
    setSignature(signature);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  /* Use KJUR's crypto 'Signature' class (from jsrsasign) to verify the signature
     done with the RSA key pair using the public RSA key.
     This is a straightforward method that ensures the data received
     by the user is, in fact, not been tampered.
     
     I used the simple 'window.alert()' function to represent the integrity states
  */
  const verifyData = async () => {
    if (data && signature) {
      try {
        const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
        sig.init(PUBLIC_KEY);
        sig.updateString(data);
        const isValid = sig.verify(signature);

        window.alert(isValid ? "Valid data" : "Invalid data");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>

        {/* 
          This button is used to retrieve the original data,
          in case the integrity of the data shown to the client has been affected
        */}
        <button style={{ fontSize: "20px" }} onClick={async () => await getData()}>
          Recover Data
        </button>
      </div>
    </div>
  );
}

export default App;
