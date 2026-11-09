import React, { useState, useEffect, useRef } from 'react';
import {
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaShoppingBag,
  FaEdit,
  FaBoxes,
  FaLock,
  FaTruck
} from 'react-icons/fa';
import '../components/styles/CheckoutModal.css'; 
import './styles/AdminModeracion.css';
import AdminPedidos from './AdminPedidos';
import AdminCatalogo from './AdminCatalogo';

interface PrendaPendiente {
  id: number;
  nombre: string;
  name?: string;
  descripcion: string;
  precio: number;
  price?: number;
  imagen: string;
  vendedor: string;
  categoria?: any;
  categoria_id?: number;
  categoria_nombre?: string;
}

export const AdminModeracion = () => {
  const [activeTab, setActiveTab] = useState<'moderacion' | 'compras' | 'catalogo'>('moderacion');
  const [pendientes, setPendientes] = useState<PrendaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<PrendaPendiente | null>(null);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Métricas de Resumen Superior
  const [metricas, setMetricas] = useState<{
    dinero_en_custodia?: number;
    pendientes_entrega?: number;
    en_moderacion?: number;
    [key: string]: any;
  } | null>(null);

  // Lista de Categorías para Edición Rápida
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);

  // Estado para Edición Rápida
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState<number | string>('');
  const [editCategoriaId, setEditCategoriaId] = useState<number | string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const onEditSavedCallbackRef = useRef<((updated: any) => void) | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
        const res = await fetch(`${apiUrl}/products/pendientes/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPendientes(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Error al cargar pendientes de moderación:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendientes();
  }, [apiUrl]);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
        const res = await fetch(`${apiUrl}/admin/metricas-resumen/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setMetricas(data);
        }
      } catch (err) {
        console.warn('Error al cargar métricas de administración:', err);
      }
    };

    fetchMetricas();
  }, [apiUrl, pendientes.length]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${apiUrl}/categorias/`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.results || [];
          setCategorias(list);
        }
      } catch (err) {
        console.warn('Error al cargar categorías para admin:', err);
      }
    };

    fetchCategorias();
  }, [apiUrl]);

  const handleAprobar = async (id: number) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/products/${id}/aprobar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setPendientes(prev => prev.filter(p => p.id !== id));
        setSelectedProduct(null);
      } else {
        alert('No se pudo aprobar la prenda.');
      }
    } catch (err) {
      console.error('Error al aprobar:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRechazarConfirm = async () => {
    if (!selectedProduct || !motivoRechazo.trim()) {
      alert('Debes ingresar un motivo de rechazo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/products/${selectedProduct.id}/rechazar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo: motivoRechazo })
      });

      if (res.ok) {
        setPendientes(prev => prev.filter(p => p.id !== selectedProduct.id));
        setShowRejectModal(false);
        setMotivoRechazo('');
        setSelectedProduct(null);
      } else {
        alert('No se pudo rechazar la prenda.');
      }
    } catch (err) {
      console.error('Error al rechazar:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (
    product: any,
    e?: React.MouseEvent,
    onSuccess?: (updated: any) => void
  ) => {
    if (e) {
      e.stopPropagation();
    }
    onEditSavedCallbackRef.current = onSuccess || null;
    setEditingProduct(product);
    setEditNombre(product.nombre || product.name || '');
    setEditPrecio(product.precio ?? product.price ?? '');
    const catId =
      product.categoria_id ??
      (typeof product.categoria === 'number'
        ? product.categoria
        : product.categoria?.id ?? '');
    setEditCategoriaId(catId);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const trimmedNombre = editNombre.trim();
    if (!trimmedNombre) {
      alert('El título no puede estar vacío.');
      return;
    }

    const numericPrecio = Number(editPrecio);
    if (isNaN(numericPrecio) || numericPrecio <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0.');
      return;
    }

    setIsSavingEdit(true);
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const numericCatId = editCategoriaId !== '' ? Number(editCategoriaId) : null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodyPayload: Record<string, any> = {
        nombre: trimmedNombre,
        name: trimmedNombre,
        precio: numericPrecio,
        price: numericPrecio
      };
      if (numericCatId) {
        bodyPayload.categoria = numericCatId;
        bodyPayload.categoria_id = numericCatId;
      }

      const res = await fetch(`${apiUrl}/admin/products/${editingProduct.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        const selectedCat = categorias.find(c => c.id === numericCatId);
        const updatedFields = {
          nombre: trimmedNombre,
          name: trimmedNombre,
          precio: numericPrecio,
          price: numericPrecio,
          categoria_id: numericCatId || undefined,
          categoria_nombre: selectedCat?.nombre || undefined
        };

        setPendientes(prev =>
          prev.map(p =>
            p.id === editingProduct.id
              ? { ...p, ...updatedFields }
              : p
          )
        );

        if (selectedProduct && selectedProduct.id === editingProduct.id) {
          setSelectedProduct({
            ...selectedProduct,
            ...updatedFields
          });
        }

        if (onEditSavedCallbackRef.current) {
          onEditSavedCallbackRef.current(updatedFields);
        }

        setEditingProduct(null);
        alert('Prenda actualizada con éxito.');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Error al guardar cambios: ${errData.detail || errData.mensaje || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('Error al editar prenda:', err);
      alert('Error de conexión al actualizar la prenda.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const dineroCustodia =
    metricas?.dinero_en_custodia ??
    metricas?.total_custodia ??
    metricas?.monto_custodia ??
    metricas?.custodia ??
    0;

  const pendientesEntrega =
    metricas?.pendientes_entrega ??
    metricas?.compras_en_curso ??
    metricas?.pedidos_pendientes ??
    0;

  const enModeracion =
    metricas?.en_moderacion ??
    metricas?.prendas_moderacion ??
    metricas?.pendientes_moderacion ??
    pendientes.length;

  const formatPesos = (val?: number): string => {
    if (val === undefined || val === null) return '$0';
    return `$${Number(val).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="admin-mod-container">
      <div className="admin-mod-header">
        <h1>Panel de Administración</h1>
        <p>Control de catálogo, moderación de prendas y supervisión de compras en tiempo real.</p>

        {/* 1. Barra Superior de Métricas Rápidas */}
        <div className="admin-metrics-grid">
          <div className="admin-metric-card">
            <div className="admin-metric-icon icon-custodia">
              <FaLock />
            </div>
            <div className="admin-metric-info">
              <span className="admin-metric-label">Dinero en Custodia</span>
              <span className="admin-metric-value">{formatPesos(dineroCustodia)}</span>
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-icon icon-entrega">
              <FaTruck />
            </div>
            <div className="admin-metric-info">
              <span className="admin-metric-label">Pendientes de Entrega</span>
              <span className="admin-metric-value">{pendientesEntrega}</span>
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-icon icon-moderacion">
              <FaShieldAlt />
            </div>
            <div className="admin-metric-info">
              <span className="admin-metric-label">En Moderación</span>
              <span className="admin-metric-value">{enModeracion}</span>
            </div>
          </div>
        </div>

        {/* 2. Sistema de Navegación por Pestañas */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'moderacion' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderacion')}
          >
            <FaShieldAlt /> Moderación de Prendas
            {pendientes.length > 0 && (
              <span className="admin-tab-badge">{pendientes.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'compras' ? 'active' : ''}`}
            onClick={() => setActiveTab('compras')}
          >
            <FaShoppingBag /> Monitoreo de Compras
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'catalogo' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalogo')}
          >
            <FaBoxes /> Catálogo Global
          </button>
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'compras' ? (
        <AdminPedidos />
      ) : activeTab === 'catalogo' ? (
        <AdminCatalogo onEditProduct={(prod, callback) => handleOpenEdit(prod, undefined, callback)} />
      ) : (
        <>
          {loading ? (
            <div className="admin-mod-container"><p>Cargando solicitudes de moderación...</p></div>
          ) : pendientes.length === 0 ? (
            <div className="admin-mod-vacio">
              <FaShieldAlt style={{ fontSize: '48px', color: '#F6C417', marginBottom: '12px' }} />
              <h3>¡Todo al día!</h3>
              <p>No hay solicitudes pendientes de moderación en este momento.</p>
            </div>
          ) : (
            <div className="admin-mod-grid">
              {pendientes.map((product) => {
                const portada =
                  (product.imagen || '')
                    .split(',')
                    .map((url: string) => url.trim())
                    .filter(Boolean)[0] || '/src/data/img/remera-negra-manga-corta.png';
                return (
                  <div key={product.id} className="admin-mod-card" onClick={() => setSelectedProduct(product)}>
                    <img src={portada} alt={product.nombre} loading="lazy" decoding="async" />
                    <div className="admin-mod-card-info">
                      <h3>{product.nombre}</h3>
                      <p><strong>Vendedor:</strong> {product.vendedor}</p>
                      <div className="admin-mod-card-footer">
                        <span className="admin-mod-precio">${product.precio}</span>
                        <button
                          type="button"
                          className="admin-mod-btn-editar-card"
                          onClick={(e) => handleOpenEdit(product, e)}
                          title="Editar título, precio o categoría"
                        >
                          <FaEdit /> Editar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal de Detalle de Prenda (Moderación) */}
          {selectedProduct && (
            <div className="checkout-modal-overlay" onClick={() => setSelectedProduct(null)}>
              <div className="checkout-modal-card admin-detalle-modal" onClick={(e) => e.stopPropagation()}>
                <button className="checkout-modal-close" onClick={() => setSelectedProduct(null)}>✕</button>

                <div className="admin-detalle-content">
                  <div className="admin-detalle-img">
                    <img
                      src={
                        (selectedProduct.imagen || '')
                          .split(',')
                          .map((url: string) => url.trim())
                          .filter(Boolean)[0] || '/src/data/img/remera-negra-manga-corta.png'
                      }
                      alt={selectedProduct.nombre}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="admin-detalle-info">
                    <h2>{selectedProduct.nombre}</h2>
                    <p className="admin-detalle-desc"><strong>Descripción:</strong> {selectedProduct.descripcion}</p>
                    <p><strong>Vendedor:</strong> {selectedProduct.vendedor}</p>
                    <div className="checkout-monto-valor" style={{ fontSize: '24px', margin: '10px 0' }}>
                      ${selectedProduct.precio}
                    </div>

                    <div className="admin-acciones-btns">
                      <button 
                        type="button" 
                        className="checkout-btn-seguir" 
                        style={{ background: '#f3f4f6', color: '#1f2937', borderColor: '#d1d5db' }}
                        onClick={() => handleOpenEdit(selectedProduct)}
                        disabled={isSubmitting}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button 
                        type="button" 
                        className="checkout-btn-seguir" 
                        style={{ background: '#ffebee', color: '#c62828', borderColor: '#ffcdd2' }}
                        onClick={() => setShowRejectModal(true)}
                        disabled={isSubmitting}
                      >
                        <FaTimes /> Rechazar
                      </button>
                      <button 
                        type="button" 
                        className="checkout-btn-compras"
                        onClick={() => handleAprobar(selectedProduct.id)}
                        disabled={isSubmitting}
                      >
                        <FaCheck /> Aprobar Prenda
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal de Rechazo */}
          {showRejectModal && (
            <div className="checkout-modal-overlay" style={{ zIndex: 10001 }}>
              <div className="checkout-modal-card" style={{ maxWidth: '400px' }}>
                <div className="checkout-modal-header">
                  <h2>Motivo de rechazo</h2>
                  <p>Explicá brevemente por qué se rechaza la prenda para que el usuario pueda corregirlo.</p>
                </div>

                <textarea
                  className="form-control"
                  rows={4}
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Ej: La foto no es clara o la descripción está incompleta..."
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    className="checkout-btn-seguir" 
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="checkout-btn-compras" 
                    style={{ background: '#c62828', color: '#fff' }}
                    onClick={handleRechazarConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Confirmar Rechazo'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Edición Rápida (Accesible desde Moderación y Catálogo Global) */}
      {editingProduct && (
        <div className="checkout-modal-overlay" style={{ zIndex: 10002 }} onClick={() => setEditingProduct(null)}>
          <div className="checkout-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <button className="checkout-modal-close" onClick={() => setEditingProduct(null)}>✕</button>
            <div className="checkout-modal-header">
              <h2>Edición Rápida de Prenda</h2>
              <p>Corregí el título, precio o categoría de la prenda.</p>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Título / Nombre de la prenda
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Precio en ARS ($)
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  className="form-control"
                  value={editPrecio}
                  onChange={(e) => setEditPrecio(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Categoría
                </label>
                <select
                  className="form-control"
                  value={editCategoriaId}
                  onChange={(e) => setEditCategoriaId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="">-- Sin categoría asignada --</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="checkout-btn-seguir" 
                  onClick={() => setEditingProduct(null)}
                  disabled={isSavingEdit}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="checkout-btn-compras" 
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModeracion;
