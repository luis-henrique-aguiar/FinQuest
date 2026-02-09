import React from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
} as const;

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#121212] transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col transition-[margin] duration-300 ease-in-out md:ml-[280px]">
        <TopBar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <motion.main
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={cn(
              "flex-1 w-full max-w-[1400px] mx-auto",
              "p-4 md:p-6 lg:p-8"
            )}
          >
            {children || <Outlet />}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;