import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inventory > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square bg-light-gray flex items-center justify-center overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-xl font-semibold mb-2 text-dark hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            product.inventory > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of Stock'}
          </span>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={product.inventory === 0}
          variant="primary"
          fullWidth
        >
          {product.inventory > 0 ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
