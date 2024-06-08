export const environment = {
  production: false,
  stripePublicKey:
    'pk_test_51PKzdxCTuoqkDui13OcDk531ekNEHfGGuwuxIXX58UcmCxOF8o5bMl1DuFEMSm1PPXrlNTK3kYpcgaGTGd31l8iW003XwHPaER', // Replace with your actual Stripe public key
  useEmulators: false,
  firebase: {
    apiKey: 'AIzaSyD1JWXSFtIKr4X0shgaptYlEVzqYkBRoGI',
    authDomain: 'soundlibrarystore.firebaseapp.com',
    projectId: 'soundlibrarystore',
    storageBucket: 'soundlibrarystore.appspot.com',
    messagingSenderId: '287653757919',
    appId: '1:287653757919:web:d0bea9d6efb0d9ba4e3a6a',
  },
  api: {
    createUser:
      'http://localhost:5001/fir-course-recording-c7f3e/us-central1/createUser',
  },
};
