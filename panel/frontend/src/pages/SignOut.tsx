import { signOutUser } from "@/api/auth/auth";
import { useAuthContext } from "@/api/auth/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthContext();

  useEffect(() => {
    async function signout() {
      await signOutUser(navigate);
      checkAuthStatus(true);
    }
    signout();
  }, [navigate]);

  return null;
}
