import { createBrowserRouter, Navigate } from "react-router-dom";
import Notfound from "./views/Notfound";
import Login from "./views/Login";
import Register from "./views/Register";
import GuestLayout from "./Layouts/GuestLayout";
import DefaultLayout from "./Layouts/DefaultLayout";
import Dashboard from "./views/Dashboard";
import Positions from "./views/Positions";
import Department from "./views/Department";
import Employees from "./views/Employees";
import History from "./views/History";
import Reports from "./views/Reports";
import AddExcel from "./views/AddExcel";
import ShowUser from "./views/ShowUser";
import UserDetails from "./views/UserDetails";
import Leave from "./views/Leave";
import Mainhero from "./views/Mainhero";
import Notifications from "./views/Notifications";
import Attendance from "./views/Attendance";
import Hubstaff_members from "./views/Hubstaff_members";
import Compensation from "./views/Payroll_and_Payslip";
import Payslip from "./views/Payslip";
import Paycheck from "./views/Paycheck";
import Payroll from "./views/Payroll";







const router = createBrowserRouter([
      {
        path: "/",
        element: <DefaultLayout />,
        children: [
          { path: "/", element: <Navigate to="/login" /> },
          { path: "/Authenticate", element: <Mainhero />},
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/positions", element: <Positions /> },
          { path: "/department", element: <Department />},
          { path: "/attendance", element: <Attendance />},
          { path: "/employees", element: <Employees />},
          { path: "/employees/add-excel", element: <AddExcel />},
          { path: "/history", element: <History />},
          { path: "/leave", element: <Leave />},
          { path: "/reports", element: <Reports />},
          { path: "/employees/:id/update", element: <ShowUser />},
          { path: "/employees/:id", element: <UserDetails />},
          { path: "/notification", element: <Notifications />},
          { path: "/members", element: <Hubstaff_members />},
          {
            path: "/paycheck",
            element: <Paycheck />,
            children: [
              { path: "rates", element: <Compensation /> },
              { path: "payslip", element: <Payslip /> },
              { path: "payroll", element: <Payroll /> }
            ]
          }
          
 
      
        ]
        
      },
      {
        path: "/",
        element: <GuestLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },

        ]
        
      },
      {
        path: "*",
        element: <Notfound />,
      
      },
    
  ]);


  export { router };