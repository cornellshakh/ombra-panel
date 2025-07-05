import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import { useTheme } from "@@/ThemeProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@@/ui/tooltip";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  children?: React.ReactNode;
};

function Sidebar({ children }: SidebarProps) {
  const { theme } = useTheme();
  const [logo, setLogo] = useState(logoLight);

  useEffect(() => {
    const setThemeLogo = () => {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (theme === "system") {
        setLogo(isDarkMode ? logoDark : logoLight);
      } else {
        setLogo(theme === "dark" ? logoDark : logoLight);
      }
    };

    setThemeLogo();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", setThemeLogo);

    return () => mediaQuery.removeEventListener("change", setThemeLogo);
  }, [theme]);

  return (
    <aside className="min-w-20 w-1/6 h-screen bg-background border-r">
      <nav className="flex flex-col h-full">
        <div className="flex justify-center py-4">
          <Link to="/dashboard">
            <img
              src={logo}
              alt="Logo"
              className="overflow-hidden w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 duration-200"
            />
          </Link>
        </div>
        <ul>{children}</ul>
      </nav>
    </aside>
  );
}

Sidebar.displayName = "Sidebar";
export { Sidebar };

type SidebarLabelProps = {
  text: string;
};

function SidebarLabel({ text }: SidebarLabelProps) {
  return (
    <div className="hidden xl:flex items-center justify-start mx-2 py-1 lg:mt-2 px-6 rounded-lg duration-200 font-regular whitespace-nowrap">
      <span className="text-sm font-bold text-gray-500">{text}</span>
    </div>
  );
}

SidebarLabel.displayName = "SidebarLabel";
export { SidebarLabel };

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  to: string;
};

function SidebarButton({ icon, text, to }: SidebarItemProps) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to}>
      <li
        className={`font-regular cursor-pointer flex items-center justify-center whitespace-nowrap rounded-lg xl:justify-start mx-4 my-2.5 px-6 py-2.5 lg:py-3 duration-200
      ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-primary hover:text-primary-foreground"
      }`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{icon}</div>
          </TooltipTrigger>
          <TooltipContent
            className="inline xl:hidden"
            side="right"
            align="center"
          >
            {text}
          </TooltipContent>
        </Tooltip>

        <div className="hidden xl:flex ml-2">{text}</div>
      </li>
    </Link>
  );
}

SidebarButton.displayName = "SidebarButton";
export { SidebarButton };
