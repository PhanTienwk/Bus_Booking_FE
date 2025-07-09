import React from "react";

const AdminTopbar = ({ username = "Admin Trần" }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 py-2 px-6 bg-white">
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-gray-100">
          <img
            src="/images/admin_image/menu.png"
            alt="Menu"
            className="w-6 h-6"
          />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <img
          src="/images/admin_image/users.png"
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-gray-700 font-medium">
          Xin chào <b>{username}</b> <span className="ml-1">▾</span>
        </span>
      </div>
    </div>
  );
};

export default AdminTopbar;
