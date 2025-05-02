import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const MyQueue = () => {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk mengambil data antrean berdasarkan ID pengguna
    const fetchUserQueue = async () => {
      try {
        const response = await axios.get(
          "/api/queue", // Ganti endpoint sesuai kebutuhan
          { withCredentials: true }
        );
        setQueueData(response.data); // Simpan data antrean di state
      } catch (error) {
        swal(
          "Error",
          error.response?.data?.message || "Gagal mengambil data antrean",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserQueue();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-lg mt-8 mx-8 ">
      <h2 className="text-xl font-bold mb-4 text-center">Detail Antrean Anda</h2>
      <div className="flex flex-wrap gap-8 justify-center">
      {queueData.length > 0 ? (
        queueData.map((queue) => (
          <div key={queue._id} className="p-4 mb-4 bg-gray-100 rounded-lg">
            <p><strong>Kode Antrean:</strong> {queue.queue_code}</p>
            <p><strong>Tanggal:</strong> {queue.queue_date}</p>
            <p><strong>Status:</strong> {queue.status}</p>
          </div>
        ))
     
      ) : (
        <p className="text-gray-500">Tidak ada antrean, silahkan ambil antrean.</p>
      )}
       </div>
    </div>
  );
};

export default MyQueue;
