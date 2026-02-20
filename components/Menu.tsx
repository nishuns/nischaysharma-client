'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Contact', href: '#contact' },
];

export default function Menu({ isOpen, onClose }: MenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-sm font-sans tracking-[2px] text-black uppercase hover:opacity-50 transition-all"
          >
            — Close
          </button>

          {/* Menu Items */}
          <nav className="flex flex-col items-center gap-8">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="font-serif text-5xl md:text-7xl text-black hover:text-[#E57373] transition-colors uppercase tracking-widest font-light italic"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Social Links or Footer info in Menu */}
          <div className="absolute bottom-12 flex gap-8">
            {['Instagram', 'LinkedIn', 'Twitter'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-[10px] tracking-[2px] text-neutral-400 uppercase hover:text-black transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
