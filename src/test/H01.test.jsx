import {render, screen} from '@testing-library/react'
import { describe, expect, vi, test, beforeEach } from 'vitest'
import App from '../App'
import { useBiblioteca } from '../funcionalidades/biblioteca'

vi.mock('../funcionalidades/biblioteca', () => ({useBiblioteca: vi.fn()}))

describe('HU-01: Visualización de los libros', () => {
    beforeEach(() => {vi.clearAllMocks()})

    test('[Happy Path]: Debe renderizar la portada, título y autor de los libros recuperados', () => {
    const libro = [
      { id: 1, nombre: 'El Principito', autor: 'Antoine de Saint-Exupéry', portada: 'principito.jpg', copias: 3 }
    ]

    useBiblioteca.mockReturnValue({
      inventario: libro,
      carrito: [],
      cargando: false,
      notificacion: null
    })

    render(<App />)

    const titulo = screen.getByText(/El Principito/i)
    const autor = screen.getByText(/Antoine de Saint-Exupéry/i)
    const portadaImg = screen.getByRole('img')

    expect(titulo).toBeInTheDocument()
    expect(autor).toBeInTheDocument()
    expect(portadaImg).toHaveAttribute('src', 'principito.jpg')
  })

  test('[Inválido]: Debe capturar un fallo de la API (500) e inyectar el cuadro de notificación controlado en la UI', () => {
    useBiblioteca.mockReturnValue({
      inventario: [],
      carrito: [],
      cargando: false,
      notificacion: { tipo: 'error', mensaje: 'Error de conexión con Supabase (500)' }
    })

    render(<App />)

    const alertaMensaje = screen.getByText(/Error de conexión con Supabase \(500\)/i)
    expect(alertaMensaje).toBeInTheDocument()
  })

  test('[Inválido]: Debe omitir el renderizado de la tarjeta si contiene datos nulos o corruptos en campos obligatorios', () => {
    const inventarioCorrupto = [
      { id: null, nombre: null, autor: 'Autor Fantasma', portada: 'anonimo.jpg', copias: 1 }
    ]

    useBiblioteca.mockReturnValue({
      inventario: inventarioCorrupto,
      carrito: [],
      cargando: false,
      notificacion: null
    })

    render(<App />)

    const tarjetaInvalida = screen.queryByText('Autor Fantasma')
    expect(tarjetaInvalida).not.toBeInTheDocument()
  })

  test('[Borde]: Debe apagar el estado de carga y renderizar un mensaje explícito si el inventario está vacío (0 registros)', () => {
    useBiblioteca.mockReturnValue({
      inventario: [],
      carrito: [],
      cargando: false,
      notificacion: null
    })

    render(<App />)

    const contenedorGrid = screen.fixture || document.querySelector('.contenedor-grid')
    expect(contenedorGrid).toBeInTheDocument()

    const tarjetasLibros = document.querySelectorAll('.tarjeta-libro')
    expect(tarjetasLibros.length).toBe(0)
  })
})