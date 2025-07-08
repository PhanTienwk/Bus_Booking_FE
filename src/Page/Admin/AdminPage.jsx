import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";

const AdminLayout = () => {
    const username = "Admin Dũng";

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 p-6 w-full">
        <AdminTopbar username={username} />
        <div>Xin chào</div>
      </main>
    </div>
  );
};

export default AdminLayout;
