import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation(); // Hook to get the current route

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
          <span className="sidebar-brand-text">tabernam.</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <i className="fas fa-times" size={24}></i>
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/"
                className={`menu-link ${location.pathname === "/" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-home"></i>
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/titledes"
                className={`menu-link ${location.pathname === "/titledes" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-pen"></i>
                </span>
                <span className="menu-link-text">Title & Description</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/summarizer"
                className={`menu-link ${location.pathname === "/summarizer" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-file-alt"></i>
                </span>
                <span className="menu-link-text">Summarizer</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/timestamp"
                className={`menu-link ${location.pathname === "/timestamp" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-clock"></i>
                </span>
                <span className="menu-link-text">Timestamp</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/chatbot"
                className={`menu-link ${location.pathname === "/chatbot" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-comments"></i>
                </span>
                <span className="menu-link-text">ChatBot</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/commentfilter"
                className={`menu-link ${location.pathname === "/commentfilter" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-filter"></i>
                </span>
                <span className="menu-link-text">Comment Filter</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/logout"
                className={`menu-link ${location.pathname === "/logout" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span className="menu-link-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
