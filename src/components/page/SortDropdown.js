import { useState } from "react";
import '../../styles/sortdropdown.css'

function SortDropdown({ setSortFilter }) {
  const [showOptions, setShowOptions] = useState(false);

  const handleSortChange = (score, order) => {
    setSortFilter(() => ({score, order}))
  }
 
  return(
    <div className="sort-dropdown">
      <button className="show-sort-options" onClick={() => setShowOptions(showOptions ? false : true)}>sort</button>
      {
      showOptions ? 
      <div className="sort-options">
        <button className="sort-by-new" onClick={() => handleSortChange(false ,'desc')}>new</button>
        <button className="sort-by-old" onClick={() => handleSortChange(false, 'asc')}>old</button>
        <button className="sort-by-upvotes" onClick={() => handleSortChange(true, 'desc')}>highest score</button>
        <button className="sort-by-downvotes" onClick={() => handleSortChange(true, 'asc')}>lowest score</button>
      </div>:
      null
      }
    </div>
  );
}

export { SortDropdown };