export const canDeletUser = (rol:string) : boolean => {
    return rol === "Administrador" ; 
};

export const canEditUser = (rol:string) : boolean => {
    return rol === "Administrador" || rol === "Operador";
}