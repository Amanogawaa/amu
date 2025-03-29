import { Routes, Route } from "react-router";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route element={<SigninPage />} path="signin" />
      <Route element={<SignupPage />} path="signup" />
      <Route element={<Dashboard />} path="dashboard" />
      <Route element={<Chat />} path="chat" />
    </Routes>
  );
}

export default App;
