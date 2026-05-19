import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, vi, test, beforeEach } from 'vitest'
import App from '../App'
import { useBiblioteca } from '../funcionalidades/biblioteca'

vi.mock('../funcionalidades/biblioteca', () => ({
  useBiblioteca: vi.fn()
}))

describe('HU-03: Confirmar Préstamo', () => {
  const mockConfirmarPrestamo = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('[Happy Path]: Debe invocar ConfirmarPrestamo exitosamente cuando el carrito tiene elementos', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 1, nombre: 'El Principito', autor: 'Antoine de Saint-Exupéry', portada: 'principito.jpg', copias: 2 }],
      carrito: [{ id: 1, nombre: 'El Principito', cantidad: 1 }], // Carrito con un libro
      cargando: false,
      notificacion: null,
      ConfirmarPrestamo: mockConfirmarPrestamo // Conectamos nuestro espía
    })


    render(<App />)
    
    const botonConfirmar = screen.getByRole('button', { name: /Confirmar Préstamo/i })
    fireEvent.click(botonConfirmar)

    expect(mockConfirmarPrestamo).toHaveBeenCalledTimes(1)
  })

  test('[Inválido]: Debe reflejar la notificación de error en la UI si falla la promesa de persistencia', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 1, nombre: 'El Principito', autor: 'Antoine de Saint-Exupéry', portada: 'principito.jpg', copias: 2 }],
      carrito: [{ id: 1, nombre: 'El Principito', cantidad: 1 }],
      cargando: false,
      notificacion: { tipo: 'error', mensaje: 'Error al registrar el préstamo.' }, // Mensaje exacto de tu catch
      ConfirmarPrestamo: mockConfirmarPrestamo
    })

    render(<App />)


    const alertaError = screen.getByText(/Error al registrar el préstamo\./i)
    expect(alertaError).toBeInTheDocument()
    
    const encabezadoError = screen.getByText('Error')
    expect(encabezadoError).toBeInTheDocument()
  })

  test('[Inválido]: Debe reflejar la notificación de éxito en la UI si la transacción consolida correctamente', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 1, nombre: 'El Principito', autor: 'Antoine de Saint-Exupéry', portada: 'principito.jpg', copias: 1 }],
      carrito: [], 
      cargando: false,
      notificacion: { tipo: 'exito', mensaje: '¡Préstamo registrado con éxito!' }, 
      ConfirmarPrestamo: mockConfirmarPrestamo
    })

    render(<App />)


    const alertaExito = screen.getByText(/¡Préstamo registrado con éxito!/i)
    expect(alertaExito).toBeInTheDocument()

    const encabezadoExito = screen.getByText(/Prestamo Exitoso/i)
    expect(encabezadoExito).toBeInTheDocument()
  })


  test('[Borde]: Debe ocultar el panel de confirmación por completo si el carrito se encuentra vacío', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 1, nombre: 'El Principito', autor: 'Antoine de Saint-Exupéry', portada: 'principito.jpg', copias: 3 }],
      carrito: [], 
      cargando: false,
      notificacion: null,
      ConfirmarPrestamo: mockConfirmarPrestamo
    })

    render(<App />)


    const botonConfirmar = screen.queryByRole('button', { name: /Confirmar Préstamo/i })
    expect(botonConfirmar).not.toBeInTheDocument()
    
    const panelPrestamo = document.querySelector('.panel-prestamo')
    expect(panelPrestamo).toBeNull()
  })
})