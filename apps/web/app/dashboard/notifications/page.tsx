'use client';

const notifications = [
  {
    id: 1,
    title: 'New Order Received',
    message: 'Order #1004 received from Table T2.',
    type: 'order',
    time: '2 min ago',
  },
  {
    id: 2,
    title: 'Low Inventory Alert',
    message: 'Cheese stock is running low.',
    type: 'inventory',
    time: '10 min ago',
  },
  {
    id: 3,
    title: 'Payment Successful',
    message: 'Customer payment of ₹1,250 completed.',
    type: 'payment',
    time: '20 min ago',
  },
  {
    id: 4,
    title: 'AI Recommendation',
    message: 'Increase staff during dinner rush hours.',
    type: 'ai',
    time: '1 hour ago',
  },
];

export default function NotificationsPage() {
  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Notifications Center
        </h1>

        <p className="text-gray-500 mt-2">
          Realtime restaurant alerts and updates
        </p>

      </div>

      <div className="space-y-5">

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-3xl shadow p-6"
          >

            <div className="flex items-start justify-between mb-3">

              <div className="flex items-center gap-4">

                <div
                  className={`w-4 h-4 rounded-full mt-2
                  ${
                    notification.type === 'order'
                      ? 'bg-blue-500'
                      : notification.type === 'inventory'
                      ? 'bg-yellow-500'
                      : notification.type === 'payment'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                ></div>

                <div>

                  <h2 className="text-xl font-bold">
                    {notification.title}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {notification.message}
                  </p>

                </div>

              </div>

              <span className="text-sm text-gray-400">
                {notification.time}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
