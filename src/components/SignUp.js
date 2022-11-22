import { useState } from "react"

function SignUp({showSignUpPrompt, addUser}) {
  const [showInvalidInput, setShowInvalidInput] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(addUser(nameInput, passwordInput)) {
      setShowInvalidInput(false);
    } else {
      setShowInvalidInput(true);
    }
  }

  return <div id='SignUpContainer' onClick={() => showSignUpPrompt()}>
    <form className='sign-up-form' onSubmit={(e) => {handleSubmit(e)}} onClick={(e) => {e.stopPropagation()}}>
      <input type="text" placeholder="username" value={nameInput} onChange={(e) => {setNameInput(e.target.value)}}></input>
      <input type="password" placeholder="password" value={passwordInput} onChange={(e) => {setPasswordInput(e.target.value)}}></input>
      <div className='submitContainer'>
        {showInvalidInput ? <div>Invalid username</div> : <div></div>}
        <button type='submit'>Login</button>
      </div>
    </form>
  </div>
}

export { SignUp };