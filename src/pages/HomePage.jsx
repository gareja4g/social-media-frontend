import "../styles/plugins/FontAwesome/css/all.min.css";
import "../styles/plugins/OverlayScrollbars/css/OverlayScrollbars.min.css";
import "../styles/css/adminlte.min.css";
import Navbar from "../components/Layouts/Navbar";
import ContentHeader from "../components/Layouts/ContentHeader";
import MyProfile from "../components/Layouts/MyProfile";
import MainContent from "../components/Posts/MainContent";
import Footer from "../components/Layouts/Footer";

const HomePage = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <div className="content-wrapper">
        <ContentHeader />
        <div className="content">
          <div className="container">
            <div className="row">
              <MyProfile />
              <div className="col-md-9">
                <div className="card">
                  <MainContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
