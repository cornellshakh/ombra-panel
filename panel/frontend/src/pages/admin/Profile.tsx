import { useAuthContext } from "@/api/auth/AuthProvider";
import { usePermissions } from "@/api/auth/PermissionProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";

export default function Profile() {
  const { user } = useAuthContext(); // Assuming this is UserIdentity
  const { hasPermission } = usePermissions(); // Use permission context

  const userRoles = user?.roles ?? []; // Roles as strings
  const userPermissions = user?.permissions ?? []; // Permissions as strings

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* User Info */}
      <div className="mb-4 text-lg font-bold">{user?.username}</div>

      {/* Roles Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Roles</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {userRoles.length > 0 ? (
              userRoles.map((role, index) => <li key={index}>{role}</li>) // Roles are strings
            ) : (
              <li>No roles available</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Permissions Card with Checkboxes */}
      <Card>
        <CardHeader>
          <CardTitle>Your Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {userPermissions.length > 0 ? (
              userPermissions.map((permission, index) => (
                <li key={index}>
                  <label>
                    {permission.replace(/_/g, " ")}{" "}
                    {/* Replace underscores with spaces */}
                    {hasPermission(permission) && <span>✅</span>}{" "}
                    {/* Show green checkmark if user has permission */}
                  </label>
                </li>
              ))
            ) : (
              <li>No permissions available - </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
