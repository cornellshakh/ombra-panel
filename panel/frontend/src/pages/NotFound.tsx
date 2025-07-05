import { Button } from "@@/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center w-full text-center mt-56">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-6xl md:text-[10rem] font-extrabold leading-none text-transparent">
        404
      </span>

      <h2 className="mt-4 mb-2 text-xl md:text-2xl font-heading font-bold">
        {t("error.page_not_found.title")}
      </h2>

      <p className="px-4 text-sm md:text-base">
        {t("error.page_not_found.description")}
      </p>

      <Button className="mt-4" onClick={() => navigate(-1)}>
        {t("button.return")}
      </Button>
    </div>
  );
}

NotFound.displayName = "NotFound";
export default NotFound;
