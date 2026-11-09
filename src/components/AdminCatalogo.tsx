import React, { useState, useEffect, useCallback } from 'react';
import {
  FaSearch,
  FaSyncAlt,
  FaEdit,
  FaTrashAlt,
  FaBoxes,
  FaCheckCircle,
  FaTimesCircle,
  FaShoppingBag
} from 'react-icons/fa';
import './styles/AdminModeracion.css';

export interface AdminCatalogoItem {
  id: number;
  nombre?: string;
  name?: string;
  precio: number;
  price?: number;
  stock?: number;
  imagen?: string;
  image?: string;
  imagen_url?: string;
  img?: string;
  categoria?: any;
  categoria_id?: number;
  categoria_nombre?: string;
  categoria_detail?: { id: number; nombre: string };
  cat?: string[];
  estado?: string;
  status?: string;
  vendedor?: {
    id?: number | null;
    nombre?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    telefono?: string;
  } | string | null;
  vendedor_nombre?: string;
  vendedor_email?: string;
  creado_el?: string;
}

interface AdminCatalogoProps {
  onEditProduct: (
    product: AdminCatalogoItem,
    onSuccessCallback?: (updated: Partial<AdminCatalogoItem>) => void
  ) => void;
}

export const AdminCatalogo: React.FC<AdminCatalogoProps> = ({ onEditProduct }) => {
  const [productos, setProductos] = useState<AdminCatalogoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});

  const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

  const fetchCatalogo = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/admin/catalogo/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setProductos(list);
      } else {
        console.error('Error al cargar catálogo global:', res.statusText);
      }
    } catch (err) {
      console.error('Error de red al cargar catálogo global:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchCatalogo();
  }, [fetchCatalogo]);

  const handleBaja = async (prodId: number, prodNombre?: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de dar de baja la prenda "${prodNombre || `#${prodId}`}"?\n\nEsta acción ejecutará una baja lógica y marcará la prenda como ELIMINADA.`
    );
    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [prodId]: true }));
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/admin/products/${prodId}/baja/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setProductos(prev =>
          prev.map(p =>
            p.id === prodId ? { ...p, estado: 'ELIMINADO', status: 'ELIMINADO' } : p
          )
        );
        alert(`¡La prenda #${prodId} fue dada de baja correctamente!`);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.detail || errData.mensaje || 'No se pudo dar de baja la prenda.');
      }
    } catch (err) {
      console.error('Error al dar de baja:', err);
      alert('Error de conexión al dar de baja la prenda.');
    } finally {
      setActionLoading(prev => ({ ...prev, [prodId]: false }));
    }
  };

  const handleEditClick = (prod: AdminCatalogoItem) => {
    onEditProduct(prod, (updated) => {
      setProductos(prev =>
        prev.map(p => (p.id === prod.id ? { ...p, ...updated } : p))
      );
    });
  };

  const renderBadgeEstado = (estadoRaw?: string) => {
    const estado = (estadoRaw || 'DISPONIBLE').toUpperCase();
    if (estado === 'VENDIDO') {
      return (
        <span className="admin-badge badge-catalogo-vendido">
          <FaShoppingBag /> Vendido
        </span>
      );
    }
    if (estado === 'ELIMINADO' || estado === 'BAJA' || estado === 'INACTIVO') {
      return (
        <span className="admin-badge badge-catalogo-eliminado">
          <FaTimesCircle /> Eliminado
        </span>
      );
    }
    return (
      <span className="admin-badge badge-catalogo-disponible">
        <FaCheckCircle /> Disponible
      </span>
    );
  };

  const filteredProductos = productos.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nombre = (p.nombre || p.name || '').toLowerCase();
    const rawVendedor = p.vendedor;
    const vendedorStr =
      typeof rawVendedor === 'string'
        ? rawVendedor
        : rawVendedor?.nombre ||
          `${rawVendedor?.first_name || ''} ${rawVendedor?.last_name || ''}` ||
          p.vendedor_nombre ||
          '';
    const emailStr =
      typeof rawVendedor === 'object'
        ? rawVendedor?.email || p.vendedor_email || ''
        : p.vendedor_email || '';

    const catNombre =
      p.categoria_nombre ||
      p.categoria_detail?.nombre ||
      (typeof p.categoria === 'object' ? p.categoria?.nombre : '') ||
      (typeof p.categoria === 'string' ? p.categoria : '') ||
      '';

    return (
      nombre.includes(term) ||
      vendedorStr.toLowerCase().includes(term) ||
      emailStr.toLowerCase().includes(term) ||
      catNombre.toLowerCase().includes(term) ||
      String(p.id).includes(term)
    );
  });

  if (loading) {
    return (
      <div className="admin-pedidos-loading">
        <FaSyncAlt className="admin-spin" style={{ fontSize: '36px', color: '#F6C417', marginBottom: '14px' }} />
        <p>Cargando catálogo global de inventario...</p>
      </div>
    );
  }

  return (
    <div className="admin-pedidos-container">
      <div className="admin-pedidos-toolbar">
        <div className="admin-pedidos-search">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Buscar por prenda, ID, categoría o vendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={fetchCatalogo}
          className="admin-pedidos-refresh-btn"
          title="Actualizar catálogo global"
        >
          <FaSyncAlt /> Actualizar
        </button>
      </div>

      {filteredProductos.length === 0 ? (
        <div className="admin-mod-vacio">
          <FaBoxes style={{ fontSize: '48px', color: '#F6C417', marginBottom: '12px' }} />
          <h3>Sin prendas para mostrar</h3>
          <p>
            {searchTerm
              ? 'No se encontraron prendas que coincidan con la búsqueda.'
              : 'No hay prendas registradas en el catálogo global por el momento.'}
          </p>
        </div>
      ) : (
        <div className="admin-pedidos-table-wrapper">
          <table className="admin-pedidos-table">
            <thead>
              <tr>
                <th>Prenda</th>
                <th>Categoría</th>
                <th>Precio y Stock</th>
                <th>Estado</th>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((prod) => {
                const nombre = prod.nombre || prod.name || 'Prenda sin nombre';
                const precio = Number(prod.precio ?? prod.price ?? 0);
                const stock = Number(prod.stock ?? 1);

                const rawImg = String(prod.imagen || prod.image || prod.imagen_url || prod.img || '');
                const portada =
                  rawImg
                    .split(',')
                    .map((url: string) => url.trim())
                    .filter(Boolean)[0] || '/src/data/img/remera-negra-manga-corta.png';

                const catNombre =
                  prod.categoria_nombre ||
                  prod.categoria_detail?.nombre ||
                  (typeof prod.categoria === 'object' ? prod.categoria?.nombre : '') ||
                  (typeof prod.categoria === 'string' ? prod.categoria : '') ||
                  'General';

                const rawVendedor = prod.vendedor;
                const vendedorNombre =
                  typeof rawVendedor === 'string' && rawVendedor !== 'Repilche'
                    ? rawVendedor
                    : typeof rawVendedor === 'object' && rawVendedor?.nombre
                    ? rawVendedor.nombre
                    : typeof rawVendedor === 'object' && rawVendedor?.first_name
                    ? `${rawVendedor.first_name} ${rawVendedor.last_name || ''}`.trim()
                    : prod.vendedor_nombre || 'Repilche Oficial';

                const vendedorEmail =
                  typeof rawVendedor === 'object'
                    ? rawVendedor?.email || prod.vendedor_email || '-'
                    : prod.vendedor_email || '-';

                const estado = (prod.estado || prod.status || 'DISPONIBLE').toUpperCase();
                const isEliminado = estado === 'ELIMINADO' || estado === 'BAJA' || estado === 'INACTIVO';
                const isBajaLoading = Boolean(actionLoading[prod.id]);

                return (
                  <tr key={prod.id}>
                    {/* Prenda */}
                    <td className="cell-prenda">
                      <div className="admin-prenda-content">
                        <img
                          src={portada}
                          alt={nombre}
                          className="admin-item-thumb"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/data/img/remera-negra-manga-corta.png';
                          }}
                        />
                        <div className="admin-item-details">
                          <span className="admin-item-name" title={nombre}>
                            {nombre}
                          </span>
                          <span className="admin-text-muted">ID: #{prod.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td>
                      <span className="admin-cat-badge">{catNombre}</span>
                    </td>

                    {/* Precio y Stock */}
                    <td className="cell-monto">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="admin-monto-total">
                          ${precio.toLocaleString('es-AR')}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: stock > 0 ? '#4b5563' : '#dc2626'
                          }}
                        >
                          Stock: {stock} {stock <= 0 && '(Agotado)'}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td>{renderBadgeEstado(estado)}</td>

                    {/* Vendedor */}
                    <td className="cell-usuario">
                      <div className="admin-usuario-box">
                        <span className="admin-usuario-nombre">{vendedorNombre}</span>
                        <span className="admin-usuario-email">{vendedorEmail}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="cell-acciones">
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="admin-btn-action admin-mod-btn-editar-card"
                          onClick={() => handleEditClick(prod)}
                          title="Editar título, precio o categoría"
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          type="button"
                          className="admin-btn-action admin-btn-baja"
                          disabled={isEliminado || isBajaLoading}
                          onClick={() => handleBaja(prod.id, nombre)}
                          title={isEliminado ? 'La prenda ya se encuentra dada de baja' : 'Dar de baja prenda del catálogo'}
                        >
                          <FaTrashAlt /> {isBajaLoading ? 'Dando baja...' : isEliminado ? 'De baja' : 'Dar de baja'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCatalogo;

