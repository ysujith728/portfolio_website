"use client";

import { motion } from "framer-motion";

export default function Navbar() {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 backdrop-blur-md bg-white/10 border border-white/20 px-8 py-3 rounded-full shadow-lg z-50"
    >
      <ul className="flex gap-8 text-white font-medium">

        <li>
          <button onClick={() => scrollToSection("home")} className="hover:text-purple-400 transition">
            Home
          </button>
        </li>

        <li>
          <button onClick={() => scrollToSection("about")} className="hover:text-purple-400 transition">
            About
          </button>
        </li>

        <li>
          <button onClick={() => scrollToSection("projects")} className="hover:text-purple-400 transition">
            Projects
          </button>
        </li>

        <li>
          <button onClick={() => scrollToSection("skills")} className="hover:text-purple-400 transition">
            Skills
          </button>
        </li>

      </ul>
    </motion.nav>
  );
}