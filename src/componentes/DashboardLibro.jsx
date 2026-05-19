import TarjetaLibro from './TarjetaLibro'

const CuadriculaLibros = ({ listaLibros, AgregarLibro }) => {
  return (
    <section className="seccion-inventario">
      <h2>Libros Disponibles</h2>
      <div className="contenedor-grid">
        {listaLibros.map(libro => (
          <TarjetaLibro 
            key={libro.id} 
            libro={libro} 
            Agregar={AgregarLibro} 
          />
        ))}
      </div>
    </section>
  )
}

export default CuadriculaLibros