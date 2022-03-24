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
    createUser: 'https://us-central1-angular-fire-a31ae.cloudfunctions.net/createUser'
  }
};
