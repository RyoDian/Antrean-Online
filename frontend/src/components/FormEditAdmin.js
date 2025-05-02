import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";

const FormEditAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Getting admin ID from URL params

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/location", {
          withCredentials: true,
        });
        setLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/${id}`, {
          withCredentials: true,
        });
        const admin = response.data.data;

        // Set state with admin data
        setName(admin.name || "");
        setEmail(admin.email || "");
        setPhone(admin.phone || "");
        setRole(admin.role || "");
        setLocation(admin.location || "");
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchLocations();
    fetchAdminDetails();
  }, [id]);

  const updateAdmin = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `/api/admin/${id}`,
        {
          name,
          email,
          phone,
          role,
          location,
        },
        { withCredentials: true }
      );

      swal({
        title: "Success!",
        text: "Admin has been updated successfully.",
        icon: "success",
        button: "Ok",
      });
      navigate("/admin");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update admin";
      swal({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        button: "Ok",
      });
    }
  };

  return (
    <div className="w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-500">
      <h1 className="font-bold text-lg">Edit Admin</h1>
      <form onSubmit={updateAdmin} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Name</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Email</label>
            <input
              type="email"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Phone</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Role</label>
            <select
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Location</label>
            <select
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditAdmin;
