import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

// Fungsi untuk mengucapkan teks
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID"; // Bahasa Indonesia
  speechSynthesis.speak(utterance);
};

const AdminQueuePage = () => {
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [serviceQueues, setServiceQueues] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchLastCalledQueues = async () => {
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
  };

  useEffect(() => {
    fetchLastCalledQueues();
  }, [locationId, services]);

  const callNextQueue = async () => {
    if (!locationId || !serviceId) {
      swal("Error", "Please select a location and a service!", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/adminq/call-next/${locationId}/${serviceId}`,
        {},
        { withCredentials: true }
      );

      const queueCode = response.data.kode;
      const message = `Nomor antrean ${queueCode}, silakan menuju loket.`;
      speak(message);

      swal("Success", response.data.message, "success");

      setCurrentQueue({
        date: response.data.date,
        code: response.data.kode,
        status: response.data.status,
        _id: response.data._id,
      });

      await fetchLastCalledQueues();
    } catch (error) {
      swal(
        "Error",
        error.response?.data?.message || "Failed to call the next queue",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const completeQueue = async () => {
    if (!currentQueue) {
      swal("Error", "No queue to complete!", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        `/api/adminq/complete/${currentQueue._id}`,
        {},
        { withCredentials: true }
      );
      swal("Success", "Queue marked as completed.", "success");
      setCurrentQueue(null);
      await fetchLastCalledQueues();
    } catch (error) {
      swal(
        "Error",
        error.response?.data?.message || "Failed to complete the queue",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelQueue = async () => {
    if (!currentQueue) {
      swal("Error", "No queue to cancel!", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        `/api/adminq/cancel/${currentQueue._id}`,
        {},
        { withCredentials: true }
      );
      swal("Success", "Queue canceled successfully.", "success");
      setCurrentQueue(null);
      await fetchLastCalledQueues();
    } catch (error) {
      swal(
        "Error",
        error.response?.data?.message || "Failed to cancel the queue",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQueue = async () => {
    if (!locationId || !serviceId) {
      swal("Error", "Please select a location and a service!", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/adminq/current/${locationId}/${serviceId}`,
        { withCredentials: true }
      );
      const queueCode = response.data.queueCode;
      const message = `Nomor antrean ${queueCode}, silakan menuju loket.`;
      speak(message);
      swal("Success", "Current queue details fetched.", "success");
      setCurrentQueue({
        date: response.data.queue_date,
        code: response.data.queueCode,
        status: response.data.status,
        _id: response.data._id,
      });
    } catch (error) {
      swal(
        "Error",
        error.response?.data?.message || "Failed to fetch current queue",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-8 my-12 bg-blue-100 px-4 lg:px-14 py-8 rounded-xl shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {serviceQueues.map((serviceQueue, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="font-bold text-indigo-600">{serviceQueue.serviceName}</h2>
            {serviceQueue.queue ? (
              <div className="mt-2">
                <p>Code: {serviceQueue.queue.code}</p>
                <p>Status: {serviceQueue.queue.status}</p>
              </div>
            ) : (
              <p className="mt-2 text-red-500">No queue called yet.</p>
            )}
          </div>
        ))}
      </div>

      <h1 className="font-bold text-lg my-5 text-center">Admin Queue Management</h1>

      <div className="mb-5">
        <label className="font-bold text-slate-700">Select Location</label>
        <select
          className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
        >
          <option value="">-- Select a Location --</option>
          {locations.map((location) => (
            <option key={location._id} value={location._id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="font-bold text-slate-700">Select Service</label>
        <select
          className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          <option value="">-- Select a Service --</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={callNextQueue}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          {loading ? "Loading..." : "Call Next Queue"}
        </button>
        <button
          onClick={completeQueue}
          disabled={!currentQueue || loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Complete Queue
        </button>
        <button
          onClick={cancelQueue}
          disabled={!currentQueue || loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
        >
          Cancel Queue
        </button>
        <button
          onClick={getCurrentQueue}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Get Current Queue
        </button>
      </div>

      {currentQueue && (
        <div className="mt-5 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold">Current Queue Details:</h2>
          <p>Date: {currentQueue.date}</p>
          <p>Code: {currentQueue.code}</p>
          <p>Status: {currentQueue.status}</p>
        </div>
      )}
    </div>
  );
};

export default AdminQueuePage;
