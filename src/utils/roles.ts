export interface IRol {
    name: string;
    id: number;
}

export const roles:IRol[] = [
    {
        name: "superadmin",
        id: 1,
    },
    {
        name: "admin",
        id: 2,
    },
    {
        name: "Gerencia",
        id: 3,
    },
    {
        name: "Cajeros",
        id: 4,
    },
    {
        name: "RRHH",
        id: 5,
    },
];