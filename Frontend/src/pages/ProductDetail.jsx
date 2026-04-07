import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products
      if (response.data.category) {
        const relatedResponse = await apiClient.get(
          `/api/products?category=${response.data.category}&limit=4`
        );
        setRelatedProducts(
          relatedResponse.data.products.filter((p) => p._id !== id)
        );
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.inventory >= quantity) {
      addToCart(product, quantity);
    } else {
      toast.error('Not enough inventory');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-dark">Product not found</h2>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary transition-colors duration-300">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-primary transition-colors duration-300">Products</Link>
            </li>
            <li>/</li>
            <li className="text-dark font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-card shadow-card p-8 lg:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-light-gray rounded-card mb-4 flex items-center justify-center overflow-hidden">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-light-gray rounded-button overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent hover:border-light-border'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-dark">{product.name}</h1>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-button text-sm font-medium ${
                  product.inventory > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inventory > 0 
                    ? `${product.inventory} in stock` 
                    : 'Out of Stock'}
                </span>
              </div>

              <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-8 p-6 bg-light-gray rounded-card">
                  <h3 className="text-xl font-bold mb-4 text-dark">Specifications</h3>
                  <ul className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key} className="flex justify-between border-b border-light-border pb-2 last:border-0">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-dark">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.inventory > 0 && (
                <div className="mb-8">
                  <label className="block text-base font-medium text-dark mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center border-2 border-light-border rounded-button hover:border-primary hover:bg-light-gray transition-all duration-300 text-dark font-bold text-xl"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-dark min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center border-2 border-light-border rounded-button hover:border-primary hover:bg-light-gray transition-all duration-300 text-dark font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                className="w-full text-lg py-4"
              >
                {product.inventory > 0 ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                ) : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-dark">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
