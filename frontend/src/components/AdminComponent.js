import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSwr, { useSWRConfig } from "swr";
import swal from "sweetalert";

const AdminComponent = () => {
  const { mutate } = useSWRConfig();
  const [locationNames, setLocationNames] = useState({});

  // Fetch data function for admins
  const fetcher = async () => {
    const response = await axios.get("/api/admin", { withCredentials: true });
    return response.data.data; // Accessing `data` inside the response
  };

  // Fetch data for admins using useSWR hook
  const { data } = useSwr("admins", fetcher);

  // Fetch location names
  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        const response = await axios.get("/api/location", { withCredentials: true });
        const locationsData = response.data.data;

        // Create an object to map location ID to name
        const locationNameMap = {};
        locationsData.forEach((location) => {
          locationNameMap[location._id] = location.name;
        });

        setLocationNames(locationNameMap);
      } catch (error) {
        console.error("Error fetching location names:", error);
      }
    };

    fetchLocationNames();
  }, []);

  // Loading state while fetching data
  if (!data) return <h2>Loading....</h2>;

  // Function to delete an admin
  const deleteAdmin = async (adminId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this admin!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`/api/admin/${adminId}`, { withCredentials: true });
          swal("Poof! The admin has been deleted!", { icon: "success" });
          mutate("admins"); // Refresh data after delete
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Error deleting admin";
          console.error("Delete Error:", errorMessage);
          
          swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      } else {
        swal("The admin is safe!");
      }
    });
  };

  return (
    <div className="flex flex-col mt-6">
      <div className="w-full">
        <Link
          to="/admin/add"
          className="bg-blue-500 hover:bg-blue-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add New Admin
        </Link>
        <div className="relative shadow rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">No</th>
                <th className="py-3 px-6">Admin Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((admin, index) => (
                <tr className="bg-white border-b" key={admin._id || index}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{admin.name}</td>
                  <td className="py-3 px-6">{admin.email}</td>
                  <td className="py-3 px-6">{admin.role}</td>
                  <td className="py-3 px-6">
                  {Array.isArray(admin.location) 
                    ? admin.location
                        .map((locationId) => locationNames[String(locationId)] || "Unknown Location") // Ensure locationId is a string for matching
                        .join(", ")
                    : admin.location 
                        ? locationNames[String(admin.location)] || "Unknown Location"  // If location is not an array, handle as a single ID
                        : "No locations assigned"}
                  </td>
                  <td className="py-3 px-1 text-center">
                    <Link
                      to={`/admin/${admin._id}`}
                      className="font-medium bg-yellow-500 hover:bg-yellow-700 px-3 py-1 rounded text-white mr-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteAdmin(admin._id)}
                      className="font-medium bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-white mr-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComponent;
