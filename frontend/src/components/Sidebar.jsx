import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UploadCloud, History, BrainCircuit } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      name: 'Home Page',
      path: '/',
      icon: Home,
    },
    {
      name: 'AI Image Classifier',
      path: '/upload',
      icon: UploadCloud,
    },
    {
      name: 'Analysis History',
      path: '/history',
      icon: History,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-slate-400">
      <div className="px-4 py-6">
        {/* Navigation title */}
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Core Navigation
        </p>

        {/* Navigation list */}
        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isOpen && toggleSidebar()}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 p-4 text-center border border-slate-700/50">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-slate-700 text-indigo-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h4 className="mt-2 text-xs font-bold text-white">AI Image Classifier</h4>
          <p className="mt-1 text-[10px] text-slate-500 leading-normal">
            <a href="https://github.com/Meesamabbasnaqvi">Meesam Abbas Naqvi</a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden"
        ></div>
      )}

      {/* Desktop/Permanent Sidebar (Left) */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 w-64 transform bg-slate-900 transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
