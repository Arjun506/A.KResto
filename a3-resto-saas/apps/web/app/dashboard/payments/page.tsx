"use client";

import { useState } from "react";

export default function PaymentsPage() {

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [paid, setPaid] = useState(false);

  const total = 1248;

  const processPayment = () => {

    setTimeout(() => {
      setPaid(true);
    }, 1500);

  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Payments
          </h1>

          <p className="text-zinc-400 mt-2">
            Restaurant billing payments
          </p>

        </div>

        {/* PAYMENT BOX */}
        <div className="max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          <h2 className="text-3xl font-bold mb-8">
            Checkout
          </h2>

          {/* TOTAL */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8">

            <p className="text-zinc-400">
              Total Amount
            </p>

            <h3 className="text-5xl font-bold text-red-500 mt-3">
              ₹{total}
            </h3>

          </div>

          {/* METHODS */}
          <div className="grid grid-cols-3 gap-5 mb-10">

            <button
              onClick={() => setPaymentMethod("Cash")}
              className={`p-5 rounded-2xl border ${
                paymentMethod === "Cash"
                  ? "bg-red-500 border-red-500"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              💵 Cash
            </button>

            <button
              onClick={() => setPaymentMethod("Card")}
              className={`p-5 rounded-2xl border ${
                paymentMethod === "Card"
                  ? "bg-red-500 border-red-500"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              💳 Card
            </button>

            <button
              onClick={() => setPaymentMethod("UPI")}
              className={`p-5 rounded-2xl border ${
                paymentMethod === "UPI"
                  ? "bg-red-500 border-red-500"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              📱 UPI
            </button>

          </div>

          {/* STATUS */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8">

            <p className="text-zinc-400">
              Selected Method
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {paymentMethod}
            </h3>

          </div>

          {/* BUTTON */}
          {!paid ? (

            <button
              onClick={processPayment}
              className="w-full bg-green-500 hover:bg-green-600 p-5 rounded-2xl text-2xl font-bold text-black"
            >
              Pay ₹{total}
            </button>

          ) : (

            <div className="bg-green-500 text-black p-6 rounded-2xl text-center">

              <h2 className="text-4xl font-bold">
                Payment Successful
              </h2>

              <p className="mt-3 text-lg">
                Transaction Completed
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}
