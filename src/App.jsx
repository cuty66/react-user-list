
import './App.css'
import {Routes , Route} from "react-router-dom";
import UsersPage from './pages/UsersPage';
import UserDetail from './components/UserDetail';
import NotFound from './pages/NotFound';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import GuestRoute from './components/GuestRoute';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />

        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      </Routes>
    </>
  )
}

export default App
