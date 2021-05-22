import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
<link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'></link>
firebase.initializeApp({
  apiKey: "AIzaSyBTB3gJaHk-oIz2Y9b3EYg5sBfTowcDK6Q",
    authDomain: "chat-d1d93.firebaseapp.com",
    projectId: "chat-d1d93",
    storageBucket: "chat-d1d93.appspot.com",
    messagingSenderId: "748509134091",
    appId: "1:748509134091:web:c7b5ee6d86623dddee360e",
    measurementId: "G-H5E1ZZDBR1"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>💬PZPK CHAT💬

</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button class="out" onClick={() => auth.signOut()}>🚀Sign Out🚀</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const[fromValue, setFromValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const {uid,photoURL} = auth.currentUser;

    await messagesRef.add({
      text :fromValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFromValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'});
  }


  return (
  <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input value={fromValue} onChange ={(e) => setFromValue(e.target.value)} />

      <button type="submit">Wyśli!🕊️</button>

    </form>

  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;