import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

function PageNotFound() {
  const [matchParams, setMatchParams] = useState(false);
  const { params } = useParams();

  useEffect(() => {
    if(params !== 'page-does-not-exist') {
      setMatchParams(true);
    }
  },[matchParams, setMatchParams, params])

  return <div>{
    !matchParams ?
    <Navigate to='/page-does-not-exist'/> :
    <div>Page does not exist</div>
    }
  </div>
}

export { PageNotFound };