import { createContext, ReactNode, useContext } from "react";
import { useApi, useApi2 } from "./api.ts";

interface ApiContextType {
  useApi: typeof useApi;
  useApi2: typeof useApi2;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  return (
    <ApiContext.Provider value={{ useApi, useApi2 }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext(): ApiContextType {
  const context = useContext(ApiContext);
  if (!context)
    throw new Error("useApiContext must be used within an ApiProvider");
  return context;
}
