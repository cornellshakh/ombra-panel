import { useFetchContext } from "@/api/FetchProvider";
import { getUser } from "@/api/users";
import { User } from "@/lib/schema";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@@/ui/avatar";
import { Button } from "@@/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@@/ui/hover-card";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type HoverUserCardProps = {
  userId: number;
};

function HoverUserCard({ userId }: HoverUserCardProps) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const { settings } = useFetchContext();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getUser(userId);
        setUserData(user);
      } catch (error) {
        setUserData(undefined);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) return <div>{t("form.placeholder.loading")}</div>;
  if (!userData) return <div>{t("error.user_not_found")}</div>;

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link to={`/user/${userId}`}>
            <Button variant="link">{userData.username}</Button>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex space-x-4">
            <Avatar>
              <AvatarFallback>
                {userData.username.charAt(0).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{userData.username}</h4>
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <div className="text-xs text-muted-foreground">
                  {t("component.HoverUserCard.member_since")}{" "}
                  {formatDate(
                    new Date(userData.registerDate!),
                    settings.language,
                    settings.date
                  )}
                </div>
              </div>
              <Link to={`/user/${userId}`}>
                {t("component.HoverUserCard.view_profile")}
              </Link>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

HoverUserCard.displayName = "HoverUserCard";
export default HoverUserCard;
