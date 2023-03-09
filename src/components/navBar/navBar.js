import "../../dist/css/main.css";

import NavItems from "../navItems/navItems";

const NavBar = (props) => {
  return (
    <div className="navbar">
      <div className="spacer"></div>
      <NavItems onLogout={props.onLogout} isAuth={props.isAuth} />
    </div>
  );
};

export default NavBar;
