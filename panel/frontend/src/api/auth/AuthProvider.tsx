import { UserIdentity } from "@/lib/schema"; // Import UserIdentity
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchAuth } from "./auth"; // Assume this now fetches UserIdentity

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserIdentity | null; // Use UserIdentity instead of User
}

interface AuthContextType extends AuthState {
  checkAuthStatus: (logout?: boolean) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus(logout?: boolean): Promise<boolean> {
    setLoading(true); // Set loading to true before checking auth status
    try {
      const status = await fetchAuth(logout); // fetchAuth now returns UserIdentity

      setAuthState({
        isAuthenticated: status.isAuthenticated,
        user: status.user, // This is now UserIdentity
      });

      setLoading(false); // Set loading to false after status is checked

      return status.isAuthenticated;
    } catch (error) {
      console.error(error);
      setAuthState({ isAuthenticated: false, user: null });
      setLoading(false);
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ ...authState, loading, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuthContext must be used within an AuthProvider");

  return context;
}
