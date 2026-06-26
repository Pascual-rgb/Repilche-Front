export interface Products {
    id: number;
    name: String,
    descrp: String,
    img: String,
    stock: number,
    cat: String[],
    precio: number,
    vendedor: string,
};

export const productos : Products[] = [
    {
        id: 1,
        name: "remera",
        descrp: "remera negra manga corta semi nueva",
        img: "",
        stock: 1,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 2,
        name: "pantalon",
        descrp: "Pantalon corto marron usado",
        img: "",
        stock: 1,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 3,
        name: "medias",
        descrp: "medias largas con dibujo de pollo",
        img: "",
        stock: 5,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 4,
        name: "gorra",
        descrp: "gorra blanca plana marca GAP",
        img: "",
        stock: 3,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
]