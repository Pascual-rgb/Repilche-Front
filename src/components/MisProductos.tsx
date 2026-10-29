import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Products } from "../data/products";
import { useAuthContext } from "../context/AuthContext";
import "./styles/MisListas.css";

const MisProductos = () => {
  const { user } = useAuthContext();
  const [misProductos, setMisProductos] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMisProductos = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";
        const token = localStorage.getItem("repilche-token");

        const res = await fetch(`${apiUrl}/products/`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : data?.results || [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalized: Products[] = rawList.map((item: any, idx: number) => {
            const rawCat = item?.categoria;
            const catId = item?.categoria_id ?? (typeof rawCat === 'number' ? rawCat : rawCat?.id);
            const catNombre =
              item?.categoria_nombre ||
              item?.categoria_detail?.nombre ||
              (typeof rawCat === 'string' ? rawCat : rawCat?.nombre) ||
              '';

            const catList: string[] = Array.isArray(item?.cat)
              ? item.cat
              : catNombre
              ? [catNombre]
              : ['General'];

            return {
              id: item?.id ?? idx + 1,
              name: item?.name || item?.nombre || "Prenda sin nombre",
              descrp: item?.descrp || item?.descripcion || item?.description || "Sin descripción disponible",
              img: item?.imagen_url || item?.imagen || item?.image || item?.img || "/src/data/img/remera-negra-manga-corta.png",
              stock: Number(item?.stock ?? 1),
              cat: catList,
              categoria: rawCat,
              categoria_id: catId,
              categoria_nombre: catNombre,
              categoria_detail: item?.categoria_detail,
              precio: Number(item?.precio || item?.price || 0),
              vendedor:
                typeof item?.vendedor === "string"
                  ? item.vendedor
                  : item?.vendedor?.first_name
                  ? `${item.vendedor.first_name} ${item.vendedor.last_name || ""}`.trim()
                  : item?.vendedor_nombre || "Repilche",
              vendedor_id: item?.vendedor_id ?? (typeof item?.vendedor === "number" ? item?.vendedor : item?.vendedor?.id),
            };
          });

          // Filtrar por el usuario actual si hay sesión iniciada
          const propios = user?.id
            ? normalized.filter((p: any) => Number(p.vendedor_id) === Number(user.id))
            : normalized;

          if (isMounted) {
            setMisProductos(propios);
          }
        }
      } catch (err) {
        console.warn("No se pudieron obtener los productos propios:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMisProductos();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <main className="lista-page">
      <section className="lista-container">
        <h1 className="lista-title">Mis productos</h1>
        <p className="lista-subtitle">Las prendas que publicaste en Repilche.</p>

        {loading ? (
          <div className="lista-vacia" style={{ padding: "40px" }}>
            <p>Cargando tus publicaciones...</p>
          </div>
        ) : misProductos.length === 0 ? (
          <div className="lista-vacia">
            <p>Todavía no subiste ninguna prenda.</p>
            <Link to="/cargar-producto" className="lista-btn">Cargar producto</Link>
          </div>
        ) : (
          <div className="lista-grid">
            {misProductos.map((p) => (
              <article key={p.id} className="lista-card">
                <div className="lista-img">
                  <img src={p.img as string} alt={p.name as string} />
                </div>

                <div className="lista-info">
                  <h2>{p.name}</h2>
                  <p className="lista-desc">{p.descrp}</p>

                  <dl className="lista-datos">
                    <div><dt>Categoria</dt><dd>{p.cat.join(", ")}</dd></div>
                    <div><dt>Stock</dt><dd>{p.stock}</dd></div>
                    <div><dt>Precio</dt><dd>${p.precio}</dd></div>
                  </dl>

                  <Link to={`/producto/${p.id}`} className="lista-btn">Ver detalle</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MisProductos;