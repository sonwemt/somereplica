import '../../styles/user.css';

function User() {
  return <div className="userContainer">
    <button className='signup-button'>Sign Up</button>
    <button className='login-button'>Log In</button>
    <div className='profile-picture'>ProfImg</div>
  </div>
}

export { User };