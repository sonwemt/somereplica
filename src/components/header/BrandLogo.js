import { Link } from 'react-router-dom';
import '../../styles/brandlogo.css';

function BrandLogo() {
  return <Link to='/' id='LogoContainer'>
        <div>Logo</div>
        <div>TextLogo</div>
    </Link>
}

export { BrandLogo };