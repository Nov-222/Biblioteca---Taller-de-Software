import { expect, test, vi, beforeEach} from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBiblioteca } from '../funcionalidades/biblioteca'

beforeEach(() => {
    vi.clearAllMocks()
})

vi.mock('../servicios/serviciolibro.js', () => ({
    ObtenerLibros: vi.fn(),
}))

import { ObtenerLibros } from '../servicios/serviciolibro'

test('Agregar Libro al carrito', async() => {
    const libro = {
    id: 1,
    nombre: "La venganza de los Sith",
    autor: "George Lucas",
    portada: "portada.png",
    copias : 3
    }

    ObtenerLibros.mockResolvedValue([libro])
    const {result} = renderHook(() => useBiblioteca()) 
    await act(async () => {})

    act(() => {
        result.current.AgregarLibro(libro)
    })

    expect(result.current.inventario[0].copias).toBe(2)
})