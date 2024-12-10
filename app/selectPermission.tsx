import React from "react";
import UsePermissions from "@/app/hooks/UsePermissions";

interface SelectPermissionProps {
  permission: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SelectPermission: React.FC<SelectPermissionProps> = ({
  permission,
  disabled = false,
  children,
  className = "",
}) => {
  const { hasPermission, permissions } = UsePermissions();

  if (permissions === null) {
    return null;
  }

  const isAllowed = hasPermission(permission);

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width: "100%",
      }}
    >
      {isAllowed ? (
        <select disabled={disabled} className={className}>
          {children}
        </select>
      ) : null}
    </div>
  );
};

export default SelectPermission;
