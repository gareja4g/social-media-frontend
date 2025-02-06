import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthLeftContent from "../components/Auth/AuthLeftContent";
import AuthLogo from "../components/Auth/AuthLogo";
import { request } from "../utils/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await request("/register", data, "POST", null);

      toast.success(
        result.message || "Registration successful! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="row ht-100v flex-row-reverse no-gutters">
      <div className="col-md-6 d-flex justify-content-center align-items-center">
        <div className="signup-form">
          <AuthLogo />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row m-0">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="First Name"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                  />
                  {errors.first_name && (
                    <p className="text-danger">{errors.first_name.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Last Name"
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.last_name && (
                    <p className="text-danger">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="User Name"
                    {...register("user_name", {
                      required: "User name is required",
                      pattern: {
                        value: /^(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]{0,29}$/,
                        message:
                          "Username must start with a letter, be 1-30 characters long, and not contain consecutive underscores or dots",
                      },
                    })}
                  />
                  {errors.user_name && (
                    <p className="text-danger">{errors.user_name.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="email"
                    autoComplete="new-email"
                    placeholder="Email Address"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm Password"
                    {...register("password_confirmation", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  {errors.password_confirmation && (
                    <p className="text-danger">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center justify-content-md-start mb-2 mt-2">
                <span className="go-login">
                  Already a member? <Link to="/login">Log in</Link>
                </span>
              </div>
              <div className="col-md-6 d-flex justify-content-center justify-content-md-end mb-2">
                <button type="submit" className="btn btn-primary sign-up">
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AuthLeftContent
        headerTitle="Create Account"
        contentDescription="Enter your personal details and start your journey with us."
      />
    </div>
  );
};

export default RegisterPage;
