import { Searchbar } from "./Searchbar"
import '../../styles/header.css';
import { BrandLogo } from "./BrandLogo";
import { User } from "./User";

function Header({showLoginPrompt}) {
  return <div id="PageHeader">
    <BrandLogo />
    <Searchbar />
    <User showLoginPrompt={showLoginPrompt}/>
  </div>
}

export { Header }