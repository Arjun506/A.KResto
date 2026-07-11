"use client";

export default function InvoicePage() {

  const items = [
    {
      name: "Chicken Burger",
      qty: 2,
      price: 199,
    },
    {
      name: "Veg Pizza",
      qty: 1,
      price: 349,
    },
    {
      name: "Cold Coffee",
      qty: 2,
      price: 149,
    },
  ];

  const subtotal = items.reduce(
    (acc, item) =>
      acc + item.qty * item.price,
    0
  );

  const gst = subtotal * 0.18;

  const total = subtotal + gst;

  const printBill = () => {
    window.print();
  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-5xl font-bold">
              Invoice
            </h1>

            <p className="text-zinc-400 mt-2">
              Restaurant billing invoice
            </p>
          </div>

          <button
            onClick={printBill}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold"
          >
            Print Bill
          </button>

        </div>

        {/* INVOICE */}
        <div className="bg-white text-black rounded-2xl p-10 max-w-4xl">

          <div className="flex justify-between mb-10">

            <div>

              <h2 className="text-4xl font-bold text-red-500">
                A3 RESTO
              </h2>

              <p className="mt-3 text-zinc-600">
                Bangalore, India
              </p>

            </div>

            <div className="text-right">

              <h3 className="text-2xl font-bold">
                Invoice
              </h3>

              <p className="mt-3">
                #INV-1024
              </p>

            </div>

          </div>

          {/* TABLE */}
          <table className="w-full mb-10">

            <thead>

              <tr className="border-b">

                <th className="text-left py-4">
                  Item
                </th>

                <th className="text-center py-4">
                  Qty
                </th>

                <th className="text-right py-4">
                  Price
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="py-4">
                    {item.name}
                  </td>

                  <td className="text-center">
                    {item.qty}
                  </td>

                  <td className="text-right">
                    ₹{item.qty * item.price}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* TOTALS */}
          <div className="flex justify-end">

            <div className="w-[300px] space-y-4">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-2xl font-bold border-t pt-4">
                <span>Total</span>
                <span className="text-red-500">
                  ₹{total.toFixed(2)}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}
