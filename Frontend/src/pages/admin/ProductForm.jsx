import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Lighting',
    inventory: '',
    images: [''],
    specifications: {
      brand: '',
      model: '',
      warranty: '',
    },
    isActive: true,
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        inventory: product.inventory,
        images: product.images.length > 0 ? product.images : [''],
        specifications: product.specifications || { brand: '', model: '', warranty: '' },
        isActive: product.isActive,
      });
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSpecChange = (e) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory),
        images: formData.images.filter((img) => img.trim() !== ''),
      };

      if (isEdit) {
        await apiClient.put(`/api/products/${id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await apiClient.post('/api/products', productData);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 text-dark">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-card p-8 space-y-8">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-base font-medium text-dark mb-2">
                Description <span className="text-primary">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                className="w-full px-4 py-3 border border-light-border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white text-dark resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />

              <Input
                label="Inventory"
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-dark mb-2">
                Category <span className="text-primary">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-light-border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white text-dark"
              >
                <option value="Lighting">Lighting</option>
                <option value="Wiring">Wiring</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-medium text-dark mb-3">
                Product Images (URLs)
              </label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border border-light-border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white text-dark"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-button transition-all duration-300 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-primary hover:text-primary-hover font-medium transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Image
              </button>
            </div>

            <div className="p-6 bg-light-gray rounded-button">
              <h3 className="text-xl font-bold mb-6 text-dark">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Brand"
                  name="brand"
                  value={formData.specifications.brand}
                  onChange={handleSpecChange}
                />
                <Input
                  label="Model"
                  name="model"
                  value={formData.specifications.model}
                  onChange={handleSpecChange}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Warranty"
                    name="warranty"
                    value={formData.specifications.warranty}
                    onChange={handleSpecChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-light-gray rounded-button">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded border-light-border text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-base font-medium text-dark cursor-pointer">
                Product is active
              </label>
            </div>

            <div className="flex gap-4 pt-6 border-t border-light-border">
              <Button type="submit" loading={submitting} className="text-lg px-8 py-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isEdit ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/products')}
                className="text-lg px-8 py-4"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
