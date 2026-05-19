const Prestamo = ({ LibrosSeleccionados, Confirmar, Cancelar, Eliminar }) => {
  if (LibrosSeleccionados.length === 0) { return null }

  return (
    <div className="panel-prestamo">
      <div className="encabezado-panel">
        <h3>Lista Total de Libros Solicitados: ({LibrosSeleccionados.length})</h3>
        <button onClick={Cancelar} className="boton-limpiar">Cancelar Préstamo</button>
      </div>

      <ul className="lista-prestamo">
        {LibrosSeleccionados.map(libro => (
          <li key={libro.id} className="item-prestamo">
            <div className="info-item">
              <span>{libro.nombre}</span>
              <small>{libro.cantidad} {libro.cantidad === 1 ? 'copia solicitada' : 'copias solicitadas'}</small>
            </div>
            <button 
              onClick={() => Eliminar(libro.id)} 
              className="boton-eliminar-item"
              title="Quitar de la lista"
            >
              Eliminar 1 Copia
            </button>
          </li>
        ))}
      </ul>

      <div className="acciones-panel">
        <button onClick={Confirmar} className="boton-confirmar-final">
          Confirmar Préstamo
        </button>
      </div>
    </div>
  )
}

export default Prestamo