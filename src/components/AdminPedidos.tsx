import React, { useState, useEffect, useCallback } from 'react';
import {
  FaShoppingBag,
  FaWhatsapp,
  FaCheckCircle,
  FaTruck,
  FaSyncAlt,
  FaClock,
  FaTimes,
  FaShieldAlt,
  FaSearch
} from 'react-icons/fa';
import './styles/AdminModeracion.css';

export interface AdminItemPedido {
  id: number;
  producto_id?: number | null;
  producto_nombre?: string;
  producto_imagen?: string;
  precio: number;
  precio_unitario?: number;
  cantidad: number;
  subtotal: number;
  codigo_secreto: string;
  estado_entrega: string;
  vendedor?: {
    id: number | null;
    nombre: string;
    email: string;
    telefono: string;
  } | null;
  creado_el?: string;
}

export interface AdminComprador {
  id: number | null;
  nombre: string;
  email: string;
  telefono: string;
}

export interface AdminPedido {
  id: number;
  creado_el: string;
  fecha?: string;
  total: number;
  estado_pago: string;
  alias_pago?: string;
  comprobante?: string;
  comprador?: AdminComprador | null;
  items: AdminItemPedido[];
  actualizado_el?: string;
}

export const formatFecha = (isoString?: string): string => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return isoString;
  }
};

export const formatMonto = (val?: number): string => {
  if (val === undefined || val === null) return '$0';
  return `$${Number(val).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const getWhatsAppUrl = (telefono?: string): string | null => {
  if (!telefono) return null;
  const cleaned = telefono.replace(/\D/g, '');
  if (!cleaned || cleaned.length < 6) return null;
  const fullNumber = cleaned.startsWith('54') ? cleaned : `549${cleaned.replace(/^0+/, '')}`;
  return `https://wa.me/${fullNumber}`;
};

export const AdminPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<AdminPedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/admin/pedidos/`, {
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
        setPedidos(list);
      } else {
        console.error('Error al cargar pedidos de administración:', res.statusText);
      }
    } catch (err) {
      console.error('Error de red al cargar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleConfirmarPago = async (pedidoId: number) => {
    const btnKey = `pago-${pedidoId}`;
    setActionLoading(prev => ({ ...prev, [btnKey]: true }));
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/admin/pedidos/${pedidoId}/confirmar-pago/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setPedidos(prev =>
          prev.map(p =>
            p.id === pedidoId ? { ...p, estado_pago: 'PAGADO' } : p
          )
        );
        alert(`¡Pago del pedido #${pedidoId} confirmado con éxito!`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.mensaje || data.detail || 'No se pudo confirmar el pago.');
      }
    } catch (err) {
      console.error('Error al confirmar pago:', err);
      alert('Error de conexión al confirmar el pago.');
    } finally {
      setActionLoading(prev => ({ ...prev, [btnKey]: false }));
    }
  };

  const handleForzarEntrega = async (itemId: number, pedidoId: number, productName?: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de forzar la entrega y liberar custodia para "${productName || `Ítem #${itemId}`}"?\n\nEsta acción marcará el ítem como ENTREGADO y liberará los fondos.`
    );
    if (!confirmed) return;

    const btnKey = `entrega-${itemId}`;
    setActionLoading(prev => ({ ...prev, [btnKey]: true }));
    try {
      const token = localStorage.getItem('repilche-token') || localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/admin/pedidos/items/${itemId}/forzar-entrega/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setPedidos(prev =>
          prev.map(p => {
            if (p.id !== pedidoId) return p;
            const updatedItems = (p.items || []).map(item =>
              item.id === itemId ? { ...item, estado_entrega: 'ENTREGADO' } : item
            );
            const allDelivered = updatedItems.length > 0 && updatedItems.every(i => i.estado_entrega === 'ENTREGADO');
            return {
              ...p,
              estado_pago: allDelivered ? 'PAGADO' : p.estado_pago,
              items: updatedItems
            };
          })
        );
        alert(`¡Custodia liberada y entrega del ítem #${itemId} forzada con éxito!`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.mensaje || data.detail || 'No se pudo forzar la entrega.');
      }
    } catch (err) {
      console.error('Error al forzar entrega:', err);
      alert('Error de conexión al forzar la entrega.');
    } finally {
      setActionLoading(prev => ({ ...prev, [btnKey]: false }));
    }
  };

  const renderBadgePago = (estado?: string) => {
    const upper = (estado || 'PENDIENTE').toUpperCase();
    if (upper === 'PAGADO') {
      return (
        <span className="admin-badge badge-pago-pagado" title="Pago acreditado y verificado">
          <FaCheckCircle /> Pagado
        </span>
      );
    }
    if (upper === 'CANCELADO') {
      return (
        <span className="admin-badge badge-pago-cancelado" title="Pedido cancelado">
          <FaTimes /> Cancelado
        </span>
      );
    }
    return (
      <span className="admin-badge badge-pago-pendiente" title="Pago pendiente de acreditación">
        <FaClock /> Pendiente
      </span>
    );
  };

  const renderBadgeEntrega = (estado?: string) => {
    const upper = (estado || 'PENDIENTE').toUpperCase();
    if (upper === 'ENTREGADO') {
      return (
        <span className="admin-badge badge-entrega-entregado" title="Prenda entregada y custodia liberada">
          <FaTruck /> Entregado
        </span>
      );
    }
    if (upper === 'CANCELADO') {
      return (
        <span className="admin-badge badge-entrega-cancelado" title="Entrega cancelada">
          <FaTimes /> Cancelado
        </span>
      );
    }
    return (
      <span className="admin-badge badge-entrega-pendiente" title="Prenda en custodia / pendiente de retiro">
        <FaClock /> Por Entregar
      </span>
    );
  };

  // Filtrado simple por ID de pedido, nombre de comprador o producto
  const filteredPedidos = pedidos.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const idMatch = String(p.id).includes(term);
    const compradorMatch = p.comprador?.nombre?.toLowerCase().includes(term) || p.comprador?.email?.toLowerCase().includes(term);
    const itemMatch = (p.items || []).some(i => i.producto_nombre?.toLowerCase().includes(term) || i.codigo_secreto?.includes(term));
    return idMatch || compradorMatch || itemMatch;
  });

  if (loading) {
    return (
      <div className="admin-pedidos-loading">
        <FaSyncAlt className="admin-spin" style={{ fontSize: '36px', color: '#F6C417', marginBottom: '14px' }} />
        <p>Cargando monitoreo de compras...</p>
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
            placeholder="Buscar por N° pedido, comprador, prenda o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={fetchPedidos}
          className="admin-pedidos-refresh-btn"
          title="Actualizar listado de compras"
        >
          <FaSyncAlt /> Actualizar
        </button>
      </div>

      {filteredPedidos.length === 0 ? (
        <div className="admin-mod-vacio">
          <FaShoppingBag style={{ fontSize: '48px', color: '#F6C417', marginBottom: '12px' }} />
          <h3>Sin compras para mostrar</h3>
          <p>
            {searchTerm
              ? 'No se encontraron pedidos que coincidan con la búsqueda.'
              : 'No hay pedidos registrados en el sistema por el momento.'}
          </p>
        </div>
      ) : (
        <div className="admin-pedidos-table-wrapper">
          <table className="admin-pedidos-table">
            <thead>
              <tr>
                <th>N° Pedido y Fecha</th>
                <th>Prenda</th>
                <th>Comprador</th>
                <th>Vendedor</th>
                <th>Monto</th>
                <th>Código de Retiro</th>
                <th>Estado y Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPedidos.map((pedido) => {
                const items = pedido.items && pedido.items.length > 0 ? pedido.items : [
                  {
                    id: 0,
                    producto_nombre: 'Sin ítems cargados',
                    producto_imagen: '',
                    precio: pedido.total,
                    cantidad: 1,
                    subtotal: pedido.total,
                    codigo_secreto: '',
                    estado_entrega: 'PENDIENTE',
                    vendedor: null
                  }
                ];

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const compradorRaw = pedido.comprador as any;
                const compradorNombre =
                  pedido.comprador?.nombre ||
                  (compradorRaw?.first_name
                    ? `${compradorRaw.first_name} ${compradorRaw.last_name || ''}`.trim()
                    : (pedido as any)?.comprador_nombre || 'Comprador Anónimo');
                const compradorEmail = pedido.comprador?.email || (pedido as any)?.comprador_email || '-';
                const compradorTel = pedido.comprador?.telefono || compradorRaw?.phone || (pedido as any)?.comprador_telefono || '';
                const waComprador = getWhatsAppUrl(compradorTel);

                return items.map((item, idx) => {
                  const isFirstItem = idx === 0;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const itemRaw = item as any;
                  const vendedorRaw = item.vendedor as any;
                  const vendedorNombre =
                    item.vendedor?.nombre ||
                    (vendedorRaw?.first_name
                      ? `${vendedorRaw.first_name} ${vendedorRaw.last_name || ''}`.trim()
                      : itemRaw?.vendedor_nombre || 'Repilche Oficial');
                  const vendedorEmail = item.vendedor?.email || vendedorRaw?.email || itemRaw?.vendedor_email || '-';
                  const vendedorTel = item.vendedor?.telefono || vendedorRaw?.phone || itemRaw?.vendedor_telefono || '';
                  const waVendedor = getWhatsAppUrl(vendedorTel);

                  const isPagoPendiente = (pedido.estado_pago || '').toUpperCase() === 'PENDIENTE';
                  const isEntregaPendiente = (item.estado_entrega || '').toUpperCase() !== 'ENTREGADO' && (item.estado_entrega || '').toUpperCase() !== 'CANCELADO';
                  const isPagoLoading = Boolean(actionLoading[`pago-${pedido.id}`]);
                  const isEntregaLoading = Boolean(actionLoading[`entrega-${item.id}`]);

                  const codigoRetiro = item.codigo_secreto || itemRaw?.codigo || itemRaw?.codigo_entrega || itemRaw?.codigo_retiro || '';
                  const itemNombre = item.producto_nombre || itemRaw?.nombre || itemRaw?.producto?.nombre || itemRaw?.producto?.name || 'Prenda';
                  const itemImgRaw = item.producto_imagen || itemRaw?.imagen || itemRaw?.producto?.imagen || itemRaw?.producto?.img || '';

                  const portada =
                    String(itemImgRaw)
                      .split(',')
                      .map((url: string) => url.trim())
                      .filter(Boolean)[0] || '/src/data/img/remera-negra-manga-corta.png';

                  return (
                    <tr
                      key={`${pedido.id}-${item.id}-${idx}`}
                      className={idx % 2 === 0 ? 'row-even' : 'row-odd'}
                    >
                      {/* N° Pedido y Fecha */}
                      {isFirstItem ? (
                        <td rowSpan={items.length} className="cell-pedido-info">
                          <div className="admin-pedido-id">#{pedido.id}</div>
                          <div className="admin-pedido-fecha">
                            <FaClock style={{ fontSize: '11px', marginRight: '4px' }} />
                            {formatFecha(pedido.creado_el || pedido.fecha)}
                          </div>
                        </td>
                      ) : null}

                      {/* Prenda */}
                      <td className="cell-prenda">
                        <div className="admin-prenda-content">
                          <img
                            src={portada}
                            alt={itemNombre}
                            className="admin-item-thumb"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/src/data/img/remera-negra-manga-corta.png';
                            }}
                          />
                          <div className="admin-item-details">
                            <span className="admin-item-name" title={itemNombre}>
                              {itemNombre}
                            </span>
                            {item.cantidad > 1 && (
                              <span className="admin-item-cantidad">Cant: {item.cantidad}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Comprador */}
                      {isFirstItem ? (
                        <td rowSpan={items.length} className="cell-usuario">
                          <div className="admin-usuario-box">
                            <span className="admin-usuario-nombre">
                              {compradorNombre}
                            </span>
                            <span className="admin-usuario-email">{compradorEmail}</span>
                            {waComprador ? (
                              <a
                                href={waComprador}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-whatsapp-btn"
                                title={`Abrir WhatsApp con ${compradorNombre}`}
                              >
                                <FaWhatsapp /> {compradorTel}
                              </a>
                            ) : compradorTel ? (
                              <span className="admin-text-muted">{compradorTel}</span>
                            ) : (
                              <span className="admin-text-muted">Sin teléfono</span>
                            )}
                          </div>
                        </td>
                      ) : null}

                      {/* Vendedor */}
                      <td className="cell-usuario">
                        <div className="admin-usuario-box">
                          <span className="admin-usuario-nombre">
                            {vendedorNombre}
                          </span>
                          <span className="admin-usuario-email">{vendedorEmail}</span>
                          {waVendedor ? (
                            <a
                              href={waVendedor}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-whatsapp-btn"
                              title={`Abrir WhatsApp con ${vendedorNombre}`}
                            >
                              <FaWhatsapp /> {vendedorTel}
                            </a>
                          ) : vendedorTel ? (
                            <span className="admin-text-muted">{vendedorTel}</span>
                          ) : (
                            <span className="admin-text-muted">Sin teléfono</span>
                          )}
                        </div>
                      </td>

                      {/* Monto */}
                      {isFirstItem ? (
                        <td rowSpan={items.length} className="cell-monto">
                          <span className="admin-monto-total">{formatMonto(pedido.total)}</span>
                        </td>
                      ) : null}

                      {/* Código de Retiro */}
                      <td className="cell-codigo">
                        <div
                          className="admin-codigo-box"
                          title="Código de 6 dígitos para validar retiro/entrega"
                        >
                          {codigoRetiro ? (
                            <span className="admin-codigo-text">{codigoRetiro}</span>
                          ) : (
                            <span className="admin-codigo-placeholder">------</span>
                          )}
                        </div>
                      </td>

                      {/* Estado y Acciones */}
                      <td className="cell-acciones">
                        <div className="admin-acciones-wrapper">
                          {/* Estado y acción de pago (se muestra una vez por pedido) */}
                          {isFirstItem && (
                            <div className="admin-accion-bloque">
                              <div className="admin-badge-line">
                                <span className="admin-sublabel">Pago:</span>
                                {renderBadgePago(pedido.estado_pago)}
                              </div>
                              {isPagoPendiente && (
                                <button
                                  type="button"
                                  className="admin-btn-action admin-btn-pago"
                                  disabled={isPagoLoading}
                                  onClick={() => handleConfirmarPago(pedido.id)}
                                  title="Confirmar acreditación de transferencia/pago"
                                >
                                  <FaCheckCircle /> {isPagoLoading ? 'Confirmando...' : 'Confirmar Pago'}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Estado y acción de entrega (por ítem) */}
                          <div className="admin-accion-bloque">
                            <div className="admin-badge-line">
                              <span className="admin-sublabel">Entrega:</span>
                              {renderBadgeEntrega(item.estado_entrega)}
                            </div>
                            {item.id > 0 && isEntregaPendiente && (
                              <button
                                type="button"
                                className="admin-btn-action admin-btn-entrega"
                                disabled={isEntregaLoading}
                                onClick={() => handleForzarEntrega(item.id, pedido.id, item.producto_nombre)}
                                title="Liberar custodia y forzar entrega administrativamente"
                              >
                                <FaShieldAlt /> {isEntregaLoading ? 'Liberando...' : 'Liberar Custodia'}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
