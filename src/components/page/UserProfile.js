import { Navigate } from "react-router-dom";

function UserProfile({user}) {
  return <div>
    {
      user ? <div>{user.username}</div>: <Navigate to='/' />
    }
  </div>
}

export { UserProfile };