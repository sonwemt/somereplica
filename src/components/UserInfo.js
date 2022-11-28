import { Link } from "react-router-dom";

function UserInfo({isLoggedIn, users, logOutUser}) {
  return <div>
    <div>profile-img</div>
    <Link to={`/u/${isLoggedIn.username}`}>
      <div>{users[isLoggedIn.index].username}</div>
    </Link>
    <button onClick={() => logOutUser()}>Log out</button>
  </div>  
}

export { UserInfo };