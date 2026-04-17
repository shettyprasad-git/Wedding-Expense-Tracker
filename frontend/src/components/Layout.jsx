import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-soft-gradient text-foreground font-sans selection:bg-primary/20">
      {/* SaaS Frame: Fixed Top Navbar */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* SaaS Frame: Sidebar (Responsive) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="lg:pl-72 pt-20 transition-all duration-500 min-h-screen relative overflow-x-hidden">
        {/* Modern SaaS background flourishes */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in duration-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Branded Footer */}
        <footer className="mt-auto py-12 text-center opacity-30 border-t border-primary/5 mx-12">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Wedding Planner Pro © 2026</p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
