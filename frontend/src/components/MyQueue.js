import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const MyQueue = () => {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queueRes = await axios.get("/api/queue", { withCredentials: true });

        const queuesWithFormattedDate = queueRes.data
          .map((queue) => ({
            ...queue,
            formattedDate: new Date(queue.queue_date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            }),
          }))
          .sort((a, b) => new Date(b.queue_date) - new Date(a.queue_date));

        setQueueData(queuesWithFormattedDate);
      } catch (error) {
        swal(
          "Error",
          error.response?.data?.message || "Gagal mengambil data antrean.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBackgroundColor = (status) => {
    switch (status) {
      case "waiting":
        return "bg-gray-100";
      case "called":
        return "bg-orange-300";
      case "completed":
        return "bg-green-300";
      case "canceled":
        return "bg-red-300";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) return <div>Loading...</div>;

  // Filter antrean berdasarkan status
  const waitingQueues = queueData.filter((q) => q.status === "waiting");
  const calledQueues = queueData.filter((q) => q.status === "called");
  const completedQueues = queueData.filter((q) => q.status === "completed");
  const canceledQueues = queueData.filter((q) => q.status === "canceled");

  const QueueList = ({ title, data }) => (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
      <div className="flex flex-wrap gap-8 justify-center">
        {data.length > 0 ? (
          data.map((queue) => (
            <div key={queue._id} className={`p-4 ${getBackgroundColor(queue.status)} rounded-md`}>
              <p><strong>Nama:</strong> {queue.user_name}</p>
              <p><strong>Kode Antrean:</strong> {queue.queue_code}</p>
              <p><strong>Tanggal:</strong> {queue.formattedDate}</p>
              <p><strong>Status:</strong> {queue.status}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Tidak ada antrean dengan status {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-lg mt-8 mx-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Detail Antrean Anda</h2>
      <div className="space-y-4">
        <QueueList title="Waiting" data={waitingQueues} />
        <QueueList title="Called" data={calledQueues} />
        <QueueList title="Completed" data={completedQueues} />
        <QueueList title="Canceled" data={canceledQueues} />
      </div>
    </div>
  );
};

export default MyQueue;
