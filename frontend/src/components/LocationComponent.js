import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSwr, { useSWRConfig } from "swr";
import swal from "sweetalert";

const LocationComponent = () => {
  const { mutate } = useSWRConfig();
  const [adminNames, setAdminNames] = useState({});

  // Fetch data function for locations
  const fetcher = async () => {
    const response = await axios.get("/api/location", { withCredentials: true });
    console.log(response.data)
    return response.data.data; // Accessing `data` inside the response
  };

  // Fetch data for locations using useSWR hook
  const { data } = useSwr("locations", fetcher);

  // Fetch admin names
  useEffect(() => {
    const fetchAdminNames = async () => {
      try {
        const response = await axios.get("/api/admin", { withCredentials: true });
        const adminsData = response.data.data;

        // Create an object to map admin ID to name
        const adminNameMap = {};
        adminsData.forEach((admin) => {
          adminNameMap[admin._id] = admin.name;
        });

        setAdminNames(adminNameMap);
      } catch (error) {
        console.error("Error fetching admin names:", error);
      }
    };

    fetchAdminNames();
  }, []);

  // Loading state while fetching data
  if (!data) return <h2>Loading....</h2>;

  // Function to delete a location
  const deleteLocation = async (locationId) => {
    console.log("Deleting location with ID:", locationId);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this location!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`/api/location/${locationId}`, { withCredentials: true });
          swal("Poof! The location has been deleted!", { icon: "success" });
          mutate("locations"); // Refresh data after delete
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Error deleting location";
          console.error("Delete Error:", errorMessage);
          
          swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      } else {
        swal("Your location is safe!");
      }
    });
  };

  return (
    <div className="flex flex-col mt-6">
      <div className="w-full">
        <Link
          to="/location/add"
          className="bg-blue-500 hover:bg-blue-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add New
        </Link>
        <div className="relative shadow rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">No</th>
                <th className="py-3 px-6">Location Name</th>
                <th className="py-3 px-6">Kode Lokasi</th>
                <th className="py-3 px-6">Address</th>
                <th className="py-3 px-6">Admins</th>
                <th className="py-3 px-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((location, index) => (
                <tr className="bg-white border-b" key={location._id || index}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{location.name}</td>
                  <td className="py-3 px-6">{location.kodeLokasi}</td>
                  <td className="py-3 px-6">{location.address}</td>
                  <td className="py-3 px-6">
                    {location.admins
                      .map((adminId) => adminNames[adminId] || "Unknown Admin")
                      .join(", ")}
                  </td>
                  <td className="py-3 px-1 text-center">
                    <Link
                      to={`/location/${location._id}`}
                      className="font-medium bg-yellow-500 hover:bg-yellow-700 px-3 py-1 rounded text-white mr-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteLocation(location._id)}
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

export default LocationComponent;
