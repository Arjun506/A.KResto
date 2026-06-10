"use client";

import { useState } from "react";

export default function StaffPage() {

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Rahul",
      role: "Manager",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "Aman",
      role: "Waiter",
      phone: "9876501234",
    },
    {
      id: 3,
      name: "Priya",
      role: "Cashier",
      phone: "9988776655",
    },
  ]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const addStaff = () => {

    if (!name || !role || !phone) {
      alert("Fill all fields");
      return;
    }

    const newStaff = {
      id: Date.now(),
      name,
      role,
      phone,
    };

    setStaff([...staff, newStaff]);

    setName("");
    setRole("");
    setPhone("");

  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Staff Management
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage restaurant staff & roles
          </p>

        </div>

        {/* ADD STAFF */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Add Staff Member
          </h2>

          <div className="grid grid-cols-3 gap-5">

            <input
              type="text"
              placeholder="Staff Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
            />

            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-4 rounded-xl bg-zinc-800 outline-none"
            />

          </div>

          <button
            onClick={addStaff}
            className="mt-5 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold"
          >
            Add Staff
          </button>

        </div>

        {/* STAFF LIST */}
        <div className="grid grid-cols-3 gap-5">

          {staff.map((member) => (

            <div
              key={member.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl font-bold">
                  {member.name}
                </h2>

                <span className="bg-red-500 px-4 py-2 rounded-full text-sm font-bold">
                  {member.role}
                </span>

              </div>

              <p className="text-zinc-400">
                Phone Number
              </p>

              <h3 className="text-xl font-semibold mt-2">
                {member.phone}
              </h3>

              <button className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl">
                View Profile
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}
