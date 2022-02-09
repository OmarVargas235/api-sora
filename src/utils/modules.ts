import { IModule } from '../interfaces/IConfig';

export const modules:IModule[] = [ 
    {
        "access": [1, 2, 3, 4],
        "icon" : "receipt_icon",
        "module" : "Facturación",
        "id" : 1,
        "programs" : [ 
            "Facturas", 
            "Facturas Rapidas", 
            "Recibos de caja", 
            "Vendedores", 
            {
                "name" : "Reportes",
                "children" : [ 
                    "Comisiones", 
                    "Consolidado de productos", 
                    "Facturas por cliente", 
                    "Facturas en mora"
                ]
            }
        ]
    }, 
    {
        "access": [1, 2, 3, 4],
        "icon" : "inventory_icon",
        "module" : "Inventario",
        "id" : 2,
        "programs" : [ 
            "Productos", 
            "Marcas", 
            "Modelo", 
            "Clasificaciones", 
            "Unidad Medida", 
            "Tasa Cambio", 
            {
                "name" : "Reportes",
                "children" : [ 
                    "Kardex", 
                    "Existencia", 
                    "Strock"
                ]
            }
        ]
    }, 
    {
        "access": [1, 2, 3, 4, 5],
        "icon" : "support_agent_icon",
        "module" : "Clientes",
        "id" : 3,
        "programs" : [ 
            "Gestión de clientes", 
            "Cuentas por cobrar ", 
            {
                "name" : "Reportes",
                "children" : []
            }
        ]
    }, 
    {
        "access": [1, 2, 4],
        "icon" : "shop_icon",
        "module" : "Compras",
        "id" : 4,
        "programs" : [ 
            "Lista de compras", 
            "Proveedores", 
            "Cuentas por pagar", 
            {
                "name" : "Reportes",
                "children" : [ 
                    "Compras del dia", 
                    "Compras por fecha", 
                    "Compras por proveedores"
                ]
            }
        ]
    },
    {
        "access": [1, 2, 3],
        "icon" : "moving_icon",
        "module" : "Entradas",
        "id" : 5,
        "programs" : [ 
            "Ajuste de entrada", 
            "Solicitud de traslado", 
            "Compras", 
            "Compras", 
            "Inventario inicial", 
            {}
        ]
    }, 
    {
        "access": [1, 2, 3],
        "icon" : "moving_icon",
        "module" : "Salidas",
        "id" : 6,
        "programs" : [ 
            "Ajuste de salida", 
            "despacho", 
            {}
        ]
    }, 
    {
        "access": [1, 2],
        "icon" : "settings_icon",
        "module" : "Configuración",
        "id" : 7,
        "programs" : [ 
            "Usuarios", 
            "Roles", 
            "Recursos", 
            "Areas", 
            {}
        ]
    }
]