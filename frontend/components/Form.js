import React, { useState, useCallback, useEffect } from 'react';

const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    selectedToppings: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [messages, setMessages] = useState({ success: '', failure: '' });

  const validateFullName = useCallback((fullName) => {
    const trimmedName = fullName.trim();
    if (trimmedName.length < 3) {
      return validationErrors.fullNameTooShort;
    } else if (trimmedName.length > 20) {
      return validationErrors.fullNameTooLong;
    }
    return '';
  }, []);

  const validateSize = useCallback((size) => {
    if (!['S', 'M', 'L'].includes(size)) {
      return validationErrors.sizeIncorrect;
    }
    return '';
  }, []);

  const getSizeText = (size) => {
    switch (size) {
      case 'S': return 'small';
      case 'M': return 'medium';
      case 'L': return 'large';
      default: return '';
    }
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const fullNameError = validateFullName(formData.fullName);
    const sizeError = validateSize(formData.size);

    if (!fullNameError && !sizeError) {
      const sizeText = getSizeText(formData.size);
      const toppingsCount = formData.selectedToppings.length;
      const toppingsText = toppingsCount === 0 ? 'no toppings' : `${toppingsCount} topping${toppingsCount !== 1 ? 's' : ''}`;
      const successMessage = `Thank you for your order, ${formData.fullName}! Your ${sizeText} pizza with ${toppingsText} is on the way.`;
      setMessages({ success: successMessage, failure: '' });

      // Prepare data in the format required
      const payload = {
        fullName: formData.fullName,
        size: formData.size,
        toppings: formData.selectedToppings.map(Number), // Convert all toppings to numbers
      };

      console.log('Payload:', payload); // Replace this with your API call if needed

      // Clear the form
      setFormData({
        fullName: '',
        size: '',
        selectedToppings: [],
      });
    } else {
      setMessages({ success: '', failure: 'Something went wrong' });
    }

    setErrors({ fullName: fullNameError, size: sizeError });
  }, [formData, validateFullName, validateSize]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'fullName') {
      const fullNameError = validateFullName(value);
      setErrors((prevErrors) => ({ ...prevErrors, fullName: fullNameError }));
    } else if (name === 'size') {
      const sizeError = validateSize(value);
      setErrors((prevErrors) => ({ ...prevErrors, size: sizeError }));
    }

    if (type === 'checkbox') {
      setFormData((prevData) => {
        const selectedToppings = checked
          ? [...prevData.selectedToppings, value]
          : prevData.selectedToppings.filter((t) => t !== value);
        return { ...prevData, selectedToppings: selectedToppings.map(Number) }; // Convert to numbers
      });
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  useEffect(() => {
    const isFormValid = 
      formData.fullName.trim().length >= 3 && 
      formData.fullName.trim().length <= 20 && 
      ['S', 'M', 'L'].includes(formData.size) &&
      !errors.fullName &&
      !errors.size;
    setIsSubmitDisabled(!isFormValid);
  }, [formData, errors]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {messages.success && <div className='success'>{messages.success}</div>}
      {messages.failure && <div className='failure'>{messages.failure}</div>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          placeholder="Type full name"
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label><br />
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small (S)</option>
          <option value="M">Medium (M)</option>
          <option value="L">Large (L)</option>
        </select>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              value={topping.topping_id}
              checked={formData.selectedToppings.includes(topping.topping_id)}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      <input
        type="submit"
        disabled={isSubmitDisabled}
      />
    </form>
  );
}

export default React.memo(Form);

