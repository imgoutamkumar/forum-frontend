import DashboardCards from "@/components/admin/DashboardCards"
import DashboardDataTable from "@/components/admin/DashboardDataTable"

import data from "@/data/data.json"
import pastPerformanceData from "@/data/past-performance-data.json"
import keyPersonnelData from "@/data/key-personnel-data.json"
import focusDocumentsData from "@/data/focus-documents-data.json"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
  const navigate = useNavigate()
  return (
    <div className="h-full w-full">
      <div className="p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold pb-8">Admin Dashboard</h1>
          <Button
            className="rounded-full"
            type="button"
            onClick={()=>(navigate({pathname:"/admin/thread/new"}))}
          >
            + Create New Thread
          </Button>
        </div>

        <DashboardCards />
      </div>
      <div>
        <DashboardDataTable
          data={data}
          pastPerformanceData={pastPerformanceData}
          keyPersonnelData={keyPersonnelData}
          focusDocumentsData={focusDocumentsData}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
