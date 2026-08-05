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
        img: "https://acdn-us.mitiendanube.com/stores/005/656/704/products/freepik__img1-transforma-la-remera-manga-corta-cuello-en-v-__76738-2107ab8e21673fda4e17622966365630-1024-1024.webp",
        stock: 1,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 2,
        name: "pantalon",
        descrp: "Pantalon corto marron usado",
        img: "https://http2.mlstatic.com/D_NQ_NP_670806-MLA111364023530_052026-O.webp",
        stock: 1,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 3,
        name: "medias",
        descrp: "medias largas con dibujo de pollo",
        img: "https://bydesko.com/custom/uploads/products/89281_mediaslargaspollito.jpg",
        stock: 5,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 4,
        name: "gorra",
        descrp: "gorra blanca plana marca GAP",
        img: "https://images.asos-media.com/products/gorra-blanco-tiza-con-logo-de-gap/207190278-1-grey?$n_640w$&wid=513&fit=constrain",
        stock: 3,
        cat: [""],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
]