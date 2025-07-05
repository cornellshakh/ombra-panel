import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@@/ui/breadcrumb";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

function DynamicBreadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{t("common.home")}</BreadcrumbLink>
        </BreadcrumbItem>

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          const label = capitalize(value.replace(/-/g, " "));

          return (
            <Fragment key={to}>
              <BreadcrumbSeparator />
              {isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink href={to}>{label}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

DynamicBreadcrumb.displayName = "DynamicBreadcrumb";
export default DynamicBreadcrumb;
