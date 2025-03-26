import React from "react";
import UsePermissions from "@/app/hooks/UsePermissions";
import { SelectItem, Select } from "@nextui-org/select";

interface SelectPermissionProps {
  permission: number;
  roles: Array<{ name: string }>;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
  placeholder?: string;
  selectedKeys?: Set<string>;
  variant?: string;
}

const SelectPermission: React.FC<SelectPermissionProps> = ({
  permission,
  roles,
  onChange,
  isDisabled = false,
  className = "",
  placeholder = "Selecciona  una opción",
  selectedKeys = new Set<string>(),
  variant = "faded",
}) => {
  const { hasPermission, permissions } = UsePermissions();

  if (permissions === null) {
    return null; // No se muestran roles si los permisos aún no se cargan
  }

  const isAllowed = hasPermission(permission);

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
      }}
    >
      {isAllowed ? (
        <Select
          className={`ml-4 w-2/3 ${className}`}
          isDisabled={isDisabled}
          placeholder={placeholder}
          selectedKeys={selectedKeys}
          variant="faded"
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            if (onChange) {
              onChange(value);
            }
          }}
        >
          {roles.length > 0 ? (
            roles.map((rol) => (
              <SelectItem key={rol.name} value={rol.name}>
                {rol.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem key="cargando" value="">
              Cargando roles...
            </SelectItem>
          )}
        </Select>
      ) : null}
    </div>
  );
};

export default SelectPermission;
