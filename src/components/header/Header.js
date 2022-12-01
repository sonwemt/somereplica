import { Searchbar } from "./Searchbar"
import '../../styles/header.css';
import { BrandLogo } from "./BrandLogo";
import { User } from "./User";

function Header({showLoginPrompt, isLoggedIn,logOutUser}) {
  return <div id="PageHeader">
    <BrandLogo />
    <Searchbar />
    <User showLoginPrompt={showLoginPrompt} isLoggedIn={isLoggedIn} logOutUser={logOutUser}/>
  </div>
}

export { Header }