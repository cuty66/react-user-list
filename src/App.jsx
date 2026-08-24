
import './App.css'
import {Routes , Route} from "react-router-dom";
import UsersPage from './pages/UsersPage';
import UserDetail from './components/UserDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
