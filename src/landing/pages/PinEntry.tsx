import React from "react";
import logo from "../../assets/logo 1.png";
import jm_actub from "../../assets/jm_actub.png";
import edther_ducusin from "../../assets/edther_ducusin.png";
import anthony_paduala from "../../assets/anthony_paduala.png";
import lorenz_ong from "../../assets/lorenz_ong.png";
import carmina_yanez from "../../assets/carmina_yanez.png";
import carl_langgamen from "../../assets/carl_langgamen.png";
import { useNavigate } from "react-router-dom";

const placeholder =
  "https://ui-avatars.com/api/?name=Staff&background=E0E0E0&color=888&size=128";

const users = [
  {
    role: "MANAGER",
    name: "JM Actub",
    img: jm_actub,
    shift: "",
    contact: "",
  },
  {
    role: "STAFF",
    name: "Edther Ducusin",
    img: edther_ducusin,
    shift: "2AM - 9AM",
    contact: "0912-476-2104",
  },
  {
    role: "STAFF",
    name: "Anthony Paduala",
    img: anthony_paduala,
    shift: "2AM - 9AM",
    contact: "0912-476-2104",
  },
  {
    role: "STAFF",
    name: "Lorenz Ong",
    img: lorenz_ong,
    shift: "2AM - 9AM",
    contact: "0912-476-2104",
  },
  {
    role: "STAFF",
    name: "Carmina Yanez",
    img: carmina_yanez,
    shift: "2AM - 9AM",
    contact: "0912-476-2104",
  },
  {
    role: "STAFF",
    name: "Nicole Salangantin",
    img: placeholder,
    shift: "2AM - 9AM",
    contact: "0912-476-2104",
  },
  {
    role: "STAFF",
    name: "Carl Langgamen",
    img: carl_langgamen,
    shift: "2AM - 9AM",
    contact: "0912-476-2104",
  },
];

const PinEntry = () => {
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate("/dashboard");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/assets/bg.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-orange-100/90">
        {/* Left: User List */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold text-center mb-6">Who's Using?</h2>
            <div className="flex flex-col gap-4">
              {users.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b pb-2 last:border-b-0 last:pb-0">
                  <img
                    src={user.img}
                    alt={user.name}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                  <div>
                    <span className={`text-xs font-bold ${user.role === 'MANAGER' ? 'text-orange-600' : 'text-gray-500'}`}>{user.role}</span>
                    <div className="font-medium text-gray-800 leading-tight">{user.name}</div>
                    {user.shift && (
                      <div className="text-xs text-gray-400">{user.shift}</div>
                    )}
                    {user.contact && (
                      <div className="text-xs text-gray-400">{user.contact}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: PIN Entry */}
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <h2 className="text-lg font-semibold text-center">Enter your PIN to access this profile.</h2>
            <div className="flex gap-4 justify-center mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-10 h-12 rounded bg-gray-200" />
              ))}
            </div>
            <div className="bg-orange-200 rounded-2xl shadow-lg p-4">
              <div className="bg-white rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <button key={n} className="text-orange-600 text-xl font-bold py-2 rounded hover:bg-orange-50 transition">{n}</button>
                  ))}
                  <button className="text-orange-400 font-semibold py-2 rounded hover:bg-orange-50 transition">Cancel</button>
                  <button className="text-orange-600 text-xl font-bold py-2 rounded hover:bg-orange-50 transition">0</button>
                  <button className="text-orange-600 font-semibold py-2 rounded hover:bg-orange-50 transition" onClick={handleEnter}>Enter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinEntry;
