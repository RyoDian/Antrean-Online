import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSwr, { useSWRConfig } from "swr";
import swal from "sweetalert";

const ServiceComponent = () => {
  const { mutate } = useSWRConfig();
  
  // Fetch data function for services
  const fetcher = async () => {
    const response = await axios.get("/api/service", { withCredentials: true });
    return response.data.data; // Accessing `data` inside the response
  };

  // Fetch data for services using useSWR hook
  const { data, error } = useSwr("services", fetcher);

  // Loading and error states
  if (error) return <h2>Error loading services.</h2>;
  if (!data) return <h2>Loading...</h2>;

  // Function to delete a service
  const deleteService = async (serviceId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this service!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`/api/service/${serviceId}`, { withCredentials: true });
          swal("Poof! The service has been deleted!", { icon: "success" });
          mutate("services"); // Refresh data after delete
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Error deleting service";
          swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      } else {
        swal("Your service is safe!");
      }
    });
  };

  return (
    <div className="flex flex-col mt-6">
      <div className="w-full">
        <Link
          to="/service/add"
          className="bg-blue-500 hover:bg-blue-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add New Service
        </Link>
        <div className="relative shadow rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">No</th>
                <th className="py-3 px-6">Service Code</th>
                <th className="py-3 px-6">Service Name</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((service, index) => (
                <tr className="bg-white border-b" key={service._id || index}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{service.code}</td>
                  <td className="py-3 px-6">{service.name}</td>
                  <td className="py-3 px-6">{service.description}</td>
                  <td className="py-3 px-1 text-center">
                    <Link
                      to={`/service/${service._id}`}
                      className="font-medium bg-yellow-500 hover:bg-yellow-700 px-3 py-1 rounded text-white mr-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteService(service._id)}
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

export default ServiceComponent;
