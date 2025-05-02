import { React, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";

const FormEditService = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil id dari parameter URL

  // Memuat data layanan saat komponen dimuat
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/service/${id}`, {withCredentials:true});
        const { code, name, description } = response.data;
        setCode(code);
        setName(name);
        setDescription(description);
      } catch (error) {
        swal({
          title: "Error!",
          text: "Gagal Memuat Data",
          icon: "error",
          button: "Ok",
        });
        console.error("Error fetching service data:", error);
      }
    };

    fetchService();
  }, [id]);

  const updateService = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/service/${id}`, {
        code: code,
        name: name,
        description: description,
      }, {withCredentials:true});
      swal({
        title: "Sukses!",
        text: "Berhasil Mengupdate Data",
        icon: "success",
        button: "Ok",
      });
      navigate("/service"); // Arahkan kembali ke halaman layanan
    } catch (error) {
      swal({
        title: "Error!",
        text: "Gagal Mengupdate Data",
        icon: "error",
        button: "Ok",
      });
      console.error("Error updating service:", error);
    }
  };

  return (
    <div className="w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-500">
      <h1 className="font-bold text-lg">Form Edit Service</h1>
      <form onSubmit={updateService} className="my-10">
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditService;
