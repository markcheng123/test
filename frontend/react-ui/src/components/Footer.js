import styles from './Footer.module.css';

const Footer = () => {
    return (
        <div className={` ${styles.container}`}>
            <div className="container-md d-flex justify-content-center align-items-center">
                Git Repo: <a target="_blank" rel="noreferrer" href="https://github.com/markcheng123/test">
                https://github.com/markcheng123/test</a>
            </div>
        </div>
    );
};

export default Footer;
