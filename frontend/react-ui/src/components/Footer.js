import styles from './Footer.module.css';

const Footer = () => {
    return (
        <div className={`d-flex justify-content-center align-items-center ${styles.container}`}>
            Git Repo: <a target="_blank" rel="noreferrer" href="https://github.com/markcheng123/test">https://github.com/markcheng123/test</a>
        </div>
    );
};

export default Footer;
