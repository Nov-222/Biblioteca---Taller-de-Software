import { expect, test, vi, beforeEach} from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBiblioteca } from '../funcionalidades/biblioteca'

beforeEach(() => {
    vi.clearAllMocks()
})

vi.mock('../servicios/serviciolibro.js', async() => ({
    ObtenerLibros: vi.fn(),
}))

import { ObtenerLibros } from '../servicios/serviciolibro'

test('Verificacion de Inventario', async() => {
    const libros = [
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

    ObtenerLibros.mockResolvedValue(libros)
    const {result} = renderHook(() => useBiblioteca()) 
    await act(async () => {}) 

    expect(result.current.inventario.length).toBe(2);
    expect(result.current.inventario[0]).toBe(libros[0]);
    expect(result.current.inventario[1]).toBe(libros[1]);
})