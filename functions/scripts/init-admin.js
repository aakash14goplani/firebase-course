const admin = require('firebase-admin');

const serviceAccountPath = process.argv[2];
const userId = process.argv[3];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

async function initAdmin(adminUid) {
  await admin.auth().setCustomUserClaims(adminUid, { admin: true });
}

initAdmin(userId)
  .then(() => {
    process.exit();
  })
  .catch(console.error);
