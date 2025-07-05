import { useApi, useApi2 } from "@/api/api";
import {
  Discount,
  Game,
  GameType,
  Key,
  Listing,
  Permission,
  Role,
  ServerLog,
  Session,
  Settings,
  Suspension,
  User,
} from "@/lib/schema";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "./auth/AuthProvider";
import { preprocessKeyData } from "./keys";
import { preprocessLogData } from "./logs";
import { preprocessSessionData } from "./sessions";
import { preprocessSuspensionData } from "./suspensions";
import { preprocessUserData } from "./users";

type TriggerType =
  | "users"
  | "suspensions"
  | "keys"
  | "logs"
  | "sessions"
  | "roles"
  | "permissions"
  | "games"
  | "gameTypes"
  | "settings"
  | "listings"
  | "discounts";
type TriggerState = Record<TriggerType, boolean>;

interface FetchState {
  users: User[];
  suspensions: Suspension[];
  keys: Key[];
  logs: ServerLog[];
  sessions: Session[];
  roles: Role[];
  permissions: Permission[];
  games: Game[];
  gameTypes: GameType[];
  listings: Listing[];
  discounts: Discount[];
  settings: Settings;
}

interface FetchContextType extends FetchState {
  toggleFetch: (entity: TriggerType) => void;
}

const FetchContext = createContext<FetchContextType | undefined>(undefined);

interface FetchProviderProps {
  children: ReactNode;
}

export function FetchProvider({ children }: FetchProviderProps) {
  const { user, isAuthenticated } = useAuthContext();
  const { i18n } = useTranslation();

  const [triggerFetch, setTriggerFetch] = useState<TriggerState>({
    users: false,
    suspensions: false,
    keys: false,
    logs: false,
    sessions: false,
    roles: false,
    permissions: false,
    games: false,
    gameTypes: false,
    listings: false,
    discounts: false,
    settings: false,
  });

  const users = useApi<User>(
    "/fetch_users",
    isAuthenticated && triggerFetch.users
  ).map(preprocessUserData);
  const suspensions = useApi<Suspension>(
    "/fetch_suspensions",
    isAuthenticated && triggerFetch.suspensions
  ).map(preprocessSuspensionData);
  const keys = useApi<Key>(
    "/fetch_keys",
    isAuthenticated && triggerFetch.keys
  ).map(preprocessKeyData);
  const logs = useApi<ServerLog>(
    "/fetch_server_logs",
    isAuthenticated && triggerFetch.logs
  ).map(preprocessLogData);
  const sessions = useApi<Session>(
    "/fetch_sessions",
    isAuthenticated && triggerFetch.sessions
  ).map(preprocessSessionData);
  const roles = useApi<Role>(
    "/fetch_roles",
    isAuthenticated && triggerFetch.roles
  );
  const permissions = useApi<Permission>(
    "/fetch_permissions",
    isAuthenticated && triggerFetch.permissions
  );

  const games = useApi<Game>(
    "/fetch_games",
    isAuthenticated && triggerFetch.games
  );
  const gameTypes = useApi<GameType>(
    "/fetch_game_types",
    isAuthenticated && triggerFetch.gameTypes
  );
  const listings = useApi<Listing>(
    "/fetch_listings",
    isAuthenticated && triggerFetch.listings
  );
  const discounts = useApi<Discount>(
    "/fetch_discounts",
    isAuthenticated && triggerFetch.discounts
  );
  const settings = useApi2<Settings>(
    `/fetch_user_settings/${user?.userId}`,
    isAuthenticated && triggerFetch.settings
  );

  useEffect(() => {
    if (settings && settings.language) {
      const currentLanguage = localStorage.getItem("i18nextLng");

      if (settings.language !== currentLanguage)
        i18n.changeLanguage(settings.language);
    }
  }, [settings]);

  function toggleFetch(entity: TriggerType) {
    setTriggerFetch((prev) => ({ ...prev, [entity]: true }));

    setTimeout(() => {
      setTriggerFetch((prev) => ({ ...prev, [entity]: false }));
    }, 100);
  }

  return (
    <FetchContext.Provider
      value={{
        toggleFetch,
        users,
        suspensions,
        keys,
        logs,
        sessions,
        roles,
        permissions,
        games,
        gameTypes,
        listings,
        discounts,
        settings,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
}

export function useFetchContext(): FetchContextType {
  const context = useContext(FetchContext);
  if (!context)
    throw new Error("useFetchContext must be used within a FetchProvider");
  return context;
}
