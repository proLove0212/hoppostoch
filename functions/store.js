import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Initialize Firebase, copied from cloud console
const firebaseConfig = {
  apiKey: "AIzaSyCMsFreESs58-hRxTtiqQrIcimh4i1wbsM",
  authDomain: "postwoman-api.firebaseapp.com",
  databaseURL: "https://postwoman-api.firebaseio.com",
  projectId: "postwoman-api",
  storageBucket: "postwoman-api.appspot.com",
  messagingSenderId: "421993993223",
  appId: "1:421993993223:web:ec0baa8ee8c02ffa1fc6a2",
  measurementId: "G-ERJ6025CEB"
};
firebase.initializeApp(firebaseConfig);

// a reference to the Feeds collection
const feedsCollection = firebase.firestore().collection("feeds");

// the shared state object that any vue component
// can get access to
export const store = {
  feedsInFeed: [],
  currentUser: {},
  writeFeed: message => {
    const dt = {
      createdOn: new Date(),
      author: store.currentUser.uid,
      author_name: store.currentUser.displayName,
      author_image: store.currentUser.photoURL,
      message
    };
    return feedsCollection
      .add(dt)
      .catch(e => console.error("error inserting", dt, e));
  },
  deleteFeed: id => {
    return feedsCollection
      .doc(id)
      .delete()
      .catch(e => console.error("error deleting", dt, e));
  }
};

// onSnapshot is executed every time the data
// in the underlying firestore collection changes
// It will get passed an array of references to
// the documents that match your query
feedsCollection
  .orderBy("createdOn", "desc")
  // .limit(0)
  .onSnapshot(feedsRef => {
    const feeds = [];
    feedsRef.forEach(doc => {
      const feed = doc.data();
      feed.id = doc.id;
      feeds.push(feed);
    });
    store.feedsInFeed = feeds;
  });

// When a user logs in or out, save that in the store
firebase.auth().onAuthStateChanged(user => {
  store.currentUser = user;
});
