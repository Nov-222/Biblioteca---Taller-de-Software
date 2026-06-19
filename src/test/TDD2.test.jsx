import { expect, test, vi, beforeEach} from 'vitest'

beforeEach(() => {
    vi.clearAllMocks()
})

const {libro} = vi.hoisted(() => {
       return  {
            libro: {
                id: 1,
                nombre: "La venganza de los Sith",
                autor: "George Lucas",
                portada: "portada.png",
                copias : 3
             }
       }
    }
)

vi.mock('../libreria/supabase.js', () => ({
    conexion: {
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [libro], error: null })
            })
        })
    }
}))

import { ObtenerLibros } from '../servicios/serviciolibro'

test('Verificar Funcion Obtener Libros', async() => {
    const resultado = await ObtenerLibros();

    expect(resultado.length).toBe(1);
    expect(resultado).toEqual([libro])
})