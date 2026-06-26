
interface productos {
    id: number;
    name: String,
    descrp: String,
    img: String,
    stock: number,
    cat: String[],
    precio: number,
    vendedor: string,
};

let producto: Array<any> =  [
    {id: 1, name: "osito", precio:3000, img: "./img/Osito.jpg", descuento: false, cantDesc: 0}, 
    {id: 2, name: "unicornio", precio:5000, img: "./img/Unicuernico.jpg", descuento: false, cantDesc: 0}, 
    {id: 3, name: "gatito", precio:4500, img: "./img/Gatito.jpg", descuento: false, cantDesc: 0}, 
    {id: 4, name: "perrito", precio:7000, img: "./img/Perrito.jpg", descuento: false, cantDesc: 0}, 
    {id: 5, name: "foca", precio:8500, img: "./img/Foca.jpg", descuento: false, cantDesc: 0},
    {id: 6, name: "pikachu", precio:9000, img: "./img/Pikachu.jpg", descuento: false, cantDesc: 0},
    {id: 7, name: "chimuelo", precio:6000, img: "./img/Chimuelo.jpg", descuento: false, cantDesc: 0},
    {id: 8, name: "stitch", precio:5500, img: "./img/Stitch.jpg", descuento: false, cantDesc: 0},
    {id: 9, name: "pingüino", precio:10000, img: "./img/Pingüino.jpg", descuento: false, cantDesc: 0},
    {id: 10, name: "totoro", precio:3000, img: "./img/Totoro.jpg", descuento: false, cantDesc: 0},
]