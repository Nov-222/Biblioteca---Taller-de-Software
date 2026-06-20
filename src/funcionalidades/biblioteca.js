import { useState, useEffect } from 'react'
import { ObtenerLibros, confirmarPrestamo } from '../servicios/serviciolibro'

export const useBiblioteca = () => {
  const [inventario, setInventario] = useState([])
  const [carrito, setCarrito] = useState([])
  const [cargando, setCargando] = useState(true)
  const [notificacion, setNotificacion] = useState(null)

  // Carga Libros
  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        const libros = await ObtenerLibros()
        setInventario(libros)
      } catch (error) {
        setNotificacion({
          tipo: 'error',
          mensaje: 'Error al obtener los libros.'
        })
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarBiblioteca()
  }, [])

  // Agregar Libro
  const AgregarLibro = (libro) => {
    setInventario((actual) =>
      actual.map(item => item.id === libro.id ? { ...item, copias: item.copias - 1 } : item)
    )

    setCarrito((actual) => {
      const existe = actual.find(item => item.id === libro.id)
      return existe
        ? actual.map(item => item.id === libro.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { ...libro, cantidad: 1 }]
    })
  }

  // Eliminar Libro (Resta de 1 en 1)
  const EliminarLibro = (idLibro) => {
    setInventario((actual) =>
      actual.map(item => item.id === idLibro ? { ...item, copias: item.copias + 1 } : item)
    )

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
      const datosOriginales = await ObtenerLibros()
      setInventario(datosOriginales)
      setCarrito([])
    } catch (error) {
      setNotificacion({
        tipo: 'error',
        mensaje: 'Error al eliminar libros del prestamo.'
      })
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
      setNotificacion({
        tipo: 'exito',
        mensaje: '¡Préstamo registrado con éxito!'
      })
    } catch (error) {
      setNotificacion({
        tipo: 'error',
        mensaje: 'Error al registrar el préstamo.'
      })
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