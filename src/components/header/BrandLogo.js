import { useNavigate } from "react-router-dom";
import "../../styles/brandlogo.css";

function BrandLogo() {
  const navigate = useNavigate();

  const returnToFrontpage = () => {
    navigate("/");
    navigate(0);
  };

  return (
    <div id="LogoContainer" onClick={returnToFrontpage}>
      <div>Logo</div>
      <div>TextLogo</div>
    </div>
  );
}

export { BrandLogo };
