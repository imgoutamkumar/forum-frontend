import { Menu, Search } from "lucide-react"
import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"

const AdminNavbar = ({ search, setSearch }) => {
  return (
    <div className="w-full h-16 border-b flex items-center justify-between px-4">
      <div className="md:hidden">
        <SidebarTrigger className="cursor-pointer" />
      </div>
      <div className="flex items-center border-2 pl-4 gap-2 bg-white border-gray-500/30 h-[42px] rounded-full overflow-hidden max-w-md w-full">
         <Search />
        <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
         type="text" className="w-full h-full outline-none text-sm text-gray-500" />
        <Button variant="outline" type="button" className="cursor-pointer border-2 border-white hover:border-blue-500 bg-blue-500 h-9 rounded-full text-sm text-white mr-[2px]">Search</Button>
      </div>
    </div>
  )
}

export default AdminNavbar
