// import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import NewOrder from './pages/NewOrder';
// import Orders from './pages/Orders';
// import Inventory from './pages/Inventory';

// const Private = ({ children }) => (useAuth().user ? children : <Navigate to="/login" replace />);

// function Nav() {
//   const { user, logout } = useAuth();
//   if (!user) return null;
//   return (
//     <nav className="navbar navbar-expand navbar-lms px-3">
//       <span className="navbar-brand fw-semibold">Laundry Manager</span>
//       <div className="navbar-nav me-auto">
//         {[['/', 'Dashboard'], ['/orders/new', 'New order'], ['/orders', 'Orders'], ['/inventory', 'Supplies']].map(([to, l]) =>
//           <NavLink key={to} end to={to} className="nav-link">{l}</NavLink>)}
//       </div>
//       <span className="text-white-50 me-3 small">{user.name} ({user.role})</span>
//       <button className="btn btn-sm btn-outline-light" onClick={logout}>Log out</button>
//     </nav>
//   );
// }

// export default function App() {
//   return (<>
//     <Nav />
//     <main className="container py-4">
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Private><Dashboard /></Private>} />
//         <Route path="/orders/new" element={<Private><NewOrder /></Private>} />
//         <Route path="/orders" element={<Private><Orders /></Private>} />
//         <Route path="/inventory" element={<Private><Inventory /></Private>} />
//       </Routes>
//     </main>
//   </>);
// }
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';

const Private = ({ children }) => (useAuth().user ? children : <Navigate to="/login" replace />);

function Nav() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const links = [['/', 'Dashboard'], ['/orders/new', 'New order'], ['/orders', 'Orders'], ['/inventory', 'Supplies']];
  if (user.role === 'admin') links.push(['/staff', 'Staff']);
  return (
    <nav className="navbar navbar-expand navbar-lms px-3">
      <span className="navbar-brand fw-semibold">Laundry Manager</span>
      <div className="navbar-nav me-auto">
        {links.map(([to, l]) => <NavLink key={to} end to={to} className="nav-link">{l}</NavLink>)}
      </div>
      <span className="text-white-50 me-3 small">{user.name} ({user.role})</span>
      <button className="btn btn-sm btn-outline-light" onClick={logout}>Log out</button>
    </nav>
  );
}

export default function App() {
  return (<>
    <Nav />
    <main className="container py-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Private><Dashboard /></Private>} />
        <Route path="/orders/new" element={<Private><NewOrder /></Private>} />
        <Route path="/orders" element={<Private><Orders /></Private>} />
        <Route path="/inventory" element={<Private><Inventory /></Private>} />
        <Route path="/staff" element={<Private><Staff /></Private>} />
      </Routes>
    </main>
  </>);
}