import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">$0.00</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Products</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
      </div>

      {/* Quick Actions */}
      <div className="col-span-1 md:col-span-3 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow flex items-center justify-center transition-colors">
            <span className="font-semibold text-lg">+ Add New Product</span>
          </Link>
          <Link to="/admin/orders" className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg shadow flex items-center justify-center transition-colors">
            <span className="font-semibold text-lg">Manage Orders</span>
          </Link>
        </div>
      </div>

      <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Welcome to MobiTechPro Admin</h3>
        <p className="text-gray-600">
          Select "Products" from the sidebar to manage your inventory.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
