import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-soft-gradient text-foreground relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Hamburger Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 left-6 z-30 p-3 bg-white/80 border border-primary/10 rounded-2xl shadow-lg lg:hidden text-primary hover:bg-white transition-all"
      >
        <Menu size={24} />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 w-full lg:pl-72 p-6 md:p-12 relative min-h-screen max-w-full overflow-x-hidden">
        {/* Subtle background flourishes */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-secondary/5 rounded-full blur-[60px] md:blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10 pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
