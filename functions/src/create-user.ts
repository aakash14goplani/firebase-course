import { getUsersCredentialMiddleware } from './auth.middleware';
import { auth, db } from './init';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

export const createUserApp = express();

createUserApp.use(bodyParser.json());
createUserApp.use(cors({ origin: true }));
createUserApp.use(getUsersCredentialMiddleware);

createUserApp.post('/', async (req, res) => {
  try {
    if (req.uid && req.admin) {
      const { email, password, admin } = req.body;

      const user = await auth.createUser({
        email,
        password
      });

      await auth.setCustomUserClaims(user.uid, { admin });

      db.doc(`users/${user.uid}`).set({});

      res.status(200).json({ message: `User created successfully` });
    } else {
      res.status(403).json({ message: 'Forbidden: Denied access to user creation service.' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: `Could not create user ${error}` });
  }
});
