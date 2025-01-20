"use client";

import UseRelationPermissions from "@/app/hooks/UseRelationPermissions";
export default function ListPermissions() {
  const { permissionsById } = UseRelationPermissions(1);

  return (
    <section>
      {permissionsById?.length > 0 ? (
        permissionsById.map((relationpermissions, i) => (
          <div
            key={relationpermissions.id || i}
            className="flex flex-col items-start w-98 gap-2"
          >
            <div className="flex justify-between gap-2 items-start w-98">
              <label>Los id de la relacion son: </label>
              <label>{relationpermissions.id}</label>
            </div>
            <div className="flex justify-between gap-2 items-start w-98">
              <label>el rol es: </label>
              <label>{relationpermissions.rolId}</label>
            </div>
            <div className="flex justify-between gap-2 items-start w-98">
              <label>el permiso que tiene es: </label>
              <label>{relationpermissions.permissionsId}</label>
            </div>
          </div>
        ))
      ) : (
        <p>No hay permisos disponibles</p>
      )}
    </section>
  );
}
