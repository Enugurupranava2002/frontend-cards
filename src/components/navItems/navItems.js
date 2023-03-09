import { NavLink } from "react-router-dom";

const NavItems = (props) => {
  return (
    <ul className="nav-items">
      {!props.isAuth && (
        <li key={"login"} className="nav-items__item">
          <NavLink to={"/"} exact onClick={props.onChoose}>
            {"Login"}
          </NavLink>
        </li>
      )}

      {!props.isAuth && (
        <li key={"signup"} className="nav-items__item">
          <NavLink to={"/signup"} exact onClick={props.onChoose}>
            {"Signup"}
          </NavLink>
        </li>
      )}

      {props.isAuth && (
        <li className="nav-items__item" key="homeItem">
          <NavLink to={"/postLoginPage"} exact onClick={props.onChoose}>
            {"Home"}
          </NavLink>
        </li>
      )}

      {props.isAuth && (
        <li className="nav-items__item" key="addItem">
          <NavLink to={"/addItem"} exact onClick={props.onChoose}>
            {"Add Card"}
          </NavLink>
        </li>
      )}

      {props.isAuth && (
        <li className="nav-items__item" key="history">
          <NavLink to={"/history"} exact onClick={props.onChoose}>
            {"History"}
          </NavLink>
        </li>
      )}

      {props.isAuth && (
        <li className="nav-items__item" key="logout">
          <button onClick={props.onLogout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavItems;
