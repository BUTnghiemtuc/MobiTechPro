import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../1services/product.service';
import type { Product } from '../../1services/product.service';
import { formatPrice } from '../../2utils/format';
import { toast } from 'react-toastify';
import { useAuth } from '../../2context/AuthContext';
import styles from './ProductManagement.module.css';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(page, 10);
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh list
      } catch (error) {
        toast.error('Failed to delete product');
        console.error(error);
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.div_1}>
        <div className={styles.div_2}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={styles.div_3}>
        <div>
           <h1 className={styles.h1_1}>Sản Phẩm</h1>
           <p className={styles.p_1}>Quản lý sản phẩm</p>
        </div>
        <Link
          to="/admin/products/new"
          className={styles.Link_1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Thêm Sản Phẩm
        </Link>
      </div>

      <div className={styles.div_4}>
        <div className="overflow-x-auto">
           <table className={styles.table_1}>
          <thead className="bg-slate-50/50">
            <tr>
              <th className={styles.th_1}>
                Thông Tin Sản Phẩm
              </th>
              <th className={styles.th_1}>
                Giá
              </th>
              <th className={styles.th_1}>
                Số lượng
              </th>
              <th className={styles.th_1}>
                ID
              </th>
              <th className={styles.th_2}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={styles.tbody_1}>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.td_1}>
                  <div className={styles.div_5}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={styles.svg_1}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <p className={styles.p_2}>No products found</p>
                    <p className={styles.p_3}>Get started by creating a new product.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className={styles.tr_1}>
                  <td className={styles.td_2}>
                    <div className={styles.div_6}>
                      <div className={styles.div_7}>
                          {product.image_url && product.image_url !== "" ? (
                            <img
                                src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:3000${product.image_url}`}
                                alt={product.title}
                                className={styles.img_1}
                            />
                            ) : (
                                <div className={styles.div_8}>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                </div>
                            )}
                      </div>
                      <div className="ml-4">
                        <div className={styles.div_9}>{product.title}</div>
                        <div className={styles.div_10}>{product.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td_3}>
                    <div className={styles.div_11}>{formatPrice(product.price)}</div>
                  </td>
                  <td className={styles.td_4}>
                    <span className={`font-medium ${product.quantity < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className={styles.td_4}>
                    #{product.id}
                  </td>
                  <td className={styles.td_5}>
                    <div className={styles.div_12}>
                        <Link
                        to={`/admin/products/${product.id}`}
                        className={styles.Link_2}
                        title="Edit"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Link>
                        {/* Only show Delete button for Admin */}
                        {user?.role === 'admin' && (
                        <button
                            onClick={() => handleDelete(product.id)}
                            className={styles.el_1}
                            title="Delete"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className={styles.div_13}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={styles.el_2}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Previous
        </button>
        <span className={styles.span_1}>
          Page <span className="text-slate-900">{page}</span> of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={styles.el_2}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;
