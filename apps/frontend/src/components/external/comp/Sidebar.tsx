import { ReactNode } from "react";
const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-[15vw] h-screen py-12 px-4 overflow-auto">{children}</div>
  );
};

export default Sidebar;
