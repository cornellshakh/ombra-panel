import { createContext, useContext, useEffect, useState } from "react";
import { Permission } from "@/lib/schema";
import { useFetchContext } from "@/api/FetchProvider";

type Permissions = Permission[];

interface PermissionContextType {
  permissions: Permissions;
  hasPermission: (permissionName: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  permissions: [],
  hasPermission: () => false,
});

export const usePermissions = () => useContext(PermissionContext);

export const hasPermission = (
  permissionName: string,
  permissions: Permissions
): boolean => {
  return permissions.some((perm) => perm.name === permissionName);
};

export const PermissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { permissions, toggleFetch } = useFetchContext();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  // Trigger fetching permissions only once
  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("permissions"); // Fetch permissions only once
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission: (permissionName: string) =>
          hasPermission(permissionName, permissions),
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
