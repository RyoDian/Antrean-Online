import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminQueueHistory = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get("/api/allqueue", { withCredentials: true });
        setQueues(response.data.data);
      } catch (error) {
        swal("Error", error.response?.data?.message || "Gagal mengambil antrean", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  const exportToExcel = () => {
    const exportData = queues.map((queue, index) => ({
      No: index + 1,
      Nama: queue.user_id?.name || "-",
      NIK: queue.user_id?.nik || "-",
      "Kode Antrean": queue.queue_code,
      Layanan: queue.service_id?.name || "-",
      Lokasi: queue.location_id?.name || "-",
      Tanggal: new Date(queue.queue_date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      Status: queue.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Antrean");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Riwayat-Antrean-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center w-full">Riwayat Semua Antrean</h2>
        <div className="absolute right-6">
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Export ke Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 border rounded-lg shadow-md">
          <thead className="bg-gray-200 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">NIK</th>
              <th className="px-4 py-2">Kode Antrean</th>
              <th className="px-4 py-2">Layanan</th>
              <th className="px-4 py-2">Lokasi</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {queues.map((queue, index) => (
              <tr key={queue._id} className="bg-white border-b hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{queue.user_id?.name || "-"}</td>
                <td className="px-4 py-2">{queue.user_id?.nik || "-"}</td>
                <td className="px-4 py-2">{queue.queue_code}</td>
                <td className="px-4 py-2">{queue.service_id?.name || "-"}</td>
                <td className="px-4 py-2">{queue.location_id?.name || "-"}</td>
                <td className="px-4 py-2">
                  {new Date(queue.queue_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2 capitalize">{queue.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQueueHistory;
