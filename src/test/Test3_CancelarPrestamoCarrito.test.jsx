import {test, beforeEach, expect, vi} from 'vitest'
import { renderHook, act } from '@testing-library/react';
import { useBiblioteca } from '../funcionalidades/biblioteca'


beforeEach(() => {
    vi.clearAllMocks();
})

vi.mock('../servicios/serviciolibro.js', () => ({
    ObtenerLibros: vi.fn()
}))

import { ObtenerLibros } from '../servicios/serviciolibro';

test('CancelarPrestamo_CarritoNoVacio_Exito', async() => {
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
    await act(async() => {})


    act(() => {
        result.current.AgregarLibro(Libros[0]);
    })

    await act(async() => {
        result.current.CancelarPrestamo();
    })


    expect(result.current.carrito.length).toBe(0);
    expect(result.current.inventario[0].copias).toBe(3)
})