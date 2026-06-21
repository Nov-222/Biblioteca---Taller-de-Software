# EF — Reporte de Proyecto
**Estudiante:** Gutierrez Lara Israel
**Proyecto:** Biblioteca
**Repositorio:** [Enlace](https://github.com/Nov-222/Biblioteca---Taller-de-Software)
**Fecha de entrega:** [20-06-2026]

> **USO DE IA PROHIBIDO.** Cualquier evidencia de uso de IA (ChatGPT, Copilot, Claude, u otras) anula el examen completo — los 3 proyectos reciben nota 0.
---

## Sección 1 — Deploy

**URL del proyecto:** [\[URL pública\]](https://biblioteca-taller-de-software.onrender.com/)
**Swagger / API:** No aplica

> Captura del proyecto corriendo con datos reales:

![Deploy en producción](capturas/biblioteca-deploy.png)

---

## Sección 2 — Pruebas con TDD + cobertura

### Cobertura inicial (43,75%)

**Herramienta:** [vitest]

> Captura del reporte de cobertura antes de escribir pruebas nuevas:

![Cobertura inicial](capturas/biblioteca-cobertura-inicial.png)

---

### Ciclo TDD — Prueba 1

**HU:** [HU-02] [Registrar Libro para préstamo]
> Como [bibliotecario] quiero [una opción de agregado junto a la visualización del libro (H1)] para [solicitar un préstamo del libro.]

**CA elegido:** [Happy Path] Dado que el bibliotecario haya visto el libro solicitado, cuando presione el botón de agregado, entonces el software debe de notificar que el libro fue agregado exitosamente al préstamo, descontando simultáneamente 1 unidad del inventario visual.

**Detalle**: Algunos nombres de Test no cumplen a inicios Funcion_Escenario_Esperado, pero fue corregido en posteiores commits.

**Commit 1 — Rojo** [`3a2abc1`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/3a2abc1):
```
test: [HU-02] agregar test para [Happy Path de Agregar Libro a Carrito]
```
Test escrito (sin el código que lo pase aún):
```csharp / typescript
test('AgregarLibro_UnLibroACarrito_Exito', async() => {
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
```

> Captura del test fallando o error de compilación:

![Test rojo](capturas/biblioteca-tdd1-rojo.png)

---

**Commit 2 — Verde** [`73c112a`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/73c112a):
```
feat: [HU-02] implementar [AgregarLibro] para pasar test
```
Código mínimo para hacer pasar el test:
```csharp / typescript
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
```

> Captura del test pasando:

![Test verde](capturas/biblioteca-tdd1-verde.png)

---

**Commit 3 — Refactor** [`fc7dbba`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/fc7dbba):
```
refactor: [HU-02] limpiar [encapsulamiento de codigo reutilizable]
```
Cambios aplicados:
```csharp / typescript
  const AgregarLibro = (libro) => {
    Modificar_Inventario_Copias(libro.id, -1);

    setCarrito((actual) => {
      const existe = actual.find(item => item.id === libro.id)
      return existe
        ? actual.map(item => item.id === libro.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { ...libro, cantidad: 1 }]
    })
  }


    const Modificar_Inventario_Copias = (Libro_id, numero) => {
    setInventario((actual) =>
      actual.map(item => item.id === Libro_id ? { ...item, copias: item.copias + numero } : item)
    )
  }
```

> Captura del test aún pasando después del refactor:

![Test post-refactor](capturas/biblioteca-tdd1-refactor.png)

---

### Ciclo TDD — Prueba 2

**HU:** [HU-03] [Confirmar Préstamo]
> Como [bibliotecario] quiero [confirmar el préstamo con los libros agregados (H2)] para [finalizar el proceso del préstamo.]

**CA elegido:** [Happy Path] Dado que el bibliotecario haya terminado la selección de libros (H2), cuando confirme el préstamo, entonces el software debe notificar que se ha realizado con éxito y en la base de datos se debe descontar la cantidad de copias seleccionadas.

**Commit 1 — Rojo** [`9a3d3dd`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/9a3d3dd):
```
test: [HU-03] agregar test para [Happy Path de Confirmar Préstamo]
```
Test escrito (sin el código que lo pase aún):
```csharp / typescript
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
```

> Captura del test fallando o error de compilación:

![Test rojo](capturas/biblioteca-tdd2-rojo.png)

---

**Commit 2 — Verde** [`efeee43`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/efeee43):
```
feat: [HU-03] implementar [ConfirmarPrestamo] para pasar test
```
Código mínimo para hacer pasar el test:
```csharp / typescript
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
```

> Captura del test pasando:

![Test verde](capturas/biblioteca-tdd2-verde.png)

---

**Commit 3 — Refactor** [`8207c99`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/8207c99):
```
refactor: [HU-03: Confirmar Préstamo] limpiar [encapsulamiento de codigo reutilizable]
```
Cambios aplicados:
```csharp / typescript
  const ConfirmarPrestamo = async () => {
    try {
      setCargando(true)
      await confirmarPrestamo(carrito, inventario)
      setCarrito([])
      Notificacion('exito','¡Préstamo registrado con éxito!');
    } catch (error) {
      Notificacion('error','Error al registrar el préstamo.');
      console.error(error)
    } finally {
      setCargando(false)
    }
  }
  

  const Notificacion = (tipo_notificacion, mensaje_notificacion) => {
    return setNotificacion({
        tipo: tipo_notificacion,
        mensaje: mensaje_notificacion
    })
  }
```

> Captura del test aún pasando después del refactor:

![Test post-refactor](capturas/biblioteca-tdd2-refactor.png)

---

### Ciclo TDD — Prueba 3

**HU:** [HU-04] [Cancelar préstamo]
> Como [bibliotecario] quiero [cancelar el préstamo de los libros agregados (H2)] para [en caso de que el cliente de la biblioteca se retracte, se pueda revertir lo agregado.]

**CA elegido:** [Happy Path] Dado que el cliente de la biblioteca se haya retractado, cuando el bibliotecario presione el botón de cancelar préstamo, entonces el software debe notificar que la acción fue exitosa y debe restaurar la cantidad de libros disponibles antes de lo agregado.

**Commit 1 — Rojo** [`4f92646`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/4f92646):
```
test: [HU-04] agregar test para funcionalidad de Cancelar Prestamo
```
Test escrito (sin el código que lo pase aún):
```csharp / typescript
test('Funcionalidad de Cancelar Prestamo en Carrito', async() => {
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
```

> Captura del test fallando o error de compilación:

![Test rojo](capturas/biblioteca-tdd3-rojo.png)

---

**Commit 2 — Verde** [`a137807`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/a137807):
```
feat: [HU-04] implementar [CancelarPrestamo] para pasar test
```
Código mínimo para hacer pasar el test:
```csharp / typescript
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
```

> Captura del test pasando:

![Test verde](capturas/biblioteca-tdd3-verde.png)

---

**Commit 3 — Refactor** [`48ed3e1`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/48ed3e1):
```
refactor: [HU-04: Cancelar préstamo] limpiar [Encapsulando Codigo reurilizable]
```
Cambios aplicados:
```csharp / typescript
const CancelarPrestamo = async () => {
    setCargando(true)
    try {
      await RestaurarDatos();
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


  const RestaurarDatos = async() => {
      const datosOriginales = await ObtenerLibros()
      setInventario(datosOriginales)
      setCarrito([])
  }
```

> Captura del test aún pasando después del refactor:

![Test post-refactor](capturas/biblioteca-tdd3-refactor.png)

---

### Cobertura final

**Cobertura alcanzada:** 67,64%

> Captura del reporte de cobertura final:

![Cobertura final](capturas/biblioteca-cobertura-final.png)

> Si la cobertura es <50%, pegar aquí la justificación enviada al docente:

---

## Sección 3 — Code smells corregidos

Mínimo 3 nuevos (adicionales a los del EC2).

| # | Tipo | Commit | Descripción |
|---|---|---|---|
| 1 | [Codigo Duplicado] | [`01fcfa6`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/01fcfa6) | [Antes: Codigo Duplicado → Después: Funcion Reutilizable] |
| 2 | [Codigo Duplicado] | [`0d3edb1`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/0d3edb1) | [Antes: Codigo Duplicado → Después: Funcion Reutilizable] |
| 3 | [Codigo Duplicado] | [`a553234`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/a553234) | [Antes: Codigo Duplicado → Después: Funcion Reutilizable] |

### Detalle — Smell 1: [Codigo Duplicado]

**Código antes:**
```csharp / typescript
  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        const libros = await ObtenerLibros() //Codigo Duplicado
        setInventario(libros) //Codigo Duplicado
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

const CancelarPrestamo = async () => {
    setCargando(true)
    try {
      const datosOriginales = await ObtenerLibros() //Codigo Duplicado
      setInventario(datosOriginales) //Codigo Duplicado
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
```

**Código después:**
```csharp / typescript
  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        await RestaurarDatos(); //Encapsulamiento de codigo
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


const CancelarPrestamo = async () => {
    setCargando(true)
    try {
      await RestaurarDatos(); //Encapsulamiento de codigo
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


  const RestaurarDatos = async() => {
      const datosOriginales = await ObtenerLibros()
      setInventario(datosOriginales)
      setCarrito([])
  }
```

---

### Detalle — Smell 2: [Codigo Duplicado]

**Código antes:**
```csharp / typescript
useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        await RestaurarDatos();
      } catch (error) {
        setNotificacion({ //Codigo Duplicado
          tipo: 'error', //Codigo Duplicado
          mensaje: 'Error al obtener los libros.' //Codigo Duplicado
        })
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarBiblioteca()
  }, [])


  const CancelarPrestamo = async () => {
    setCargando(true)
    try {
      await RestaurarDatos();
    } catch (error) {
      setNotificacion({ //Codigo Duplicado
        tipo: 'error', //Codigo Duplicado
        mensaje: 'Error al eliminar libros del prestamo.' //Codigo Duplicado
      })
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

    const ConfirmarPrestamo = async () => {
    try {
      setCargando(true)
      await confirmarPrestamo(carrito, inventario)
      setCarrito([])
      setNotificacion({ //Codigo Duplicado 
        tipo: 'exito', //Codigo Duplicado
        mensaje: '¡Préstamo registrado con éxito!' //Codigo Duplicado
      })
    } catch (error) {
      setNotificacion({
        tipo: 'error', //Codigo Duplicado 
        mensaje: 'Error al registrar el préstamo.' //Codigo Duplicado
      })
      console.error(error)
    } finally {
      setCargando(false)
    }
  }
```

**Código después:**
```csharp / typescript

    useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        await RestaurarDatos();
      } catch (error) {
      Notificacion('error','Error al obtener los libros.'); //Encapsulamiento de codigo
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargarBiblioteca()
    }, [])

    const CancelarPrestamo = async () => {
        setCargando(true)
        try {
        await RestaurarDatos();
        } catch (error) {
        Notificacion('error','Error al eliminar libros del prestamo.'); //Encapsulamiento de codigo
        console.error(error)
        } finally {
        setCargando(false)
        }
    }

    const ConfirmarPrestamo = async () => {
        try {
        setCargando(true)
        await confirmarPrestamo(carrito, inventario)
        setCarrito([])
        Notificacion('exito','¡Préstamo registrado con éxito!'); //Encapsulamiento de codigo
        } catch (error) {
        Notificacion('error','Error al registrar el préstamo.'); //Encapsulamiento de codigo
        console.error(error)
        } finally {
        setCargando(false)
        }
    }

    const Notificacion = (tipo_notificacion, mensaje_notificacion) => {
    return setNotificacion({
        tipo: tipo_notificacion,
        mensaje: mensaje_notificacion
    })
    }
```

---

### Detalle — Smell 3: [Codigo Repetido]

**Código antes:**
```csharp / typescript
  const AgregarLibro = (libro) => {
    setInventario((actual) => //Codigo Repetido
      actual.map(item => item.id === libro.id ? { ...item, copias: item.copias - 1 } : item) //Codigo Repetido
    )

    setCarrito((actual) => {
      const existe = actual.find(item => item.id === libro.id)
      return existe
        ? actual.map(item => item.id === libro.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { ...libro, cantidad: 1 }]
    })
  }


    const EliminarLibro = (idLibro) => {
    setInventario((actual) => //Codigo Repetido
      actual.map(item => item.id === idLibro ? { ...item, copias: item.copias + 1 } : item) //Codigo Repetido
    )

    setCarrito((actual) => {
      const libro = actual.find(item => item.id === idLibro)
      return libro.cantidad > 1
        ? actual.map(item => item.id === idLibro ? { ...item, cantidad: item.cantidad - 1 } : item)
        : actual.filter(item => item.id !== idLibro)
    })
  }
```

**Código después:**
```csharp / typescript
const AgregarLibro = (libro) => {
    Modificar_Inventario_Copias(libro.id, -1); //Encapsulamiento de codigo

    setCarrito((actual) => {
      const existe = actual.find(item => item.id === libro.id)
      return existe
        ? actual.map(item => item.id === libro.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { ...libro, cantidad: 1 }]
    })
  }

  const EliminarLibro = (idLibro) => {
    Modificar_Inventario_Copias(idLibro, +1); //Encapsulamiento de codigo

    setCarrito((actual) => {
      const libro = actual.find(item => item.id === idLibro)
      return libro.cantidad > 1
        ? actual.map(item => item.id === idLibro ? { ...item, cantidad: item.cantidad - 1 } : item)
        : actual.filter(item => item.id !== idLibro)
    })
  }


  const Modificar_Inventario_Copias = (Libro_id, numero) => {
    setInventario((actual) =>
      actual.map(item => item.id === Libro_id ? { ...item, copias: item.copias + numero } : item)
    )
  }
```

---

## Sección 4 — Trazabilidad HU → CA → test

| # | Historia de Usuario | Criterio de Aceptación | Prueba que valida ese CA | Commit |
|---|---|---|---|---|
| 1 | [HU-02: Registrar Libro para préstamo] | [Como bibliotecario/ quiero una opción de agregado junto a la visualización del libro (H1)/ para solicitar un préstamo del libro.] | [AgregarLibro_UnLibroACarrito_Exito] | [`3a2abc1`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/3a2abc1) |
| 2 | [HU-03: Confirmar Préstamo] | [Como bibliotecario/ quiero confirmar el préstamo con los libros agregados (H2)/ para finalizar el proceso del préstamo.] | [ConfirmarPrestamo_UnaCopiaLibro_Exito] | [`9a3d3dd`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/9a3d3dd) |
| 3 | [HU-04: Cancelar préstamo] | [Como bibliotecario/ quiero cancelar el préstamo de los libros agregados (H2)/ para en caso de que el cliente de la biblioteca se retracte, se pueda revertir lo agregado.] | [CancelarPrestamo_CarritoNoVacio_Exito] | [`4f92646`](https://github.com/Nov-222/Biblioteca---Taller-de-Software/commit/4f92646) |

### Cadena 1 — [HU-02: Registrar Libro para préstamo]

**Historia de Usuario:**
> Como [bibliotecario] quiero [una opción de agregado junto a la visualización del libro (H1)] para [solicitar un préstamo del libro.]

**Criterio de Aceptación elegido:**
> Dado [que el bibliotecario haya visto el libro solicitado] / Cuando [presione el botón de agregado] / Entonces [el software debe de notificar que el libro fue agregado exitosamente al préstamo, descontando simultáneamente 1 unidad del inventario visual.]

**Prueba que valida este CA:**
```csharp / typescript
test('AgregarLibro_UnLibroACarrito_Exito', async() => {
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
```

---

### Cadena 2 — [HU-03: Confirmar Préstamo]

**Historia de Usuario:**
> Como [bibliotecario] quiero [confirmar el préstamo con los libros agregados (H2)] para [finalizar el proceso del préstamo.]

**Criterio de Aceptación elegido:**
> Dado [que el bibliotecario haya terminado la selección de libros (H2)] / Cuando [confirme el préstamo] / Entonces [el software debe notificar que se ha realizado con éxito y en la base de datos se debe descontar la cantidad de copias seleccionadas.]

**Prueba que valida este CA:**
```csharp / typescript
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
```

---

### Cadena 3 — [Cancelar préstamo]

**Historia de Usuario:**
> Como [bibliotecario] quiero [cancelar el préstamo de los libros agregados (H2)] para [beneen caso de que el cliente de la biblioteca se retracte, se pueda revertir lo agregado.]

**Criterio de Aceptación elegido:**
> Dado [que el cliente de la biblioteca se haya retractado] / Cuando [el bibliotecario presione el botón de cancelar préstamo] / Entonces [el software debe notificar que la acción fue exitosa y debe restaurar la cantidad de libros disponibles antes de lo agregado.]

**Prueba que valida este CA:**
```csharp / typescript
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
```