import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [serviceQueues, setServiceQueues] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [queueDate, setQueueDate] = useState("");
  const navigate = useNavigate();

  // Fetch locations and services once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationResponse, serviceResponse] = await Promise.all([
          axios.get("/api/location", { withCredentials: true }),
          axios.get("/api/service", { withCredentials: true }),
        ]);
        setLocations(locationResponse.data.data);
        setServices(serviceResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch the last called queues when location or services change
    const fetchLastCalledQueues = useCallback(async () => {
    if (!locationId) return;

    const queues = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await axios.get(
            `/api/adminq/last-called/${locationId}/${service._id}`,
            { withCredentials: true }
          );
          return { serviceName: service.name, queue: response.data.queue };
        } catch (error) {
          return { serviceName: service.name, queue: null };
        }
      })
    );
    setServiceQueues(queues);
  }, [locationId, services]);

  useEffect(() => {
    fetchLastCalledQueues();
  }, [locationId, services, fetchLastCalledQueues]);

  const handleCreateQueue = async () => {
    if (!locationId || !serviceId || !queueDate) {
      swal("Warning", "Please select a location, service, and date", "warning");
      return;
    }
    try {
      const response = await axios.post(
        `/api/queue/${locationId}`,
        {
          code: serviceId,
          queue_date: queueDate,
        },
        { withCredentials: true }
      );
      swal("Success", "Queue created successfully!", "success");
      fetchLastCalledQueues(); // Refresh last called queues before navigating
      navigate("/queue"); // Navigate after success
      return response;
    } catch (error) {
      swal("Error", error.response?.data?.message || "Failed to create queue", "error");
    }
  };

  return (
    <div className=" mx-8 p-6 bg-blue-100 rounded-lg shadow-lg px-12 mt-8">
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Last Called Queues:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {serviceQueues.map((serviceQueues, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="text-indigo-600 font-semibold text-2xl">{serviceQueues.serviceName}</h3>
              {serviceQueues.queue ? (
                <p className="text-4xl">{serviceQueues.queue.code}</p>
              ) : (
                <p className="text-red-500">No queue called yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Queue Management</h1>

      {/* Location Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Location:</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
        >
          <option value="">Select a Location</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Service Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Service:</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          <option value="">Select a Service</option>
          {services.map((svc) => (
            <option key={svc._id} value={svc.code}>
              {svc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Queue Date:</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={queueDate}
          onChange={(e) => setQueueDate(e.target.value)}
        />
      </div>

      {/* Create Queue Button */}
      <button
        onClick={handleCreateQueue}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600"
      >
        Create Queue
      </button>
    </div>
  );
};

export default UserDashboard;
