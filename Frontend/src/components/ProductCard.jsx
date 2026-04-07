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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm ${product.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of Stock'}
          </span>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={product.inventory === 0}
          className="w-full"
        >
          {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
