"use client";

import QRCode from "react-qr-code";

const tables = [
  {
    id: 1,
    name: "Table 1",
  },
  {
    id: 2,
    name: "Table 2",
  },
  {
    id: 3,
    name: "VIP Table",
  },
];

export default function QRTablesPage() {

  return (

    <div className="min-h-screen bg-black text-white flex">

      <div className="flex-1 p-8">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            QR Tables
          </h1>

          <p className="text-zinc-400 mt-2">
            Generate QR codes for restaurant tables
          </p>

        </div>

        <div className="grid grid-cols-3 gap-5">

          {tables.map((table) => (

            <div
              key={table.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center"
            >

              <h2 className="text-2xl font-bold mb-6">
                {table.name}
              </h2>

              <div className="bg-white p-4 rounded-xl">

                <QRCode
                  value={`http://localhost:3000/qr-order?table=${table.id}`}
                  size={180}
                />

              </div>

              <p className="text-zinc-400 text-center mt-5 text-sm">
                Scan to order food
              </p>

              <button
                onClick={() => window.print()}
                className="mt-6 bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-bold"
              >
                Print QR
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}
