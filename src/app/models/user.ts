import firebase from 'firebase/compat/app';

export interface User extends firebase.User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  address: string;
  postcode: string;
  country: string;
}

