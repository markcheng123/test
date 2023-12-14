import styles from './Header.module.css';
import logo from "../logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className={styles.container}>
            <div className="container-md d-flex justify-content-between align-items-center">
                <Link to="/" className="d-flex align-items-center">
                    <img src={logo} className={styles.logo} alt="logo" />
                    <span className={`text-nowrap ${styles.name}`}>Demo Shop</span>
                </Link>
                <ul className={`d-flex ${styles.nav}`}>
                    <li className="text-nowrap">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="text-nowrap">
                        <Link to="/product/new">New Product</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
