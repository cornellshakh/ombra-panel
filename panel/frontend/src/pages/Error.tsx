import { useTranslation } from "react-i18next";

type ErrorProps = {
  code: number;
  message?: string;
};

function Error({ code, message }: ErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        {code}
      </span>

      <h2 className="my-2 font-heading text-2xl font-bold">{t("")}</h2>

      <p>{message}</p>
    </div>
  );
}

Error.displayName = "Error";
export default Error;
