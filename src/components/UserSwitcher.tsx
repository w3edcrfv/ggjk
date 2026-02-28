import { useState } from 'react';
import { users, currentUser, setCurrentUser } from '../mocks/users';

interface UserSwitcherProps {
  onUserChange?: () => void;
}

export default function UserSwitcher({ onUserChange }: UserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(currentUser);

  const handleUserSelect = (userId: number) => {
    setCurrentUser(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsOpen(false);
      onUserChange?.();
      // 刷新页面以应用新权限
      window.location.reload();
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-teal-100 rounded-full">
          <i className="ri-user-line text-teal-600"></i>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
          <p className="text-xs text-gray-500">
            {selectedUser.role === 'admin' ? '管理员' : '员工'}
          </p>
        </div>
        <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 mb-2">
                切换用户（测试权限）
              </div>
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedUser.id === user.id ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    <i className={`ri-user-line ${
                      user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                    }`}></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' ? '管理员' : '员工'}
                      </span>
                    </div>
                  </div>
                  {selectedUser.id === user.id && (
                    <i className="ri-check-line text-teal-600"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
