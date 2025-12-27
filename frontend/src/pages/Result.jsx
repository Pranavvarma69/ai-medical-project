import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Activity, ArrowLeft, Download } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`/scans/${id}`);
        setScan(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-xl">
          Loading scan result...
        </div>
      </>
    );
  }

  if (!scan) return null;

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex">

        {/* LEFT */}
        <div className="w-1/2 p-10 flex flex-col">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex-1 flex items-center justify-center">
            <img
              src={`http://localhost:13000/${scan.imageUrl}`}
              alt="X-ray"
              className="max-h-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <Activity size={34} className="text-cyan-400" />
            <h1 className="text-4xl font-bold">AI Scan Result</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
            <p className="text-gray-300 mb-2">Predicted Condition</p>
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">
              {scan.predictedClass}
            </h2>

            <p className="text-gray-300 mb-6">
              Confidence:{" "}
              <span className="font-semibold text-white">
                {(scan.confidence * 100).toFixed(2)}%
              </span>
            </p>

            {/* Bars */}
            <div className="space-y-4">
              {Object.entries(scan.predictions).map(([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span>{(value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-cyan-400 h-2 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate("/scan")}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-xl transition"
              >
                New Scan
              </button>

              <button className="flex items-center justify-center gap-2 px-6 border border-gray-500 rounded-xl hover:bg-white/10 transition">
                <Download size={18} />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}