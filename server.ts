import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// استيراد Firebase Admin SDK بطريقة Deno
import { initializeApp } from "https://esm.sh/firebase-admin@11.11.0?deno-std=0.177.0";
import { getFirestore } from "https://esm.sh/firebase-admin@11.11.0/firestore?deno-std=0.177.0";

const serviceAccount = {
  "type": "service_account",
  "project_id": "al-jawhara-bank",
  "private_key_id": "6ed9df43fdec7254aa5a19c2c1d2736740532002",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDaMoGtNBOTI2je
yj5uMm4ya0XIZfGgqWULUiJ0lmDQaIkp//txX/AkGA/kl7fkp/HA7B828hTQR/k9
6Xst+1OpSx9SEuyPgtn/XQcoLMTc/4KBvlCE8vLGS7d/b3rIXiFlBA3o4gNaofqv
BORzvI8utsoC9Dnp7rapn+lj6mrkRgieMwhSuHdADRB5FgsdJO8af9ToUNaYaACB
58jHHJJ7NNZiDzH2c402diMf2/A+7FhtXfr6pS36/EGtozDd7d8LscOab2Z3wXpu
YmgWoPOVrp+a2WTlgXrQBUeeHKSBhqCMma707JjhiNr9pJeGWWc8rSQXMIdIU/JG
1BtsIGxvAgMBAAECggEAXk8/QoREQ7Al50nmEw5EGBHKrzP07Lra3DpLfzXyMZJF
Wvx0C0xqyMcHs4eqKbA3a2oDkeWvfljlj0+H+NdtETrRllFsoxjtLZVhfwleq6Da
oUaHmfdCXNgkP3YJTWp2J6nJc1OhHH7vkc9dCPNCte+2v/EcyRJvLEDciV2shu47
+8wefcpwB/if73mt/FRndmCucX92YRXeurPyY849OAo23jvFwMwoZmd1UFy+nEp+
x4olgtHheDU6VBv254A0tTkEoCsW31e6ZNH84Mt+GNE8+4ee2Ea8lSikwDHdVZ++
Ik63yr37e7nT/I/q3JICesRxdvO60rR3/fC55mBdRQKBgQDwXG2PLk6G58Qjb5bF
MwmY/P6A6ql61L0sKP0G5UoLunZi4xywHcjI8n3koFTJKHjFusisA24NqKWhiAzy
G2IT/dvSAGqXpG4IlcRF6ybFYb8ybX91BxQpoCz8RcFxecJBOnuDlnC+EQkD31U9
6RTWPJIfo5Ln/JyS/n/BWF2ktQKBgQDoZOh8fc8C08tJrekNdRFmzOc2suIP/mP7
XIfJgek4IP5fwQYE7NyyaVKnLktIwIEOanAQh9V/D4gWW8OPFdftcBEF6WNxhfI5
+d9GF1tDpogrrh7utV55b6yuJz7d2QUh7uta9fVbZdKfJCrH1eE2ZbEkK2ngLk9r
4Ig6eONHEwKBgQCQoGzj/I8PqaFhWSG1YrJhtclFtO1plVyGl9s4LPtS902IzvNS
HXnVP+P0j2y05X9WKr/YkO/FlDalbYGspEFtmhCM2edJe40h6UwCbi4UEm7DXxOU
TUAak+C9oxN0vjjemtv7H6iTFRkBlX5rFDaPej7KfthEcsGbyTsCEbO3CQKBgQC/
YKocKzbY6zWT/YXYsTmdYMxfvTxxU1te2rpv9W3r7S/OBxU/5RdyTU3lozgYN3+Q
MZML6fClbFLzpqoLIT/qpsk+Bw7/pADwQZffDsj3kyK8Ze3PQskEVDTuTh91bozN
fwWOqNJfbCDhMVWRr86Bj4krch0Eot6Axi0pifgQxQKBgQCxoAfebR+6e3MbfN/J
hizBsaeAOf1ByeMlTV62hbanGJu5dvythHLIqitJaS7lAs7Q4eZJVrNNPcCfUP7r
Fdl01UWiYjHzjt+qEjnv0Siwr08iWgE57JS+e2xucn+ZzYn1861rDxu5Y88s3Ix9
LorOkSdME2HFzSzMH9JlKmur4Q==
-----END PRIVATE KEY-----\n`,
  "client_email": "firebase-adminsdk-fbsvc@al-jawhara-bank.iam.gserviceaccount.com",
  "client_id": "108740219167135564070",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40al-jawhara-bank.iam.gserviceaccount.com"
};

// تهيئة Firebase
const app = initializeApp({
  credential: {
    getAccessToken: () => Promise.resolve({
      access_token: "mock",
      expires_in: 3600
    })
  }
});

// استخدام Firestore
const db = getFirestore(app);

// تشغيل الخادم
const server = new Application();
const router = new Router();

router.get("/reservations/:service", async (ctx) => {
  const servicePath = ctx.params.service;
  
  try {
    const serviceRef = db
      .collection('Al-Jawhara Bank')
      .doc('Al-Jawhara Bank DATABASE')
      .collection('Reservations')
      .doc(servicePath);
    
    const collections = await serviceRef.listCollections();
    const reservations = [];
    
    for (const userColl of collections) {
      const snapshot = await userColl.get();
      snapshot.forEach(doc => {
        reservations.push({ id: doc.id, username: userColl.id, ...doc.data() });
      });
    }
    
    ctx.response.body = { success: true, reservations };
  } catch (error) {
    ctx.response.body = { success: false, error: error.message };
  }
});

router.get("/", (ctx) => {
  ctx.response.body = "AJB API Running";
});

server.use(router.routes());
server.use(router.allowedMethods());

await server.listen({ port: 8000 });
