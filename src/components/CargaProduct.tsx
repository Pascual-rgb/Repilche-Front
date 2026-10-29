import { useRef, useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FaCheck, FaCloudUploadAlt, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import ImageUploadingComponent, { type ImageListType } from 'react-images-uploading';
import FeedbackCard from './FeedbackCard';
import { uploadProductImage } from '../services/storageService';
import './styles/CargaProduct.css';

// Compatibilidad interop ESM / CJS para Vite/Rollup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageUploading = ((ImageUploadingComponent as any).default || ImageUploadingComponent) as typeof ImageUploadingComponent;

type ModalTipo = 'publicar' | 'borrador' | null;

interface Categoria {
  id: number;
  nombre: string;
  slug?: string;
}

const CargaProduct = () => {
  const [modalTipo, setModalTipo] = useState<ModalTipo>(null);
  const [toastCrearOtra, setToastCrearOtra] = useState(false);
  const [images, setImages] = useState<ImageListType>([]);
  const [isSubiendo, setIsSubiendo] = useState(false);
  const [estadoCarga, setEstadoCarga] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados controlados para los campos del formulario
  const [nombre, setNombre] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [descripcion, setDescripcion] = useState<string>('');

  // Categorías dinámicas desde el backend
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

  useEffect(() => {
    let isMounted = true;
    const fetchCategorias = async () => {
      try {
        // Consultar categorías del backend con fallback
        let res = await fetch(`${apiUrl}/categories/`);
        if (!res.ok) {
          res = await fetch(`${apiUrl}/categorias/`);
        }
        if (res.ok) {
          const data = await res.json();
          const lista: Categoria[] = Array.isArray(data) ? data : data.results || [];
          if (isMounted && lista.length > 0) {
            setCategorias(lista);
          }
        }
      } catch (err) {
        console.warn('No se pudieron obtener las categorías del backend:', err);
      } finally {
        if (isMounted) setCargandoCategorias(false);
      }
    };

    fetchCategorias();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const handleImageChange = (imageList: ImageListType) => {
    setImages(imageList);
    if (errorMsg) setErrorMsg(null);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setCategoriaId('');
    setImages([]);
    setErrorMsg(null);
  };

  const procesarEnvio = async (tipo: 'publicar' | 'crear_otra' | 'borrador') => {
    setErrorMsg(null);

    // Captura síncrona de valores controlados antes de cualquier operación asíncrona
    const nombreFinal = nombre.trim();
    const descripcionFinal = descripcion.trim();
    const precioFinal = Number(precio);
    const categoriaFinal = Number(categoriaId);

    // Flujo para guardar borrador local
    if (tipo === 'borrador') {
      if (!nombreFinal) {
        setErrorMsg('Ingresá al menos el nombre de la prenda para guardar el borrador.');
        return;
      }

      limpiarFormulario();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setToastCrearOtra(false);
      setModalTipo('borrador');
      return;
    }

    // Validaciones de negocio en cliente antes de la subida a Storage
    if (!nombreFinal) {
      setErrorMsg('El nombre de la prenda no puede estar en blanco.');
      return;
    }

    if (!precioFinal || isNaN(precioFinal) || precioFinal <= 0) {
      setErrorMsg('Por favor, ingresá un precio válido mayor a 0.');
      return;
    }

    if (!categoriaFinal || isNaN(categoriaFinal) || categoriaFinal <= 0) {
      setErrorMsg('Por favor, seleccioná una categoría válida para la prenda.');
      return;
    }

    if (!descripcionFinal) {
      setErrorMsg('La descripción de la prenda no puede estar en blanco.');
      return;
    }

    if (descripcionFinal.length < 10) {
      setErrorMsg('La descripción debe tener al menos 10 caracteres.');
      return;
    }

    // Validación de imagen requerida
    if (images.length === 0 || !images[0]?.file) {
      setErrorMsg('Por favor, seleccioná una foto para la prenda.');
      const fileSection = document.getElementById('seccion-fotos');
      if (fileSection) {
        fileSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Verificar token de autenticación
    const token = localStorage.getItem('repilche-token');
    if (!token) {
      setErrorMsg('Tu sesión ha expirado o no estás autenticado. Por favor, iniciá sesión para publicar.');
      return;
    }

    setIsSubiendo(true);
    setEstadoCarga('Subiendo imagen...');

    try {
      // 1. Subida directa del archivo File nativo a Supabase Storage
      const fileToUpload = images[0].file;
      const publicUrl = await uploadProductImage(fileToUpload);

      // 2. Preparación del payload JSON para Django
      // Mapea exactamente 'nombre', 'descripcion', 'precio', 'categoria', 'stock' e 'imagen_url'
      setEstadoCarga('Registrando prenda en el catálogo...');

      const payload = {
        nombre: nombreFinal,
        name: nombreFinal,
        descripcion: descripcionFinal,
        description: descripcionFinal,
        precio: precioFinal,
        price: precioFinal,
        categoria: categoriaFinal,
        stock: 1,
        imagen: publicUrl,
        imagen_url: publicUrl,
        image: publicUrl,
        img: publicUrl,
      };

      console.log('Enviando payload JSON a Django:', payload);

      // 3. Envío del POST a Django incluyendo la URL en imagen_url
      const res = await fetch(`${apiUrl}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('Error al publicar producto en backend:', errData);

        let errorDetalle = 'Ocurrió un error al registrar la prenda en el backend.';
        if (res.status === 401) {
          errorDetalle = 'Tu sesión no es válida o expiró. Por favor, volvé a iniciar sesión.';
        } else if (res.status === 403) {
          errorDetalle = 'Debe ser un usuario vendedor registrado para publicar prendas.';
        } else if (errData) {
          if (typeof errData === 'string') {
            errorDetalle = errData;
          } else if (errData.detail) {
            errorDetalle = errData.detail;
          } else if (Array.isArray(errData)) {
            errorDetalle = errData.join(' ');
          } else {
            errorDetalle = Object.entries(errData)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join(' | ');
          }
        }
        throw new Error(errorDetalle);
      }

      // 4. Tras el 201 Created (o respuesta exitosa)
      limpiarFormulario();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      if (tipo === 'crear_otra') {
        setModalTipo(null);
        setToastCrearOtra(true);
        setTimeout(() => setToastCrearOtra(false), 4000);
      } else {
        setToastCrearOtra(false);
        setModalTipo('publicar');
      }
    } catch (err: unknown) {
      console.error('Error durante el proceso de publicación:', err);
      const mensaje = err instanceof Error ? err.message : 'Error inesperado durante la publicación.';
      setErrorMsg(mensaje);
    } finally {
      setIsSubiendo(false);
      setEstadoCarga('');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubiendo) {
      procesarEnvio('publicar');
    }
  };

  return (
    <>
      <div className="cargaProduct-page">
        <div className="cargaProduct-wrapper">
          <div className="CargaProduct-header">
            <h1>Carga de Producto</h1>
          </div>

          {modalTipo === 'publicar' && (
            <FeedbackCard
              icon={<FaCheck />}
              title="¡Prenda enviada a revisión!"
              message="Tu prenda fue cargada con éxito y está pendiente de moderación para ser publicada en el catálogo."
              actionText="Publicar otra prenda"
              onAction={() => {
                setModalTipo(null);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              secondaryActionText="Ir a Mis Productos"
              secondaryActionTo="/mis-productos"
            />
          )}

          {modalTipo === 'borrador' && (
            <FeedbackCard
              icon={<FaCheck />}
              title="¡Borrador guardado con éxito!"
              message="Tu prenda fue guardada como borrador. Podés editarla y publicarla cuando quieras desde Mis Productos."
              actionText="Publicar otra prenda"
              onAction={() => {
                setModalTipo(null);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              secondaryActionText="Ir a Mis Productos"
              secondaryActionTo="/mis-productos"
            />
          )}

          {!modalTipo && (
            <form ref={formRef} onSubmit={handleSubmit} className="cargaProduct-form">
              {toastCrearOtra && (
                <div className="cargaProduct-toast">
                  <FaCheck /> ¡Prenda enviada a revisión! El formulario quedó listo para cargar otra.
                </div>
              )}

              {errorMsg && (
                <div className="cargaProduct-alert-error" role="alert">
                  <FaExclamationTriangle className="alert-icon" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label htmlFor="nombre" className="form-label mt-4">
                  Nombre de la prenda
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Remera oversize vintage, Jean clásico..."
                  required
                  minLength={3}
                  disabled={isSubiendo}
                />
              </div>

              <div>
                <label htmlFor="precio" className="form-label mt-4">
                  Precio ($)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="precio"
                  name="precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 15000"
                  min="1"
                  step="1"
                  required
                  disabled={isSubiendo}
                  onKeyDown={(e) => {
                    if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div>
                <label htmlFor="categoria" className="form-label mt-4">
                  Categoría
                </label>
                <select
                  className="form-select"
                  id="categoria"
                  name="categoria"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  disabled={isSubiendo}
                >
                  <option value="" disabled>
                    {cargandoCategorias ? 'Cargando categorías...' : 'Seleccioná una categoría'}
                  </option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="descripcion" className="form-label mt-4">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Ej: Talle M. Medidas: 52cm sisa x 70cm largo. Estado: Impecable, sin roturas ni manchas."
                  required
                  minLength={10}
                  disabled={isSubiendo}
                />
                <small className="form-help-text">
                  Detallá el talle real, medidas aproximadas y estado o detalles de uso de la prenda.
                </small>
              </div>

              {/* Selector de imágenes con react-images-uploading */}
              <div id="seccion-fotos" className="upload-section">
                <label className="form-label mt-4">Foto de la prenda</label>

                <ImageUploading
                  value={images}
                  onChange={handleImageChange}
                  maxNumber={1}
                  dataURLKey="data_url"
                  acceptType={['jpg', 'jpeg', 'png', 'webp']}
                  maxFileSize={5 * 1024 * 1024} // 5 MB
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                    errors,
                  }) => (
                    <div className="upload-container">
                      {imageList.length === 0 ? (
                        <div
                          className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${isSubiendo ? 'is-disabled' : ''}`}
                          onClick={!isSubiendo ? onImageUpload : undefined}
                          {...(!isSubiendo ? dragProps : {})}
                        >
                          <div className="upload-icon-circle">
                            <FaCloudUploadAlt />
                          </div>
                          <p className="upload-prompt">
                            <strong>Hacé clic para seleccionar</strong> o arrastrá una foto acá
                          </p>
                          <span className="upload-specs">
                            Formatos soportados: JPG, PNG o WebP (Máx. 5 MB)
                          </span>
                        </div>
                      ) : (
                        <div className="upload-preview-wrapper">
                          {imageList.map((image, index) => (
                            <div key={index} className="upload-preview-card">
                              <div className="upload-preview-image-container">
                                <img
                                  src={image.data_url || image.dataURL}
                                  alt="Previsualización de la prenda"
                                  className="upload-preview-img"
                                />
                              </div>
                              <div className="upload-preview-details">
                                <div className="upload-preview-info">
                                  <span className="upload-filename">
                                    {image.file?.name || 'prenda-seleccionada.jpg'}
                                  </span>
                                  {image.file && (
                                    <span className="upload-filesize">
                                      {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                  )}
                                </div>
                                <div className="upload-preview-actions">
                                  <button
                                    type="button"
                                    className="upload-btn upload-btn-change"
                                    onClick={() => onImageUpdate(index)}
                                    disabled={isSubiendo}
                                    title="Elegir otra imagen"
                                  >
                                    <FaEdit /> Cambiar imagen
                                  </button>
                                  <button
                                    type="button"
                                    className="upload-btn upload-btn-remove"
                                    onClick={() => onImageRemove(index)}
                                    disabled={isSubiendo}
                                    title="Quitar foto"
                                  >
                                    <FaTrash /> Quitar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notificaciones de error de validación de imagen */}
                      {errors && (
                        <div className="upload-errors-container">
                          {errors.maxFileSize && (
                            <p className="upload-error-tag">
                              ⚠️ El archivo supera el peso máximo permitido de 5 MB.
                            </p>
                          )}
                          {errors.acceptType && (
                            <p className="upload-error-tag">
                              ⚠️ Formato incompatible. Por favor subí fotos JPG, PNG o WebP.
                            </p>
                          )}
                          {errors.maxNumber && (
                            <p className="upload-error-tag">
                              ⚠️ Solo podés subir 1 foto por prenda.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </ImageUploading>

                <small className="form-help-text">
                  Subí una foto nítida donde se aprecie claramente el estado y los detalles de la prenda.
                </small>
              </div>

              {/* Estado de carga visual */}
              {isSubiendo && (
                <div className="cargaProduct-loading-badge">
                  <FaSpinner className="spin-icon" />
                  <span>{estadoCarga || 'Subiendo imagen...'}</span>
                </div>
              )}

              <div className="cargaProduct-buttons">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => procesarEnvio('borrador')}
                  disabled={isSubiendo}
                >
                  Guardar borrador
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => procesarEnvio('crear_otra')}
                  disabled={isSubiendo}
                >
                  Publicar y crear otra
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-submit-publicar"
                  disabled={isSubiendo}
                >
                  {isSubiendo ? (
                    <>
                      <FaSpinner className="spin-icon" /> Subiendo...
                    </>
                  ) : (
                    'Publicar prenda'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CargaProduct;