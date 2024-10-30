import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="px-3 mb-3 shadow">
      <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
        Authentiction App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Button
          as={Link}
          to="/login"
          className="text-uppercase fw-bolder ms-auto"
          variant="outline-dark"
          tabIndex="1"
        >
          Home
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;