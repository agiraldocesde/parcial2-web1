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




function motorLogico() {
    console.clear();
    console.log('='.repeat(60));
    console.log('       MOTOR LÓGICO ECOVIGÍA - SISTEMA DE DESPACHO');
    console.log('='.repeat(60));

    
    let dronesDisponibles = [];
    let dronesMantenimiento = [];

    for (let i = 0; i < flota.length; i++) {
        let dron = flota[i];
        
        if (dron.estado === 'en base' && dron.bateria > 20) {
            dronesDisponibles[dronesDisponibles.length] = dron;
        }
        
        // ¿Necesita mantenimiento?
        if (dron.bateria <= 20) {
            dronesMantenimiento[dronesMantenimiento.length] = dron;
        }
    }

    console.log('[INFO] Drones disponibles: ' + dronesDisponibles.length);
    console.log('[INFO] Drones con batería crítica: ' + dronesMantenimiento.length);


    let alertasOrdenadas = ordenarAlertasPorPrioridad(alertas);

    let asignaciones = [];
    let alertasNoAtendidas = [];

    for (let i = 0; i < alertasOrdenadas.length; i++) {
        let alerta = alertasOrdenadas[i];
        let aguaFaltante = alerta.aguaRequerida;
        let dronesAsignados = [];

        console.log('\n[PROCESANDO] ' + alerta.sector + ' (' + alerta.severidad + ') - Necesita: ' + alerta.aguaRequerida + 'L');

        let j = 0;
        while (j < dronesDisponibles.length && aguaFaltante > 0) {
            let dron = dronesDisponibles[j];

            if (dron.agua > 0) {
                dronesAsignados[dronesAsignados.length] = dron.id;
                aguaFaltante = aguaFaltante - dron.agua;

                console.log('  -> Asignado: ' + dron.id + ' (' + dron.agua + 'L) | Faltante: ' + (aguaFaltante > 0 ? aguaFaltante : 0) + 'L');

                // Eliminar dron del array de disponibles
                for (let k = j; k < dronesDisponibles.length - 1; k++) {
                    dronesDisponibles[k] = dronesDisponibles[k + 1];
                }
                dronesDisponibles.length = dronesDisponibles.length - 1;

                if (aguaFaltante <= 0) {
                    break;
                }
            } else {
                for (let k = j; k < dronesDisponibles.length - 1; k++) {
                    dronesDisponibles[k] = dronesDisponibles[k + 1];
                }
                dronesDisponibles.length = dronesDisponibles.length - 1;
            }
        }

        if (dronesAsignados.length > 0) {
            let aguaDesplegada = alerta.aguaRequerida - (aguaFaltante > 0 ? aguaFaltante : 0);
            let registro = {
                sector: alerta.sector,
                severidad: alerta.severidad,
                drones: dronesAsignados,
                aguaDesplegada: aguaDesplegada
            };

            if (aguaFaltante > 0) {
                registro.estado = 'PARCIAL';
            } else {
                registro.estado = 'COMPLETO';
            }

            asignaciones[asignaciones.length] = registro;
        }

        if (aguaFaltante > 0) {
            alertasNoAtendidas[alertasNoAtendidas.length] = {
                sector: alerta.sector,
                severidad: alerta.severidad,
                aguaRequerida: alerta.aguaRequerida,
                aguaFaltante: aguaFaltante
            };
        }
    }