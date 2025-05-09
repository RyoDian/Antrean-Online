// src/components/Sidebar.js
import React from "react";
import { NavLink} from "react-router-dom";
import { IoBag,IoExit } from 'react-icons/io5'; // Impor dari react-icons/io5
import { FaUserTag, FaUserTie } from 'react-icons/fa'; // Impor dari react-icons/fa
import { MdDashboard } from 'react-icons/md'; // Impor dari react-icons/md
import { useAuth } from '../context/AuthContext'; // Menggunakan AuthContext untuk mendapatkan user

const Sidebar = () => {
  const {  logout } = useAuth(); // Dapatkan user dari AuthContext

  return (
    <div className="flex h-screen fixed ">
      <div className="bg-gray-800 text-white w-64 flex flex-col gap-12">
        <div>
        <img
          src="/logo.png"
          alt="Logo"
          className=""
          style={{ width: "150px" }}
        />
          <h1 className="uppercase font-mono font-extrabold"> Dukcapil kota  Semarang</h1>
        </div>
        <ul className="p-2 flex-1 ">
          <li className="mb-6">
            <NavLink
              to="/S-dashboard"
              className="p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <MdDashboard />
              Dashboard
            </NavLink>
          </li>
          <li className="mb-6">
            <NavLink
              to="/location"
              className="p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <FaUserTag />
              Manage Locations
            </NavLink>
          </li>
          <li className="mb-6">
            <NavLink
              to="/service"
              className="p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <FaUserTie />
              Manage Services
            </NavLink>
          </li>
          <li className="mb-6">
            <NavLink
              to="/admin"
              className="p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <FaUserTie />
              Admin
            </NavLink>
          </li>
          <li className="mb-6">
            <NavLink
              to="/A-Dashboard"
              className="p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <IoBag />
              Manage Queues
            </NavLink>
          </li>
          <li className="mb-6">
            <NavLink
              to="/allQueue"
              className="p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <IoBag />
              History Antrian
            </NavLink>
          </li>
          <li className="mb-6">
            <button
              onClick={logout}
              className="block p-2 hover:bg-gray-700 flex gap-2 items-center"
            >
              <IoExit />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
