import { useBiblioteca } from './funcionalidades/biblioteca'
import CuadriculaLibros from './componentes/DashboardLibro'
import Prestamo from './componentes/Prestamo'

function App() {
  const {
    inventario,
    carrito,
    cargando,
    notificacion,
    setNotificacion,
    AgregarLibro,
    EliminarLibro,
    CancelarPrestamo,
    ConfirmarPrestamo
  } = useBiblioteca()

  // Pantalla de carga 
  if (cargando && inventario.length === 0) {
    return <div className="pantalla-carga">Obteniendo libros...</div>
  }

  return (
    <main className="contenedor-principal">
      
      {/* CUADRO DE NOTIFICACIÓN UNIFICADO (ÉXITO O ERROR) */}
      {notificacion && (
        <div className="alerta-emergencia-overlay">
          <div className={`alerta-emergencia-caja ${notificacion.tipo}`}>
            <div className="alerta-encabezado">
              <span>{notificacion.tipo === 'exito' ? 'Prestamo Exitoso' : 'Error'}</span>
            </div>
            <p>{notificacion.mensaje}</p>
            <button onClick={() => setNotificacion(null)} className="boton-cerrar-emergencia">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <header className="barra-navegacion">
        <h1>Sistema de Biblioteca</h1>
      </header>

      <div className="layout-aplicacion">
        <CuadriculaLibros 
          listaLibros={inventario} 
          AgregarLibro={AgregarLibro}
        />
        
        <Prestamo 
          LibrosSeleccionados={carrito}
          Confirmar={ConfirmarPrestamo}
          Cancelar={CancelarPrestamo}
          Eliminar={EliminarLibro}
        />
      </div>
    </main>
  )
}

export default App