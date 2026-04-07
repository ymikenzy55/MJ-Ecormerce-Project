const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-base font-medium text-dark mb-2">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-3 border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 min-h-[44px] ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-light-border'
        } ${disabled ? 'bg-light-gray cursor-not-allowed text-gray-500' : 'bg-white text-dark'} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
