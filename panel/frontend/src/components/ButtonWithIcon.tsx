import { Button } from "@@/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@@/ui/tooltip";
import {
  AriaRole,
  ElementType,
  forwardRef,
  MouseEvent,
  ReactNode,
} from "react";

type ButtonWithIconProps = {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  role?: AriaRole | undefined;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  icon?: ElementType;
  children?: ReactNode;
  disableTooltip?: boolean;
};

const ButtonWithIcon = forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  (
    {
      variant = "default",
      size = "sm",
      role,
      icon: Icon,
      className,
      onClick,
      disabled,
      children,
      disableTooltip = false,
    },
    ref
  ) => {
    const button = (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        role={role}
        className={`flex items-center justify-center ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {Icon && <Icon size={16} className="mr-0 xl:mr-2" />}
        <span className="hidden xl:inline">{children}</span>
      </Button>
    );

    if (disableTooltip) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          className="hidden xl:inline-block"
          side="bottom"
          align="center"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    );
  }
);

ButtonWithIcon.displayName = "ButtonWithIcon";
export default ButtonWithIcon;
