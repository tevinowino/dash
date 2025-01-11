import { Eye, Trash2 } from "lucide-react";

const orders = [
  {
    id: "ORD12345",
    customer: "John Doe",
    date: "2025-01-08",
    total: "$129.99",
    status: "Delivered",
  },
  {
    id: "ORD12346",
    customer: "Jane Smith",
    date: "2025-01-07",
    total: "$89.50",
    status: "Processing",
  },
  {
    id: "ORD12347",
    customer: "Michael Brown",
    date: "2025-01-06",
    total: "$45.00",
    status: "Cancelled",
  },
  {
    id: "ORD12348",
    customer: "Emily Davis",
    date: "2025-01-05",
    total: "$220.75",
    status: "Shipped",
  },
];

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold text-white mb-6">Orders</h1>
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg border border-gray-700">
        <table className="w-full table-auto text-left text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-700 hover:bg-gray-750 transition"
              >
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4">{order.total}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Delivered"
                        ? "bg-green-600 text-green-200"
                        : order.status === "Processing"
                        ? "bg-yellow-600 text-yellow-200"
                        : order.status === "Cancelled"
                        ? "bg-red-600 text-red-200"
                        : "bg-blue-600 text-blue-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    title="View Order"
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <Eye className="w-5 h-5 text-blue-400" />
                  </button>
                  <button
                    title="Delete Order"
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
