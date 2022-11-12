import { useState } from 'react';
import '../styles/login.css';

function Login({verifyLogin, showLoginPrompt}) {
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showInvalidInput, setShowInvalidInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(verifyLogin(nameInput, passwordInput)){
      setShowInvalidInput(false);
    } else {
      setShowInvalidInput(true);
    }
  }

  return <div id='LoginContainer' onClick={() => showLoginPrompt()}>
    <form className='loginForm' onSubmit={(e) => {handleSubmit(e)}} onClick={(e) => {e.stopPropagation()}}>
      <input type="text" placeholder="username" value={nameInput} onChange={(e) => {setNameInput(e.target.value)}} required></input>
      <input type="password" placeholder="password" value={passwordInput} onChange={(e) => {setPasswordInput(e.target.value)}} required></input>
      <div className='submitContainer'>
        {showInvalidInput ? <div>Invalid login</div> : <div></div>}
        <button type='submit'>Login</button>
      </div>
    </form>
  </div>
}

export { Login }