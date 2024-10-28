import { User } from './../../types/index';
interface Role {
    key:string; 
    label:string
}
export const roles:Role[] = [
    {key: "Administrador", label: "Administrador"},
    {key: "Operador", label: "Operador"},
    {key: "user", label:"Usuario"},
    {key: "Consultor", label:"Consultor"},
]