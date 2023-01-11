import {
  collection,
  query,
  where,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";

function CreateSubreplica({ isLoggedIn }) {
  const navigate = useNavigate();
  const [subreplica, setSubreplica] = useState("");
  const [FormMesssage, setFormMessage] = useState(false);

  const validateAndCreateSubreplica = async (e) => {
    e.preventDefault();
    if (containsWhitespace()) {
      setFormMessage("Name cannot contain whitespaces");
      return;
    }
    const subsRef = collection(db, "subreplicas");
    const subQuery = query(
      subsRef,
      where("subreplicaName", "==", `${subreplica}`)
    );
    const subCount = await getCountFromServer(subQuery);
    if (subCount.data().count < 1) {
      try {
        const newSubreplica = await addDoc(subsRef, {
          creator: isLoggedIn.displayName,
          uid: isLoggedIn.uid,
          subreplicaName: subreplica,
          created: serverTimestamp(),
        });
        console.log("doc created with id: ", newSubreplica.id);
        navigate(`/r/${subreplica}/`, { replace: true });
        setFormMessage("success");
      } catch (error) {
        console.log(error);
      }
    } else {
      setFormMessage("subreplica already exists");
    }
  };

  const containsWhitespace = () => {
    if (/^\S{2,}$/.test(subreplica)) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="createSubContainer" style={{ padding: "1rem" }}>
      <form onSubmit={(e) => validateAndCreateSubreplica(e)}>
        <input
          type="text"
          placeholder="Subreplica name"
          value={subreplica}
          onChange={(e) => {
            setSubreplica(e.target.value);
          }}
          disabled={!isLoggedIn}
          maxLength="40"
          minLength="2"
        />
        <button type="submit">Submit</button>
        <div>{FormMesssage}</div>
      </form>
    </div>
  );
}

export { CreateSubreplica };
