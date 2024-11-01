import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signup } from "../redux/actions";

function Signup() {
  const dispatch = useDispatch();
  const signupLoading = useSelector((state) => state.auth.user_loading);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
      lastName: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(4, "Must be 4 characters or more").required("Password is required"),
      passwordConfirm: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      dispatch(signup(values));
    },
  });

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", marginTop: "50px" }}>
      <div className="border rounded p-4 shadow">
        <h2 className="text-uppercase mb-3 text-center">Create account</h2>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              id="firstName"
              name="firstName"
              type="text"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter first name"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <Form.Text className="text-danger">{formik.errors.firstName}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              id="lastName"
              name="lastName"
              type="text"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter last name"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <Form.Text className="text-danger">{formik.errors.lastName}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Email"
            />
            {formik.touched.email && formik.errors.email && (
              <Form.Text className="text-danger">{formik.errors.email}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Password"
            />
            {formik.touched.password && formik.errors.password && (
              <Form.Text className="text-danger">{formik.errors.password}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm Password"
            />
            {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
              <Form.Text className="text-danger">{formik.errors.passwordConfirm}</Form.Text>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" disabled={signupLoading} className="w-100">
            {signupLoading ? "Loading..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Signup;