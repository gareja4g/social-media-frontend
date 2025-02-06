import { useDispatch } from "react-redux";
import "../styles/auth.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import AuthLogo from "../components/Auth/AuthLogo";
import AuthLeftContent from "../components/Auth/AuthLeftContent";
import { toast } from "react-toastify";
import { request } from "../utils/api";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await request("/login", data, "POST", null);
      dispatch(login({ token: result.data.token, user: result.data.user }));
      toast.success(result.message || "Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="row ht-100v flex-row-reverse no-gutters">
      <div className="col-md-6 d-flex justify-content-center align-items-center">
        <div className="signup-form">
          <AuthLogo />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row m-0">
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="email"
                    autoComplete="new-email"
                    placeholder="Email Address"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="col-md-6 d-flex justify-content-center justify-content-md-start mb-2 mt-2">
                <span className="go-login">
                  Not yet a member? <Link to="/register">Register</Link>
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center justify-content-md-end mb-2">
                <button type="submit" className="btn btn-primary sign-up">
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AuthLeftContent
        headerTitle="Welcome Back"
        contentDescription="Thank you for joining. Updates and new features are released daily."
      />
    </div>
  );
};

export default LoginPage;
