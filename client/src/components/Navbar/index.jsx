import { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout, logoutEveryDevice } from "../../redux/actions";
import { AuthenticationContext } from "../../context/authenticationContext";
import { closeNotify } from "../../redux/features/notify/notifySlice";

function NavBar() {
  const dispatch = useDispatch();
  const { userIsAuthenticated } = useContext(AuthenticationContext);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className="px-2 mb-2 justify-content-between"
    >
      
      {userIsAuthenticated ? (
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">


      <Nav.Item>
        <Button
          onClick={() => {
            dispatch(closeNotify());
            dispatch(logout());
          }}
          tabIndex="3"
        >
          Log Out
        </Button>
      </Nav.Item>
    </Nav>
          </Navbar.Collapse>
        </>
      ) : (
        <Button
          as={Link}
          to="/login"
          className="text-uppercase fw-bolder"
          variant="outline-dark"
          tabIndex="1"
        >
          Sign in
        </Button>
      )}
    </Navbar>
  );
}

export default NavBar;
