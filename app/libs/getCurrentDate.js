export const getCurrentDate = () => {
    // const d = new Date()
    var d = (new Date()).getTimezoneOffset() * 60000
    const setDate = (new Date(Date.now() - d)).toISOString().slice(0, -1)
    const date = setDate.split('T')[0]
    const time = setDate.split('T')[1].split('.')[0]
    return `${date} ${time}`
}


export const formatDate = (fecha) => {
    // Crear una nueva fecha
    // let fecha = new Date();

    // Obtener el año, mes y día
    let año = fecha.getFullYear();
    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Agregar 1 al mes porque en JavaScript los meses van de 0 a 11
    let dia = ('0' + fecha.getDate()).slice(-2);

    // Formatear la fecha en el formato deseado
    let fechaFormateada = `${año}-${mes}-${dia}`;

    return fechaFormateada
}