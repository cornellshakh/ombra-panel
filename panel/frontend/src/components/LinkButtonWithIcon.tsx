import { Button } from "@@/ui/button";
import { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

type LinkButtonWithIconProps = {
  to: string;
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ElementType;
  children: ReactNode;
};

function LinkButtonWithIcon({
  to,
  variant = "default",
  size = "sm",
  className = "",
  onClick,
  icon: Icon,
  children,
}: LinkButtonWithIconProps): JSX.Element {
  return (
    <Link to={to}>
      <Button
        variant={variant}
        size={size}
        className={`${className}`}
        onClick={onClick}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {children}
      </Button>
    </Link>
  );
}

LinkButtonWithIcon.displayName = "LinkButtonWithIcon";
export default LinkButtonWithIcon;
