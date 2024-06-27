import './App.css';
import Registration from './components/Pages/RegistrationPage';
import HomePage from './components/Pages/HomePage';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import SideBar from './components/Common/SideBar';
import ContentLayout from './components/Layout/ContentLayout';
import ProfilePage from './components/Pages/ProfilePage';
import { useUserAuthContext } from './context/UserAuthContext';
import PostModal from './components/Posts/PostModal';
import ReviewModal from './components/Reviews/ReviewModal';
import ReviewsPage from './components/Pages/ReviewsPage';
import SearchPage from './components/Pages/SearchPage';

const App = () => {

  const { token } = useUserAuthContext();

  const navigate = useNavigate();

  const location = useLocation();
  const previousLocation = location.state?.previousLocation;

  return (
    <div className="App">
      <div className='flex flex-1'>
        <Routes>
          <Route path="/post/:id" element={<PostModal onClose={() => {
            navigate(previousLocation || "/");
          }} />} />
          <Route path="/review/:id" element={<ReviewModal onClose={() => {
            navigate(previousLocation || "/");
          }} />} />
        </Routes>
        <SideBar />
        <ContentLayout>
          <Routes location={location.pathname.includes("/post") || location.pathname.includes("/review/") ? (previousLocation || "/") : location}>
            <Route path="/"
              element={
                <HomePage />
              } />
            <Route
              path="/registration"
              element={
                <>
                  {token === "" ? <Registration /> : <Navigate to={"/profile"} />}
                </>
              } />
            <Route
              path="/profile"
              element={
                <>
                  {token === "" ? <Registration /> : <ProfilePage />}
                </>
              }
            />
            <Route
              path="/reviews"
              element={
                <ReviewsPage />
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage />
              }
            />
          </Routes>
        </ContentLayout>
      </div>
    </div>
  );
}

export default App;
