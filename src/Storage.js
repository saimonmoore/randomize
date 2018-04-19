import * as firebase from "firebase";
import to from './to.js';

class Storage {
  constructor() {
    this.initRemoteStorage();
  }

  initRemoteStorage() {
    if (!firebase.apps.length) {
      firebase.initializeApp(this.config());
    }
  }

  config() {
    return {
      apiKey: "AIzaSyDh3-3zNRqzGCJnpAjUfLtaYK49e8PYaOE",
      authDomain: "randomize-a170d.firebaseapp.com",
      databaseURL: "https://randomize-a170d.firebaseio.com",
      projectId: "randomize-a170d",
      storageBucket: "randomize-a170d.appspot.com",
      messagingSenderId: "1087089717683"
    };
  }

  storage() {
    return firebase.database();
  }

  setItem(session_name, session) {
    this.storage().ref(`randomizations/${session_name}`).set(session);
  }

  destroyItem(session_name) {
    this.storage().ref(`randomizations/${session_name}`).set(null);
  }

  async getItem(session_name, fn) {
    let items = null;
    let popped_items = [];
    let paddingLength = 0;
    let snapshot;
    let error;

    const ref = this.storage().ref(`randomizations/${session_name}`);
    [error, snapshot] = await to(ref.once('value'));
    if (error) return fn(error, null);

    const response = Object.assign({}, snapshot.val());
    items = response.items || [];
    popped_items = response.popped_items || [];
    paddingLength = response.paddingLength || 0;

    fn(null, {items, popped_items, paddingLength});
  }
}

export default Storage;
