import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import FamilyTree from './pages/FamilyTree';
import PersonList from './pages/PersonList';
import PersonForm from './pages/PersonForm';
import PersonDetails from './pages/PersonDetails';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* AuthLayout is now unused, but keeping it if needed later */}
        {/* <Route element={<AuthLayout />}>
        </Route> */}

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tree" element={<FamilyTree />} />
          <Route path="/people" element={<PersonList />} />
          <Route path="/people/new" element={<PersonForm />} />
          <Route path="/people/:id" element={<PersonDetails />} />
          <Route path="/people/:id/edit" element={<PersonForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Add more protected routes here */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
