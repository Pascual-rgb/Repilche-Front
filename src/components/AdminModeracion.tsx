import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';
import '../components/styles/CheckoutModal.css'; 
import './styles/AdminModeracion.css';

interface PrendaPendiente {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  vendedor: string;
}

export const AdminModeracion = () => {
  const [pendientes, setPendientes] = useState<PrendaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<PrendaPendiente | null>(null);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const token = localStorage.getItem('repilche-token');
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
      const token = localStorage.getItem('repilche-token');
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
      const token = localStorage.getItem('repilche-token');
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

  if (loading) {
    return <div className="admin-mod-container"><p>Cargando solicitudes de moderación...</p></div>;
  }

  return (
    <div className="admin-mod-container">
      <div className="admin-mod-header">
        <h1>Panel de Moderación</h1>
        <p>Aproba o rechaza las prendas enviadas por los usuarios antes de que aparezcan en el catálogo general.</p>
      </div>

      {pendientes.length === 0 ? (
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
                <span className="admin-mod-precio">${product.precio}</span>
              </div>
            </div>
            );
          })}
        </div>
      )}

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
    </div>
  );
};

export default AdminModeracion;