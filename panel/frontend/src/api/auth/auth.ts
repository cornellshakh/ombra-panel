import { UserIdentity } from "@/lib/schema";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, ApiResponse, handleAuthOperation } from "../api";

export async function signUpUser(
  username: string,
  email: string,
  password: string,
  navigate: Function,
  navigateTo: string
): Promise<void> {
  const response = await apiPost<ApiResponse<string>>("/sign_up", {
    username,
    email,
    password,
  });

  await handleAuthOperation(
    `User has been signed up successfully.`,
    `Failed to sign up user. Please try again.`,
    response,
    navigate,
    navigateTo,
    undefined
  );
}

export async function signInUser(
  username: string,
  password: string,
  rememberMe: boolean = false,
  navigate: Function,
  navigateTo: string,
  checkAuthStatus: () => Promise<boolean>
): Promise<void> {
  // Validate inputs
  if (!username || typeof username !== 'string') {
    console.error('Invalid username:', username);
    throw new Error('Username is required');
  }
  
  if (!password || typeof password !== 'string') {
    console.error('Invalid password (empty or wrong type)');
    throw new Error('Password is required');
  }
  
  // Ensure rememberMe is boolean
  const rememberMeValue = Boolean(rememberMe);
  
  // Log login attempt (without password)
  console.log('Attempting login with:', { 
    username, 
    rememberMe: rememberMeValue,
    navigateTo
  });
  
  try {
    const response = await apiPost<ApiResponse<string>>(
      "/sign_in",
      { 
        username, 
        password, 
        rememberMe: rememberMeValue 
      },
      "include"
    );

    await handleAuthOperation(
      "Signed in successfully.",
      `Failed to sign in user. Please try again.`,
      response,
      navigate,
      navigateTo,
      checkAuthStatus
    );
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOutUser(navigateTo: Function): Promise<void> {
  const response: string = await apiPost("/sign_out", undefined, "include");

  await handleAuthOperation(
    "User signed out successfully.",
    "Failed to sign out user. Please try again.",
    response,
    navigateTo,
    "/signIn"
  );
}

// Type to handle AuthStatus
type AuthStatus = { isAuthenticated: boolean; user: UserIdentity | null }; // Use UserIdentity here

export async function fetchAuth(logout: boolean = false): Promise<AuthStatus> {
  if (logout) return { isAuthenticated: false, user: null };

  const response = await apiGet<AuthStatus>("/auth_status", "include");
  console.log(response);

  return {
    isAuthenticated: response.isAuthenticated,
    user: response.user
      ? {
          userId: response.user.userId,
          username: response.user.username,
          email: response.user.email,
          roles: response.user.roles, // Assuming roles are just strings
          permissions: response.user.permissions, // Assuming permissions are strings
        }
      : null,
  };
}

interface ErrorData {
  message: string;
}

function handleErrorResponse(
  errorData: ErrorData,
  statusCode: number,
  navigate: (path: string) => void
): void {
  switch (statusCode) {
    case 403:
      alert("Access denied: " + errorData.message);
      navigate("/");
      break;
    case 404:
      alert("Error: " + errorData.message);
      break;
    case 500:
      alert("Server error. Please try again later.");
      break;
    default:
      alert("An error occurred: " + errorData.message);
  }
}

export function useFetchData() {
  const navigate = useNavigate();

  async function fetchData<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: ErrorData = await response.json();
        handleErrorResponse(errorData, response.status, navigate);
        return null;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("Network error:", error);
      return null;
    }
  }

  return fetchData;
}
