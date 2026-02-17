import { Route, Routes } from 'react-router';
import PatientsPage from "./pages/PatientsPage";

const App = () => {
  return (
    <div data-theme="pastel">
      <Routes>
        <Route path="/" element={<PatientsPage />} />
        <Route path="/patients" element={<PatientsPage />} />
      </Routes>
    </div>
  )
}

export default App;