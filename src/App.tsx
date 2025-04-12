import { Navigate, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      <Route element={<Navigate to="/home" />} path="/" />
      <Route element={<LandingPage />} path="home" />
      <Route element={<SigninPage />} path="signin" />
      <Route element={<SignupPage />} path="signup" />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
