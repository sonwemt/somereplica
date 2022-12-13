import { useState } from "react";
import '../../styles/sortdropdown.css'

function SortDropdown({ setSortOrder }) {
  const [showOptions, setShowOptions] = useState(false);
  return(
    <div className="sort-dropdown">
      <button className="show-sort-options" onClick={() => setShowOptions(showOptions ? false : true)}>sort</button>
      {
      showOptions ? 
      <div className="sort-options">
        <button className="sort-by-new" onClick={() => setSortOrder('desc')}>new</button>
        <button className="sort-by-old" onClick={() => setSortOrder('asc')}>old</button>
      </div>:
      null
      }
    </div>
  );
}

export { SortDropdown };