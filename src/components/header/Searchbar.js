import searchIcon from "../../content/search.png";
import "../../styles/searchbar.css";

function Searchbar() {
  return (
    <div className="searchbar">
      <img src={searchIcon} alt="searchicon" className="searchIcon"></img>
      <input className="searchInput" placeholder="Search"></input>
    </div>
  );
}

export { Searchbar };
