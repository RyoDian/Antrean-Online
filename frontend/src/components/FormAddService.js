import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const FormAddService = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const saveService = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/service", {
        code: code,
        name: name,
        description: description,
      },{withCredentials:true});
      swal({
        title: "Sukses!",
        text: "Berhasil Menyimpan Data",
        icon: "success",
        button: "Ok",
      });
      navigate("/service"); // Arahkan ke halaman layanan setelah sukses
    } catch (error) {
      swal({
        title: "Error!",
        text: "Gagal Menyimpan Data",
        icon: "error",
        button: "Ok",
      });
      console.error("Error saving service:", error);
    }
  };

  return (
    <div className="w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-500">
      <h1 className="font-bold text-lg">Form Tambah Service</h1>
      <form onSubmit={saveService} className="my-10">
        <div className="flex flex-col">
          <div className="mb-5">
            <label className="font-bold text-slate-700">Code</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Code Service"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Name</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Name Service"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="font-bold text-slate-700">Description</label>
            <input
              type="text"
              className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Description Service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default FormAddService;
