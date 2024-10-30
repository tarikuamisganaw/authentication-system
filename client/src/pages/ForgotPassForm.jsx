import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions";

function ForgotPass() {
  const dispatch = useDispatch();
  const { user_loading: loginLoading } = useSelector(({ auth }) => auth);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email address is invalid").required("Email is required"),
    }),
    onSubmit: (values) => {
      dispatch(forgotPassword(values));
      
    },
  });

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", marginTop: "50px" }}>
      <div className="border rounded p-4 shadow">
        <h2 className="text-uppercase mb-3 text-center">Forgot your password?</h2>
        <h4 className="lead text-center">We've got you covered.</h4>
        <p className="text-muted text-center">Confirm your email and we'll send instructions.</p>

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

          <Button variant="primary" type="submit" className="text-uppercase w-100" disabled={loginLoading} tabIndex={3}>
            {loginLoading ? "Loading..." : "Confirm"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPass;