export function arrayToCSV(arr) {
    const cabeceras = Object.keys(arr[0]);
    let csv = cabeceras.join(',') + '\n';

    arr.forEach((objeto) => {
        const fila = cabeceras.map((cabecera) => {
            const valor = typeof objeto[cabecera] === 'string' ? objeto[cabecera].includes(',') ? `"${objeto[cabecera]}"` : objeto[cabecera] : objeto[cabecera];
            return valor;
        });

        csv += fila.join(',') + '\n';
    });

    return csv;
}

export function downloadCSV(csv, nombreArchivo) {
    // Crear un objeto Blob que contiene los datos en formato CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Crear un enlace <a> para descargar el archivo
    const enlace = document.createElement("a");
    if (enlace.download !== undefined) {
        // Crear un enlace de descarga
        const url = URL.createObjectURL(blob);
        enlace.setAttribute("href", url);
        enlace.setAttribute("download", nombreArchivo);

        // Añadir el enlace al DOM y hacer clic en él
        document.body.appendChild(enlace);
        enlace.click();

        // Limpiar el objeto URL y el enlace creado
        URL.revokeObjectURL(url);
        document.body.removeChild(enlace);
    } else {
        // Si el navegador no soporta el atributo 'download', mostrar un mensaje de error
        alert('Lo siento, tu navegador no soporta la descarga automática.');
    }
}

export function filterArrayObject(array, filtro1, filtro2) {
    return array.filter(objeto => filtro1(objeto) && filtro2(objeto));
}

export function downloadCSVFilter(array, filtro1, filtro2, nombreArchivo) {
    const arrayFiltrado = filterArrayObject(array, filtro1, filtro2);

    if (arrayFiltrado.length) {
        downloadCSV(arrayToCSV(arrayFiltrado), nombreArchivo)
    } else {
        alert('No found data')
    }

}