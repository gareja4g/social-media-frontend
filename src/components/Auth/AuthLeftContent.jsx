import backgroundImage from "../../assets/images/auth-bg.png";

export default function AuthLeftContent({ headerTitle, contentDescription }) {
  return (
    <div
      className="col-md-6 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="auth-left-content mt-5 mb-5 text-center">
        <div className="text-white mt-5 mb-5">
          <h2 className="create-account mb-3">{headerTitle}</h2>
          <p>{contentDescription}</p>
        </div>
      </div>
    </div>
  );
}
