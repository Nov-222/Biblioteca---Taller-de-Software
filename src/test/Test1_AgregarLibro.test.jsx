import { expect, vi, test, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBiblioteca } from '../funcionalidades/biblioteca'

beforeEach(() => {
    vi.clearAllMocks()
})

vi.mock('../servicios/serviciolibro.js', () => ({
    ObtenerLibros: vi.fn(),
}))

import { ObtenerLibros } from '../servicios/serviciolibro'

test('Funcionalidad de Agregar Libro al Carrito', async() => {
    //Datos cargados
    const Libros = [
        {
            id: 1,
            nombre: "La venganza de los Sith",
            autor: "George Lucas",
            portada: "portada.png",
            copias : 3
        }, {
            id: 2,
            nombre: "Tokyo Ghoul",
            autor: "Sui Ishida",
            portada: "portada2.png",
            copias : 3
        }
    ]

    ObtenerLibros.mockResolvedValue(Libros);
    const {result} = renderHook(() => useBiblioteca()) 
    await act(async () => {})

    act(() => {
        result.current.AgregarLibro(Libros[0]);
    })

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.carrito[0]).toEqual({ ...Libros[0], cantidad: 1 })
    expect(result.current.carrito[0]).not.toEqual({ ...Libros[1], cantidad: 1 })
})