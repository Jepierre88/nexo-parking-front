import { Button } from "@nextui-org/button";
import UsePermissions from "@/app/parking-payment/hooks/UsePermissions";
import React from "react";

interface actionButtonProps {
  permission: number;
  label: string | React.ReactNode;
  onClick: () => void;
}

const ActionButton: React.FC<actionButtonProps> = ({
  permission,
  label,
  onClick,
}) => {
  const { hasPermission, permissions } = UsePermissions();

  if (permissions === null) {
    return null;
  }

  const isAllowed = hasPermission(permission);

  if (!isAllowed) {
    return null;
  }

  return (
    <Button
      onPress={onClick}
      color="primary"
      style={{
        padding: "8px 16px",
        fontSize: "16px",
        lineHeight: "1.5",
        minHeight: "40px",
      }}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
