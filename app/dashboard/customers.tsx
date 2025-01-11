import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { redirect } from 'react-router';
import { getSession } from '~/session.server';
import { getUser } from '~/supabase.server';

export const loader = async ({ request }: { request: Request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const user = await getUser(request);
  
    let userEmail = null;
    try {
      const user = await getUser(request);
      userEmail = user?.email ?? null;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  
  
    if (!user) {
      // Redirect to login if the user isn't authenticated
      return redirect("/login");
    }
  
    return  userEmail;
  };
  
export default function CustomersPage() {
  // Dummy users data
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', status: 'Active', registeredAt: '2023-05-12' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', status: 'Inactive', registeredAt: '2023-02-22' },
    { id: 3, name: 'Robert Johnson', email: 'robertj@example.com', status: 'Active', registeredAt: '2022-11-30' },
    { id: 4, name: 'Emily Davis', email: 'emilyd@example.com', status: 'Active', registeredAt: '2023-07-18' },
  ]);

  // Handler for deleting a user
  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Handler for editing a user (This can be replaced with a modal or form)
  const handleEdit = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
    // Add your editing logic here (e.g., open modal, navigate to edit page)
  };

  return (
    <div className="container min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-semibold text-white mb-6">Users List</h1>
        <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
          <table className="min-w-full table-auto text-gray-300">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Registered At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="px-6 py-4 text-sm text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-white">{user.status}</td>
                  <td className="px-6 py-4 text-sm text-white">{user.registeredAt}</td>
                  <td className="px-6 py-4 text-sm text-white flex gap-4">
                    <button onClick={() => handleEdit(user.id)} className="text-blue-400 hover:text-blue-600">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600">
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
