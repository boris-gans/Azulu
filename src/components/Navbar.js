import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.navbarLogo}>
          <Link to="/">
            <img src="/assets/icons/logoWhite.svg" alt="Azulu" className={styles.logo} />
          </Link>
        </div>
        <ul className={styles.leftNavLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div className={styles.rightSection}>
        <ul className={styles.rightNavLinks}>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar; 