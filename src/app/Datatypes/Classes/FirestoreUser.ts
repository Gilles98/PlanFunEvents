import IfirestoreUser from '../Interface/IfirestoreUser';

export default class FirestoreUser implements IfirestoreUser{
  displayName: string;
  email: string;
  uid: string;
  photoURL?: string;
}
