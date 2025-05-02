import React from "react";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="flex min-h-screen ">
        <aside className="w-72 bg-gray-800 text-white p-4 ">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 bg-gray-100 ">{children}</main>
      </div>
    </React.Fragment>
  );
};

export default Layout;
