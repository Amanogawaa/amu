import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/0">
      <div className="flex flex-col pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
