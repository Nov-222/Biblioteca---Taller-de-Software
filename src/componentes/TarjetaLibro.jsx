const TarjetaLibro = ({ libro, Agregar }) => {
  const sinCopias = libro.copias === 0

  return (
    <div className="tarjeta-libro">
      <img 
        src={libro.portada} 
        alt={libro.nombre} 
        className="portada-imagen"
      />
      <div className="detalles-libro">
        <h3>{libro.nombre}</h3>
        <p>Autor: {libro.autor}</p>
        <p className="stock-info">Disponibles: {libro.copias}</p>
        
        <button 
          disabled={sinCopias} 
          onClick={() => Agregar(libro)}
          className={`boton-prestamo ${sinCopias ? 'deshabilitado' : 'activo'}`}
        >
          {sinCopias ? "Sin Copias" : "Agregar al Carrito"}
        </button>
      </div>
    </div>
  )
}

export default TarjetaLibro