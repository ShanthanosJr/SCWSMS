import 'bootstrap/dist/css/bootstrap.min.css';
import ToolHome from './Admin/Pages/ToolHome';
import ToolManagement from './Admin/Pages/ToolManagement';
import ToolStatusManagement from './Admin/Pages/ToolStatusManagement';
import RentalManagement from './Admin/Pages/RentalManagement';
import ToolSelection from './User/Pages/ToolSelection';
import RentTool from './User/Pages/RentTool';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<ToolHome />} />
        <Route path="/admin/tools" element={<ToolManagement />} />
        <Route path="/admin/tools/:toolId/status" element={<ToolStatusManagement />} />
        <Route path="/admin/rentals" element={<RentalManagement />} />
        
        {/* User Routes */}
        <Route path="/user/tools" element={<ToolSelection />} />
        <Route path="/user/rent/:toolId" element={<RentTool />} />
      </Routes>
    </Router>
  );
}

export default App;
