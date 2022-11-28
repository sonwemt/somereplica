import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Header } from './components/header/Header';
import { PageContent } from './components/page/PageContent';
import { useState } from 'react';
import { Login } from './components/Login';
//import db from './components/firebase';


function App() {
  const [users, setUsers] = useState([
    {
      username: 'user1',
      password: 'hunter1',
      index: 0,
    },
    {
      username: 'user2',
      password: 'hunter2',
      index: 1,
    },
    {
      username: 'user3',
      password: 'hunter3',
      index: 2,
    },
  ]);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const addUser = (username, password) => {
    let arrayCopy = users.slice();
    arrayCopy.push({username, password})
    setUsers(arrayCopy);
  }

  const verifyLogin = (nameInput, password) => {
      const findUser = users.find((user) => {
       return user.username === nameInput
      });
      if(findUser && findUser.password === password){
        setIsLoggedIn({username:findUser.username, index: findUser.index});
        setLoginPrompt(false);
        return true;
      }
      return false;
  }

  const logOutUser = () => {
    setIsLoggedIn(false);
  }

  const showLoginPrompt = () => {
    if(loginPrompt) {
      setLoginPrompt(false);
    } else {
      setLoginPrompt(true);
    }
  }

  return (
    <div id="AppContainer">
      <BrowserRouter>
        <Header showLoginPrompt={showLoginPrompt} isLoggedIn={isLoggedIn} users={users} logOutUser={logOutUser}/>
        <PageContent isLoggedIn={isLoggedIn}/>
        {
        loginPrompt ?
        <Login verifyLogin={verifyLogin} showLoginPrompt={showLoginPrompt} addUser={addUser}/> : null
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
