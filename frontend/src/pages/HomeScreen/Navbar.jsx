import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import menuIcon from "../../assets/menu.png";

export default function Navbar({ links = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (link) => {
    if (link.onClick) {
      link.onClick();
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo-box">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        <nav className="nav-links">
          {links.map((link, index) =>
            link.onClick ? (
              <span
                key={index}
                className="nav-link"
                role="button"
                tabIndex={0}
                onClick={() => handleClick(link)}
                onKeyDown={(e) => e.key === "Enter" && handleClick(link)}
              >
                {link.label}
              </span>
            ) : link.href.startsWith("#") ? (
              <a key={index} href={link.href} className="nav-link">
                {link.label}
              </a>
            ) : (
              <Link key={index} to={link.href} className="nav-link">
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img src={menuIcon} alt="Menu" />
        </div>
      </div>

      {isMenuOpen && (
        <div className="dropdown-menu">
          {links.map((link, index) =>
            link.onClick ? (
              <span
                key={index}
                className="dropdown-link"
                role="button"
                tabIndex={0}
                onClick={() => handleClick(link)}
                onKeyDown={(e) => e.key === "Enter" && handleClick(link)}
              >
                {link.label}
              </span>
            ) : link.href.startsWith("#") ? (
              <a key={index} href={link.href} className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={index} to={link.href} className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
