import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaShieldAlt, FaShoppingBag, FaEdit } from 'react-icons/fa';
import '../components/styles/CheckoutModal.css'; 
import './styles/AdminModeracion.css';
import AdminPedidos from './AdminPedidos';

interface PrendaPendiente {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  vendedor: string;
}

export const AdminModeracion = () => {
  const [activeTab, setActiveTab] = useState<'moderacion' | 'compras'>('moderacion');
  const [pendientes, setPendientes] = useState<PrendaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<PrendaPendiente | null>(null);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para Edición Rápida
  const [editingProduct, setEditingProduct] = useState<PrendaPendiente | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState<number | string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const handleOpenEdit = (product: PrendaPendiente, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEditingProduct(product);
    setEditNombre(product.nombre);
    setEditPrecio(product.precio);
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
      const res = await fetch(`${apiUrl}/admin/products/${editingProduct.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: trimmedNombre,
          name: trimmedNombre,
          precio: numericPrecio,
          price: numericPrecio
        })
      });

      if (res.ok) {
        setPendientes(prev =>
          prev.map(p =>
            p.id === editingProduct.id
              ? { ...p, nombre: trimmedNombre, precio: numericPrecio }
              : p
          )
        );

        if (selectedProduct && selectedProduct.id === editingProduct.id) {
          setSelectedProduct({
            ...selectedProduct,
            nombre: trimmedNombre,
            precio: numericPrecio
          });
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

  return (
    <div className="admin-mod-container">
      <div className="admin-mod-header">
        <h1>Panel de Administración</h1>
        <p>Control de catálogo, moderación de prendas y supervisión de compras en tiempo real.</p>

        {/* Sistema de Navegación por Pestañas */}
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
        </div>
      </div>

      {activeTab === 'compras' ? (
        <AdminPedidos />
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
                    <img src={portada} alt={product.nombre} />
                    <div className="admin-mod-card-info">
                      <h3>{product.nombre}</h3>
                      <p><strong>Vendedor:</strong> {product.vendedor}</p>
                      <div className="admin-mod-card-footer">
                        <span className="admin-mod-precio">${product.precio}</span>
                        <button
                          type="button"
                          className="admin-mod-btn-editar-card"
                          onClick={(e) => handleOpenEdit(product, e)}
                          title="Editar título o precio"
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

          {/* Modal de Detalle de Prenda */}
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

          {/* Modal de Edición Rápida */}
          {editingProduct && (
            <div className="checkout-modal-overlay" style={{ zIndex: 10002 }} onClick={() => setEditingProduct(null)}>
              <div className="checkout-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
                <button className="checkout-modal-close" onClick={() => setEditingProduct(null)}>✕</button>
                <div className="checkout-modal-header">
                  <h2>Edición Rápida de Prenda</h2>
                  <p>Corregí el título o precio antes de aprobar la prenda.</p>
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

                  <div style={{ marginBottom: '24px', textAlign: 'left' }}>
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
        </>
      )}
    </div>
  );
};

export default AdminModeracion;
