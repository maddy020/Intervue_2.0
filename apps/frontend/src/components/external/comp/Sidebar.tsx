import { ReactNode } from "react";
const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-92 h-[100vh] pt-6 border-r-8 border-[#242424] ">
      {children}
    </div>
  );
};

export default Sidebar;
