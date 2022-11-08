import { Searchbar } from "./Searchbar"
import '../../styles/header.css';
import { BrandLogo } from "./BrandLogo";
import { User } from "./User";

function Header() {
  return <div id="PageHeader">
    <BrandLogo />
    <Searchbar />
    <User />
  </div>
}

export { Header }