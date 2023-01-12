import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Header } from "./components/header/Header";
import { PageContent } from "./components/page/PageContent";
import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { db, auth } from "./components/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";

function App() {
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const verifyLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential.user);
      showLoginPrompt();
      return false;
    } catch (error) {
      return error;
    }
  };

  const createUser = async (username, email, password) => {
    const validateUniqueUsername = await getDoc(
      doc(db, "usernames", `${username}`)
    );
    if (!validateUniqueUsername.exists()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(
          "successfully created user with id: ",
          userCredential.user.uid
        );
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
        await setDoc(doc(db, "usernames", `${username}`), {
          uid: userCredential.user.uid,
        });
        try {
          await setDoc(doc(db, "users", `${auth.currentUser.uid}`), {
            created: serverTimestamp(),
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            votes: {
              up: 1,
              down: 0,
            },
          });
          console.log("created userprofile db entry");
        } catch (error) {
          console.error("error creating user profile", error);
        }
        showLoginPrompt();
        return false;
      } catch (error) {
        return error;
      }
    } else {
      return "Username taken";
    }
  };

  const logOutUser = () => {
    signOut(auth);
  };

  const showLoginPrompt = (showSignUp = false) => {
    console.log(showSignUp);
    if (showSignUp) {
      setLoginPrompt("signup");
      console.log(showSignUp);
    } else if (!loginPrompt) {
      setLoginPrompt("login");
    } else {
      setLoginPrompt(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setIsLoggedIn(user);
        console.log("user is logged in");
      } else {
        setIsLoggedIn(false);
        console.log("user logged out");
      }
    });
  }, []);

  return (
    <div id="AppContainer">
      <BrowserRouter>
        <Header
          showLoginPrompt={showLoginPrompt}
          isLoggedIn={isLoggedIn}
          logOutUser={logOutUser}
        />
        <PageContent isLoggedIn={isLoggedIn} />
        {loginPrompt ? (
          <Login
            verifyLogin={verifyLogin}
            createUser={createUser}
            showLoginPrompt={showLoginPrompt}
            loginPrompt={loginPrompt}
          />
        ) : null}
      </BrowserRouter>
    </div>
  );
}

export default App;
