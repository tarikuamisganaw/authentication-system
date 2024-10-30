import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions";

function Login() {
  const dispatch = useDispatch();
  const loginLoading = useSelector(({ auth }) => auth.user_loading);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email address is invalid").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, actions) => {
      function alterFormToAPIResult(error) {
        if (error) {
          actions.setFieldTouched("password", false);
          actions.setFieldValue("password", "");
        }
      }
      dispatch(login(values, alterFormToAPIResult));
    },
  });

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", marginTop: "50px" }}>
      <div className="border rounded p-4 shadow">
        <h2 className="text-uppercase mb-3 text-center">Login to your account</h2>
        <Form onSubmit={formik.handleSubmit}>
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
              tabIndex={1}
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
              tabIndex={2}
            />
            {formik.touched.password && formik.errors.password && (
              <Form.Text className="text-danger">{formik.errors.password}</Form.Text>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="text-uppercase w-100" disabled={loginLoading} tabIndex={3}>
            {loginLoading ? "Loading..." : "Submit"}
          </Button>

          <p className="text-muted mt-2">
            Don't have an account yet? <Link to="/signup">Sign Up here</Link>
          </p>

          <Link to="/recoverpass" className="text-primary">Forgot password?</Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;