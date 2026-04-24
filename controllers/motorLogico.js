import { flota, alertas } from "../models/datos.js";


function mostrarTabla(mostrar, titulo) {
    console.log(`\n--- ${titulo} ---`);
    
    if (mostrar.length === 0) {
        console.log("(Sin datos para mostrar)");
        return;
    }

    let claves = [];
    for (let clave in mostrar[0]) {
        claves[claves.length] = clave;
    }

    let encabezado = '';
    for (let i = 0; i < claves.length; i++) {
        encabezado += claves[i] + '\t\t| ';
    }
    console.log(encabezado);
    console.log('—'.repeat(60));

    for (let i = 0; i < mostrar.length; i++) {
        let fila = '';
        for (let j = 0; j < claves.length; j++) {
            let valor = mostrar[i][claves[j]];
            fila += valor + '\t\t| ';
        }
        console.log(fila);
    }
    console.log('');
}