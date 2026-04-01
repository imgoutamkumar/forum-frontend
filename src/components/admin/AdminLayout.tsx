import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useState } from 'react';

const AdminLayout = () => {

  const [open, setOpen] = useState(false)
const [search, setSearch] = useState("");
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar/>
      <div className="flex-1 h-screen min-w-0 overflow-hidden">
        <AdminNavbar search={search} setSearch={setSearch} />
        <div className="p-2 sm:p-4 w-full h-[calc(100vh-64px)] overflow-auto">
          <Outlet context={{ search }} />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
