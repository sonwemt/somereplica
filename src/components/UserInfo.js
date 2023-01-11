import { Link } from "react-router-dom";

function UserInfo({ isLoggedIn, logOutUser }) {
  return (
    <div>
      <div>profile-img</div>
      <Link to={`/u/${isLoggedIn.displayName}`}>
        <div>{isLoggedIn.displayName}</div>
      </Link>
      <button onClick={() => logOutUser()}>Log out</button>
    </div>
  );
}

export { UserInfo };
