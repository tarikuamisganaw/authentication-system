import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../redux/actions";

function ResetPass() {
  const { resetToken } = useParams();
  const dispatch = useDispatch();
  const resetLoading = useSelector((state) => state.auth.user_loading);

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(4, "Must be 4 characters or more").required("Password is required"),
      passwordConfirm: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      values.resetToken = resetToken;
      dispatch(resetPassword(values));
    },
  });

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto", marginTop: "50px" }}>
      <div className="border rounded p-4 shadow">
        <h2 className="text-uppercase mb-3 text-center">Change your password</h2>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter new Password"
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

          <Button variant="primary" type="submit" disabled={resetLoading} className="w-100">
            {resetLoading ? "Loading..." : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ResetPass;