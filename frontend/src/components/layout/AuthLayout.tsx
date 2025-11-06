import React from "react";
import { Outlet } from "react-router-dom";
import { LoggedOutTopBar } from "./LoggedOutTopBar";

export const AuthLayout: React.FC = () => {
  return (
    <div>
      <LoggedOutTopBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
