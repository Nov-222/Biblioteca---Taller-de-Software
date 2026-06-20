import {test, vi, expect, beforeEach} from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBiblioteca } from '../funcionalidades/biblioteca'

beforeEach(() => {
    vi.clearAllMocks();
})

vi.mock('../servicios/serviciolibro.js', () => ({
    ObtenerLibros: vi.fn(),
    confirmarPrestamo: vi.fn()
}))

import { ObtenerLibros, confirmarPrestamo  } from '../servicios/serviciolibro';

test('ConfirmarPrestamo_UnaCopiaLibro_Exito', async() => {
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
    confirmarPrestamo.mockResolvedValue()
    const {result} = renderHook(() => useBiblioteca());
    await act(async() => {})


    act(() => {
        result.current.AgregarLibro(Libros[1]);
    })

    await act(async () => {
        await result.current.ConfirmarPrestamo();
    })


    expect(result.current.carrito.length).toBe(0);
    expect(result.current.inventario[1].copias).toBe(2);
})