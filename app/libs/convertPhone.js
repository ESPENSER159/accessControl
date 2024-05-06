export function convertPhone(numero) {
    // Eliminar cualquier espacio en blanco
    // numero = numero.replace(/\D/g, '');
    numero = numero.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')

    // Dividir en grupos de tres caracteres
    var grupos = [];
    for (var i = 0; i < numero.length; i += 3) {
        grupos.push(numero.substr(i, 3))
    }

    // Unir los grupos con espacios
    // return grupos.join(' ');
    return numero
}