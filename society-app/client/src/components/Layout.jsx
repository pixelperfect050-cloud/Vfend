import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/flats', label: 'Flats', icon: '🏘️' },
    { path: '/payments', label: 'Bills', icon: '💳' },
    { path: '/funds', label: 'Funds', icon: '💰' },
    { path: '/expenses', label: 'Costs', icon: '📉' }
  ];

  const sidebarItems = [
    ...menuItems,
    { path: '/reports', label: 'Reports', icon: '📊' },
    { path: '/notifications', label: 'Alerts', icon: '🔔' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const adminItems = [
    { path: '/member-requests', label: 'Requests', icon: '👤' },
    { path: '/verify-payments', label: 'Verify', icon: '✅' },
    { path: '/blocks', label: 'Blocks', icon: '🏗️' }
  ];

  const allSidebarItems = user?.role === 'admin' ? [...sidebarItems, ...adminItems] : sidebarItems;

  return (
    <div className="app-layout">
      {/* Premium Mobile Header */}
      <header className="mobile-header lg:hidden">
        <div className="flex items-center gap-3">
          <span className="logo-icon">🏘️</span>
          <span className="logo-text">SocietySync</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="p-2 text-xl">🔔</Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-xl">☰</button>
        </div>
      </header>

      {/* Modern Desktop Sidebar / Mobile Drawer */}
      <aside className={`
        fixed inset-0 z-[1000] lg:relative lg:flex
        ${isSidebarOpen ? 'visible' : 'invisible lg:visible'}
      `}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div className={`
          relative w-72 bg-white h-full border-r border-slate-200 p-6 flex flex-col
          transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center gap-3 mb-10 px-2">
            <span className="logo-icon">🏘️</span>
            <span className="logo-text text-xl">SocietySync</span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {allSidebarItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all
                  ${location.pathname === item.path 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-500 hover:bg-slate-50'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={logout}
              className="flex items-center gap-4 px-4 py-4 w-full rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <span className="text-xl">🚪</span>
              <span className="text-sm uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation for Mobile */}
      <nav className="bottom-nav lg:hidden">
        {menuItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
