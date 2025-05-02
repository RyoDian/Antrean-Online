import { React, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";

const FormEditLocation = () => {
  const [name, setName] = useState("");
  const [kodeLokasi, setKodeLokasi] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil id dari parameter URL

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`/api/location/${id}`, {withCredentials:true});
        const { name, kodeLokasi, address } = response.data;
        setName(name);
        setKodeLokasi(kodeLokasi);
        setAddress(address);
      } catch (error) {
        swal({
          title: "Error!",
          text: "Gagal Memuat Data Lokasi",
          icon: "error",
          button: "Ok",
        });
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocation();
  }, [id]);

  const updateLocation = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/location/${id}`, {
        name: name,
        kodeLokasi: kodeLokasi,
        address: address,
      }, {withCredentials:true });
      swal({
        title: "Sukses!",
        text: "Berhasil Mengupdate Data Lokasi",
        icon: "success",
        button: "Ok",
      });
      navigate("/location"); // Arahkan kembali ke halaman lokasi
    } catch (error) {
      swal({
        title: "Error!",
        text: "Gagal Mengupdate Data Lokasi",
        icon: "error",
        button: "Ok",
      });
      console.error("Error updating location:", error);
    }
  };

  return (
    <div className="w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-500">
      <h1 className="font-bold text-lg">Form Edit Location</h1>
      <form onSubmit={updateLocation} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Name</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Name Location"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Kode Lokasi</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Kode Lokasi"
              value={kodeLokasi}
              onChange={(e) => setKodeLokasi(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Address</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Address Location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
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

export default FormEditLocation;
