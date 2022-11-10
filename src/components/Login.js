import { useState } from 'react';
import '../styles/login.css';

function Login({verifyLogin, showLoginPrompt}) {
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLogin(nameInput, passwordInput);
  }

  return <div id='LoginContainer' onClick={() => showLoginPrompt()}>
    <form className='loginForm' onSubmit={(e) => {handleSubmit(e)}} onClick={(e) => {e.stopPropagation()}}>
      <input type="text" placeholder="username" value={nameInput} onChange={(e) => {setNameInput(e.target.value)}}></input>
      <input type="password" placeholder="password" value={passwordInput} onChange={(e) => {setPasswordInput(e.target.value)}}></input>
      <button type='submit'>Login</button>
    </form>
  </div>
}

export { Login }