import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="main-header navbar navbar-expand-md navbar-light navbar-white">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="brand-text font-weight-light">AdminLTE 3</span>
        </Link>

        <button
          className="navbar-toggler order-1"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse order-3" id="navbarCollapse">
          <form className="form-inline ml-0 ml-md-3" onSubmit={handleSearch}>
            <div className="input-group input-group-sm">
              <input
                className="form-control form-control-navbar"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="input-group-append">
                <button className="btn btn-navbar" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <Notifications />
      </div>
    </nav>
  );
}
