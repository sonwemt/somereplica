import { Route, Routes } from "react-router-dom";
import "../../styles/pagecontent.css";
import { Comments } from "./Comments";
import { PostOverview } from "./PostOverview";
import { SubmitPost } from "./SubmitPost";
import { PageNotFound } from "../PageNotFound";
import { UserProfile } from "./UserProfile";
import { CreateSubreplica } from "./CreateSubreplica";

function PageContent({ isLoggedIn }) {
  return (
    <div id="PageContainer">
      <Routes>
        <Route
          path="/r/:subid"
          element={<PostOverview isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/r/:subid/comments/:postid"
          element={<Comments isLoggedIn={isLoggedIn} />}
        />
        <Route path="/" element={<PostOverview isLoggedIn={isLoggedIn} />} />
        <Route
          path="/r/:subid/submitpost"
          element={<SubmitPost isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/createsubreplica"
          element={<CreateSubreplica isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/u/:userid"
          element={<UserProfile isLoggedIn={isLoggedIn} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export { PageContent };
