function UserInfo({isLoggedIn, users, logOutUser}) {
  return <div>
    <div>profile-img</div>
    <div>{users[isLoggedIn.index].username}</div>
    <button onClick={() => logOutUser()}>Log out</button>
  </div>  
}

export { UserInfo };