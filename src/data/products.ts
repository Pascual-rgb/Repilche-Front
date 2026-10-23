export interface Products {
    id: number;
    name: string,
    descrp: string,
    img: string,
    stock: number,
    cat: string[],
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
        cat: ["Accesorio"],
        precio: 3400,
        vendedor: "Ivan Pascualich"
    },
    {
        id: 4,
        name: "Gorra",
        descrp: "Gorra blanca plana marca GAP",
        img: "/src/data/img/gorra-blanca.png",
        stock: 3,
        cat: ["Accesorio"],
        precio: 1300,
        vendedor: "Ivan Pascualich"
    },
    {
    id: 5,
    name: "Campera",
    descrp: "Campera de jean azul con forro interior, buen estado",
    img: "/src/data/img/campera-jean.png",
    stock: 1,
    cat: ["Abrigo"],
    precio: 15000,
    vendedor: "Martina Saavedra"
    },
    {
    id: 6,
    name: "Zapatillas",
    descrp: "Zapatillas blancas deportivas, ligeras y cómodas",
    img: "/src/data/img/zapatillas-blancas.png",
    stock: 1,
    cat: ["Calzado"],
    precio: 22000,
    vendedor: "Martina Saavedra"
    },
    {
    id: 7,
    name: "Buzo",
    descrp: "Buzo oversize gris con capucha, tela polar",
    img: "/src/data/img/buzo-gris.png",
    stock: 2,
    cat: ["Abrigo"],
    precio: 12000,
    vendedor: "Martina Saavedra"
    },
    {
    id: 8,
    name: "Vestido",
    descrp: "Vestido estampado floral, talle único, verano",
    img: "/src/data/img/vestido-floral.png",
    stock: 1,
    cat: ["Vestido"],
    precio: 9500,
    vendedor: "Martina Saavedra"
    },
    {
    id: 9,
    name: "Camisa",
    descrp: "Camisa blanca de lino, fresca y elegante",
    img: "/src/data/img/camisa-blanca.png",
    stock: 1,
    cat: ["Camisa"],
    precio: 11000,
    vendedor: "David Pereyra"
    },
    {
    id: 10,
    name: "Short",
    descrp: "Short de jean azul desgastado, tiro alto",
    img: "/src/data/img/short-jean.png",
    stock: 1,
    cat: ["Short"],
    precio: 7000,
    vendedor: "David Pereyra"
    },
    {
    id: 11,
    name: "Chaqueta",
    descrp: "Chaqueta de cuero sintético negra, clásica",
    img: "/src/data/img/campera-cuero.png",
    stock: 1,
    cat: ["Abrigo"],
    precio: 25000,
    vendedor: "David Pereyra"
    },
    {
    id: 12,
    name: "Pantalón",
    descrp: "Pantalón de vestir beige, tiro recto, impecable",
    img: "/src/data/img/pantalon-beige.png",
    stock: 1,
    cat: ["Pantalón"],
    precio: 13000,
    vendedor: "David Pereyra"
    },
]