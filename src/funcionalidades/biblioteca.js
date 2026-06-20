import { useState, useEffect } from 'react'
import { ObtenerLibros, confirmarPrestamo } from '../servicios/serviciolibro'

export const useBiblioteca = () => {
  const [inventario, setInventario] = useState([])
  const [carrito, setCarrito] = useState([])
  const [cargando, setCargando] = useState(true)
  const [notificacion, setNotificacion] = useState(null)


  // Restaurar Todos los Datos
  const RestaurarDatos = async() => {
      const datosOriginales = await ObtenerLibros()
      setInventario(datosOriginales)
      setCarrito([])
  }

    //Ajustar Copias Disponibles
  const Modificar_Inventario_Copias = (Libro_id, numero) => {
    setInventario((actual) =>
      actual.map(item => item.id === Libro_id ? { ...item, copias: item.copias + numero } : item)
    )
  }


  // Generar Notificacion
  const Notificacion = (tipo_notificacion, mensaje_notificacion) => {
    return setNotificacion({
        tipo: tipo_notificacion,
        mensaje: mensaje_notificacion
    })
  }

  // Carga Libros
  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        await RestaurarDatos();
      } catch (error) {
      Notificacion('error','Error al obtener los libros.');
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarBiblioteca()
  }, [])

  // Agregar Libro
  const AgregarLibro = (libro) => {
    console.log('Libro recibido:', libro)
    Modificar_Inventario_Copias(libro.id, -1);

    setCarrito((actual) => {
      const existe = actual.find(item => item.id === libro.id)
      return existe
        ? actual.map(item => item.id === libro.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { ...libro, cantidad: 1 }]
    })
  }

  // Eliminar Libro (Resta de 1 en 1)
  const EliminarLibro = (idLibro) => {
    Modificar_Inventario_Copias(idLibro, +1);

    setCarrito((actual) => {
      const libro = actual.find(item => item.id === idLibro)
      return libro.cantidad > 1
        ? actual.map(item => item.id === idLibro ? { ...item, cantidad: item.cantidad - 1 } : item)
        : actual.filter(item => item.id !== idLibro)
    })
  }

  // Cancelar Prestamo
const CancelarPrestamo = async () => {
    setCargando(true)
    try {
      await RestaurarDatos();
    } catch (error) {
      Notificacion('error','Error al eliminar libros del prestamo.');
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  // Confirmar Prestamo
  const ConfirmarPrestamo = async () => {
    try {
      setCargando(true)
      await confirmarPrestamo(carrito, inventario)
      setCarrito([])
      Notificacion('exito','¡Préstamo registrado con éxito!');
    } catch (error) {
      Notificacion('error','Error al registrar el préstamo.');
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  return {
    inventario,
    carrito,
    cargando,
    notificacion,      
    setNotificacion,  
    AgregarLibro,
    EliminarLibro,
    ConfirmarPrestamo,
    CancelarPrestamo
  }
}