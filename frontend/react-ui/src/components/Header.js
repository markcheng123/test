import styles from './Header.module.css';
import logo from "../logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className={`d-flex justify-content-between align-items-center ${styles.container}`}>
            <Link to="/" className="d-flex align-items-center">
                <img src={logo} className={styles.logo} alt="logo" />
                <span className={styles.name}>Demo Shop</span>
            </Link>
            <div>
                <ul className={`d-flex ${styles.nav}`}>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/product/new">New Product</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
