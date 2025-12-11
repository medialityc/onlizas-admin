"use client";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/themeConfigSlice";
import { useDispatch, useSelector } from "react-redux";

const Overlay = () => {
  const themeConfig = useSelector((state: RootState) => state.themeConfig);
  const dispatch = useDispatch();
  return (
    <>
      {/* sidebar menu overlay */}
      <div
        className={`${themeConfig.sidebar ? "opacity-100" : "opacity-0 pointer-events-none"} 
                    fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity duration-300`}
        onClick={() => dispatch(toggleSidebar())}
        aria-hidden={!themeConfig.sidebar}
      ></div>
    </>
  );
};

export default Overlay;
