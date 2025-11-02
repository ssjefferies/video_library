import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header id="header">
            <div className="main">
                <div>Video Library</div>
            </div>
            <div className="navigation">
                <ul>
                    <li><Link to={`/`}>Search Videos</Link></li>
                    <li><Link to={`/form`}>New Video</Link></li>
                </ul>
                
            </div>
        </header>
    )
}

export default Header;