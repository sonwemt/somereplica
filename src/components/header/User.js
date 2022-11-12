import '../../styles/user.css';
import { UserInfo } from '../UserInfo';

function User({showLoginPrompt, isLoggedIn, logOutUser, users}) {
  return <div className="userContainer">
    {isLoggedIn ? 
    <>
      <UserInfo isLoggedIn={isLoggedIn} users={users} logOutUser={logOutUser}/>
    </> :
    <>
      <button className='signup-button'>Sign Up</button>
      <button className='login-button' onClick={() => showLoginPrompt()}>Log In</button>
      <div className='profile-picture'>ProfImg</div>
    </>
    }
  </div>
}

export { User };