interface View {
    viewName: string;
    permissonId: number;
    href:string; 

}

interface BarItem{
    name:string;
    key:number;
    views:View[];
}

export const barItems:BarItem[] = [
    {
        name:"Administración",
        key:1,
        views:  [
            {
                //accederrrrrrrrrrrrrrrrrrr
                permissonId:1,
                viewName:"Usuarios",
                href:"/parking-payment/users",
            },
        ]
    },

    {
        name:"Operación",
        key:2,
        views: [
            {
                permissonId:2,
                viewName:"Ingresos",
                href:"/parking-payment/operations/incomes",
            },
            {
                permissonId:3,
                viewName:"Salidas",
                href:"/parking-payment/operations/outcomes",
            },
            {
                permissonId:4,
                viewName:"Preocesos de pago",
                href:"/parking-payment",
            },
            {
                permissonId:5,
                viewName:"Transacciones",
                href:"/parking-payment/operations/transaction"
            },
            {
                permissonId:6,
                viewName:"Realizar cierre",
                href:"/parking-payment/operations/parkingClosure",
            }
        ]
    },

    {
        name:"Ingreso Manual Por Placa",
        key:3,
        views: [
            {
                permissonId:7,
                viewName:"Ingreso manual por placa",
                href: "/parking-payment/ingresoSalida",
            }
        ]
    },

    {
        name:"Cerrar sesión",
        key:4,
        views:[]
    } 
]
