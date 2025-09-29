import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../components/AuthContext';
import { Bell, User } from 'lucide-react';
import { authFetch } from '../../user-management/utils/authFetchStaff';

const Header = ({ title = "Production Manager Dashboard", pendingCount = 0, onOpenNotifications = () => {}, userInfo }) => {
  const navigate = useNavigate();
  const hasPending = Number(pendingCount) > 0;
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/logout",
      });
      if (res.status === 200) {
        logout();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error log out:", error);
    }
  };


  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          <button onClick={onOpenNotifications} className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Pending customized orders">
            <Bell size={20} />
            <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center ${hasPending ? 'bg-red-500' : 'bg-gray-300'}`}>
              {pendingCount}
            </span>
          </button>

          <button className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            {userInfo?.profile_photo ? (
              <img src={userInfo.profile_photo} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600" />
            ) : (
              <div className="bg-gray-300 dark:bg-gray-700 rounded-full p-2">
                <User size={16} />
              </div>
            )}
            <span className="text-sm font-medium">Hi {userInfo?.first_name}</span>
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
