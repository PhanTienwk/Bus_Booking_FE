
const AdminTopbar = ({ username }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
      <h1 className="text-xl font-semibold text-gray-700">Trang quản trị</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">👋 Xin chào, <b>{username}</b></span>
        <img
          src="/images/avatar.png" // hoặc avatar của user
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default AdminTopbar;
