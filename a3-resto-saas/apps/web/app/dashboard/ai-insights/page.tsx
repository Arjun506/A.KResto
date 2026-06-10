'use client';

const insights = [
  {
    title: 'Revenue Growth',
    description:
      'Revenue increased by 18% compared to last week.',
    status: 'positive',
  },
  {
    title: 'Inventory Alert',
    description:
      'Cheese stock may run out in 2 days.',
    status: 'warning',
  },
  {
    title: 'Peak Hours',
    description:
      'Most customer orders are between 7 PM - 10 PM.',
    status: 'info',
  },
  {
    title: 'Top Selling Item',
    description:
      'Chicken Biryani generated highest revenue this week.',
    status: 'positive',
  },
];

export default function AIInsightsPage() {
  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          AI Insights
        </h1>

        <p className="text-gray-500 mt-2">
          Smart restaurant business analytics
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {insights.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow p-6"
          >

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-2xl font-bold">
                {item.title}
              </h2>

              <div
                className={`w-4 h-4 rounded-full
                ${
                  item.status === 'positive'
                    ? 'bg-green-500'
                    : item.status === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
              ></div>

            </div>

            <p className="text-gray-600 leading-7">
              {item.description}
            </p>

          </div>
        ))}

      </div>

      <div className="bg-white rounded-3xl shadow p-8 mt-8">

        <h2 className="text-3xl font-bold mb-6">
          AI Recommendations
        </h2>

        <div className="space-y-5">

          <div className="border rounded-2xl p-5">
            Increase staff during peak dinner hours.
          </div>

          <div className="border rounded-2xl p-5">
            Promote combo meals to increase average order value.
          </div>

          <div className="border rounded-2xl p-5">
            Restock dairy inventory before weekend demand.
          </div>

        </div>

      </div>

    </div>
  );
}