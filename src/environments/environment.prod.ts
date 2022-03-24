import secretKey from './secrets';

export const environment = {
  production: true,
  useEmulators: false,
  firebase: {
    apiKey: secretKey.firebase,
    authDomain: secretKey.firebaseAuthDomain,
    projectId: secretKey.firebaseProjectId,
    storageBucket: secretKey.firebaseStorageBucket,
    messagingSenderId: secretKey.firebaseMessagingSenderId,
    appId: secretKey.firebaseAppId
  },
  api: {
    createUser: 'http://localhost:5001/angular-fire-a31ae/us-central1/createUser'
  }
};
