import "../../styles/user.css";
import { UserInfo } from "../UserInfo";

function User({ showLoginPrompt, isLoggedIn, logOutUser }) {
  return (
    <div className="userContainer">
      {isLoggedIn ? (
        <>
          <UserInfo isLoggedIn={isLoggedIn} logOutUser={logOutUser} />
        </>
      ) : (
        <>
          <button
            className="signup-button"
            onClick={() => showLoginPrompt(true)}
          >
            Sign Up
          </button>
          <button className="login-button" onClick={() => showLoginPrompt()}>
            Log In
          </button>
          <div className="profile-picture">ProfImg</div>
        </>
      )}
    </div>
  );
}

export { User };
