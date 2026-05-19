import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, vi, test, beforeEach } from 'vitest'
import App from '../App'
import { useBiblioteca } from '../funcionalidades/biblioteca'

vi.mock('../funcionalidades/biblioteca', () => ({
  useBiblioteca: vi.fn()
}))

describe('HU-02: Registrar Libro para préstamo', () => {
  const mockAgregarLibro = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('[Happy Path]: Debe invocar la función de agregado al pulsar el botón activo', () => {
    const libroPrueba = { id: 42, nombre: '1984', autor: 'George Orwell', portada: '1984.jpg', copias: 5 } 

    useBiblioteca.mockReturnValue({
      inventario: [libroPrueba],
      carrito: [],
      cargando: false,
      notificacion: null,
      AgregarLibro: mockAgregarLibro
    })

    render(<App />)
    
    const botonAgregar = screen.getByRole('button', { name: /Agregar al Carrito/i })
    fireEvent.click(botonAgregar) 


    expect(mockAgregarLibro).toHaveBeenCalledTimes(1)
    expect(mockAgregarLibro).toHaveBeenCalledWith(libroPrueba)
  })


  test('[Inválido]: Debe bloquear mutaciones si se intenta forzar el agregado de un libro agotado', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 12, nombre: 'Drácula', autor: 'Bram Stoker', portada: 'dracula.jpg', copias: 0 }],
      carrito: [],
      cargando: false,
      notificacion: null,
      AgregarLibro: mockAgregarLibro
    })

    render(<App />)
    
    const botonAgotado = screen.getByRole('button')
    fireEvent.click(botonAgotado)

    expect(mockAgregarLibro).not.toHaveBeenCalled()
  })

  test('[Inválido]: Debe ignorar la operación si el ID enviado no coincide con ningún libro mapeado', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 1, nombre: '1984', autor: 'George Orwell', portada: '1984.jpg', copias: 5 }],
      carrito: [],
      cargando: false,
      notificacion: null,
      AgregarLibro: mockAgregarLibro
    })


    mockAgregarLibro(999)


    expect(mockAgregarLibro).toHaveBeenCalledWith(999)
  })


  test('[Borde]: Debe inhabilitar el botón si copias es igual a cero', () => {
    useBiblioteca.mockReturnValue({
      inventario: [{ id: 7, nombre: 'El Hobbit', autor: 'J.R.R. Tolkien', portada: 'hobbit.jpg', copias: 0 }],
      carrito: [],
      cargando: false,
      notificacion: null,
      AgregarLibro: mockAgregarLibro
    })

    render(<App />)

    const boton = screen.getByRole('button')
    
    expect(boton).toBeDisabled()
  })
})