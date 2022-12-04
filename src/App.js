import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Header } from './components/header/Header';
import { PageContent } from './components/page/PageContent';
import { useState } from 'react';
import { Login } from './components/Login';
import { db, auth } from './components/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut, 
  updateProfile
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

function App() {
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const verifyLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      showLoginPrompt();
      return false;
    } catch(error) {
      return error;
    }
  }

  const createUser = async (username, email, password) => {
    const checkUsernameAvailability = await getDoc(doc(db, 'users', `${username}`));
    if(!checkUsernameAvailability.exists()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
          displayName: username,
        })
        setIsLoggedIn(userCredential.user)
        try {
          await setDoc(doc(db, 'users', `${auth.currentUser.displayName}`), {
            created: 'now',
            uid: auth.currentUser.uid,
            votes: {
              up: 1,
              down: 0,
            }
          })
          console.log('created userprofile')
        } catch(error) {
          console.error('error creating user profile', error);
        }
        showLoginPrompt();
        return false;
      } catch(error) {
        return error;
      }
    } else {
      return 'usernameTaken';
    }
    
  }

  const logOutUser = () => {
    signOut(auth);
  }

  const showLoginPrompt = (showSignUp = false) => {
    console.log(showSignUp);
    if(showSignUp) {
      setLoginPrompt('signup');
      console.log(showSignUp);
    } else if(!loginPrompt) {
      setLoginPrompt('login');
    } else {
      setLoginPrompt(false);
    }
  }

  useState(() => {
    onAuthStateChanged(auth, user => {
      if(user !== null) {
        setIsLoggedIn(user);
        console.log('user is logged in');
      } else {
        setIsLoggedIn(false);
        console.log('user logged out');
      }
    })
  }, [auth])

  return (
    <div id="AppContainer">
      <BrowserRouter>
        <Header showLoginPrompt={showLoginPrompt} isLoggedIn={isLoggedIn} logOutUser={logOutUser}/>
        <PageContent isLoggedIn={isLoggedIn}/>
        {
        loginPrompt ?
        <Login verifyLogin={verifyLogin} createUser={createUser} showLoginPrompt={showLoginPrompt} loginPrompt={loginPrompt}/> : null
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
