import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const FormAddLocation = () => {
  const [name, setName] = useState("");
  const [kodeLokasi, setkodeLokasi] = useState("");
  const [address, setaddress] = useState("");

  const navigate = useNavigate();

  const saveLocation = async (e) => {
    e.preventDefault();
    await axios.post("/api/location", {
      name: name,
      kodeLokasi: kodeLokasi,
      address: address,
    },{withCredentials:true});
    swal({
      title: "Sukses!",
      text: "Berhasil Menyimpan Data",
      icon: "success",
      button: "Ok",
    });
    navigate("/location");
  };
  return (
    <div className="w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-500">
      <h1 className="font-bold text-lg">Form Tambah Location</h1>
      <form onSubmit={saveLocation} className="my-10">
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
            <label className="font-bold text-slate-700">kode Lokasi</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="kodeLokasi"
              value={kodeLokasi}
              onChange={(e) => setkodeLokasi(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">address</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="address Location"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormAddLocation;
