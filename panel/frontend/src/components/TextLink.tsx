import { Link } from "react-router-dom";

type TextLinkProps = {
  text: string;
  to: string;
  className?: string;
};

function TextLink({ to, text, className }: TextLinkProps) {
  return (
    <Link to={to} className={`text-sm underline ${className || ""}`}>
      {text}
    </Link>
  );
}

TextLink.displayName = "TextLink";
export default TextLink;
