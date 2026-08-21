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
        name: "Remera",
        descrp: "Remera negra manga corta semi nueva",
        img: "/src/data/img/remera-negra-manga-corta.png",
        stock: 1,
        cat: ["Remera"],
        precio: 5000,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 2,
        name: "Pantalón",
        descrp: "Pantalón corto marrón usado",
        img: "/src/data/img/pantalon-corto-marron.png",
        stock: 1,
        cat: ["Pantalón"],
        precio: 8500,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 3,
        name: "Medias",
        descrp: "Medias largas con dibujo de pollo",
        img: "/src/data/img/medias-pollo.png",
        stock: 5,
        cat: ["Medias"],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 4,
        name: "Gorra",
        descrp: "Gorra blanca plana marca GAP",
        img: "/src/data/img/gorra-blanca.png",
        stock: 3,
        cat: ["Gorra"],
        precio: 1300,
        vendedor: "Ivan Pascualich"
    },
]