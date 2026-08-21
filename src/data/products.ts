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
        img: "src\data\img\remera-negra-manga-corta.png",
        stock: 1,
        cat: ["remera manga corta"],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 2,
        name: "pantalon",
        descrp: "Pantalon corto marron usado",
        img: "src/img/pantalon-corto-marron.png",
        stock: 1,
        cat: ["pantalon largo"],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 3,
        name: "medias",
        descrp: "medias largas con dibujo de pollo",
        img: "src/img/medias-pollo.png",
        stock: 5,
        cat: ["soquete"],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 4,
        name: "gorra",
        descrp: "gorra blanca plana marca GAP",
        img: "src\img\gorra-blanca.png",
        stock: 3,
        cat: ["gorra plana"],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
]