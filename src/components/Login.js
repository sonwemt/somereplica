import { AuthErrorCodes } from "firebase/auth";
import { useEffect, useState } from "react";
import "../styles/login.css";

function Login({ verifyLogin, createUser, showLoginPrompt, loginPrompt }) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showInvalidInput, setShowInvalidInput] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginReturn = await verifyLogin(emailInput, passwordInput);
    console.log(loginReturn);
    if (!loginReturn) {
      setShowInvalidInput(false);
    } else {
      if (loginReturn.code === AuthErrorCodes.INVALID_PASSWORD) {
        setShowInvalidInput("Wrong password");
      } else {
        setShowInvalidInput(`${loginReturn.code}`);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (usernameInput === "") {
      setShowInvalidInput(() => "enter a valid username");
      return;
    }
    const signUpReturn = await createUser(
      usernameInput,
      emailInput,
      passwordInput
    );
    console.log(signUpReturn);
    if (!signUpReturn) {
      setShowInvalidInput(false);
    } else {
      if (signUpReturn === "Username taken") {
        setShowInvalidInput("Username taken");
      } else if (signUpReturn.code === AuthErrorCodes.INVALID_PASSWORD) {
        setShowInvalidInput("Wrong password");
      } else {
        setShowInvalidInput(`${signUpReturn.code}`);
      }
    }
  };

  useEffect(() => {
    if (loginPrompt === "login") {
      setShowUsernameInput(false);
    } else if (loginPrompt === "signup") {
      setShowUsernameInput(true);
    }
  }, [loginPrompt]);

  return (
    <div id="LoginContainer" onClick={() => showLoginPrompt()}>
      <form
        className="loginForm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {showUsernameInput ? (
          <input
            type="text"
            placeholder="username"
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
            required
          ></input>
        ) : null}
        <input
          type="text"
          placeholder="email"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
          }}
          required
        ></input>
        <input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={(e) => {
            setPasswordInput(e.target.value);
          }}
          required
        ></input>
        <div className="submitContainer">
          <div>{showInvalidInput}</div>
          {!showUsernameInput ? (
            <>
              <button
                type="submit"
                onClick={(e) => {
                  handleLogin(e);
                }}
              >
                Login
              </button>
              <button
                type="submit"
                onClick={() => {
                  setShowUsernameInput(true);
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                onClick={(e) => {
                  handleSignUp(e);
                }}
              >
                Sign up
              </button>
              <button
                type="submit"
                onClick={() => {
                  setShowUsernameInput(false);
                }}
              >
                Log in instead
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export { Login };
