import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions";
import Button from "react-bootstrap/Button";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", marginTop: "50px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ marginBottom: "20px" }}>Your Profile</h2>
        <Button variant="outline-danger" onClick={() => dispatch(logout())}>
          Log Out
        </Button>
      </div>
      <div className="border rounded p-4 shadow" style={{ paddingBottom: "20px" }}>
        <h4>Details of user:</h4>
        <ul className="list-unstyled">
          <li><b>First Name: </b>{user?.firstName}</li>
          <li><b>Last Name: </b>{user?.lastName}</li>
          <li><b>Email: </b>{user?.email}</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;