import { Routes, Route } from "react-router";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route element={<SigninPage />} path="signin" />
      <Route element={<SignupPage />} path="signup" />
    </Routes>
  );
}

export default App;
