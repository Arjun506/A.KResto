'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 4000 },
  { day: 'Tue', revenue: 3000 },
  { day: 'Wed', revenue: 5000 },
  { day: 'Thu', revenue: 7000 },
  { day: 'Fri', revenue: 6000 },
  { day: 'Sat', revenue: 9000 },
  { day: 'Sun', revenue: 8000 },
];

const salesData = [
  { name: 'Pizza', value: 40 },
  { name: 'Burger', value: 30 },
  { name: 'Biryani', value: 20 },
  { name: 'Drinks', value: 10 },
];

const COLORS = [
  '#000000',
  '#444444',
  '#777777',
  '#AAAAAA',
];

export default function AnalyticsPage() {
  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Restaurant business insights
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Total Revenue
          </h3>

          <p className="text-4xl font-bold mt-3">
            ₹2.4L
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Orders
          </h3>

          <p className="text-4xl font-bold mt-3">
            1,240
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Customers
          </h3>

          <p className="text-4xl font-bold mt-3">
            860
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">
            Avg Order
          </h3>

          <p className="text-4xl font-bold mt-3">
            ₹520
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Weekly Revenue
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={revenueData}>

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Top Selling Items
          </h2>

          <div className="h-80 flex items-center justify-center">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={salesData}
                  dataKey="value"
                  outerRadius={110}
                  label
                >

                  {salesData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}