import { conexion } from "../libreria/supabase"

export const ObtenerLibros = async () => {
    const {data, error} = await conexion
    .from('libros')
    .select('*')
    .order('id', {ascending : true})

    if(error){
        console.error('Error al recuperar los libros', error.message)
        throw error
    }

    return data
}

export const confirmarPrestamo = async (carrito, inventario) => {
    const prestamo = carrito.map(libro => {
        const libroEnInventario = inventario.find(inv => inv.id === libro.id)
        
        return conexion
            .from('libros')
            .update({ copias: libroEnInventario.copias }) 
            .eq('id', libro.id)
    })

    await Promise.all(prestamo)
}