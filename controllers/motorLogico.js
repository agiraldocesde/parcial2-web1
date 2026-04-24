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



function obtenerPrioridad(severidad) {
    if (severidad === 'roja') return 1;
    if (severidad === 'naranja') return 2;
    if (severidad === 'amarilla') return 3;
    return 99;
}

function ordenarAlertasPorPrioridad(arrAlertas) {
    let copia = [];
    for (let i = 0; i < arrAlertas.length; i++) {
        copia[i] = arrAlertas[i];
    }

    let n = copia.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            let prioridadA = obtenerPrioridad(copia[j].severidad);
            let prioridadB = obtenerPrioridad(copia[j + 1].severidad);
            
            if (prioridadA > prioridadB) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            }
        }
    }
    
    return copia;
}