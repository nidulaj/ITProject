const DiscountForm = ({ onSuccess, discount, onUpdate }) => {
  const [formData, setFormData] = useState({
    discount_name: discount?.discount_name || "",
    discount_type: discount?.discount_type || "percentage",
    value: discount?.value || "",
    eligibility_criteria: discount?.eligibility_criteria || "seasonal offer",
    valid_from: discount?.valid_from || "",
    valid_to: discount?.valid_to || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (discount && onUpdate) {
        // Update existing discount
        await onUpdate(discount.discount_id, formData);
      } else {
        // Add new discount
        await axios.post("http://localhost:5000/api/discounts", formData);
      }
      alert(discount ? "Discount updated successfully!" : "Discount added successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save discount.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* same inputs as before, no changes needed */}
      <label className="flex flex-col text-gray-700">
        Discount Name:
        <input
          type="text"
          name="discount_name"
          value={formData.discount_name}
          onChange={handleChange}
          required
          className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>
      {/* ...rest of the fields */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {discount ? "Update Discount" : "Add Discount"}
        </button>
        <button
          type="button"
          onClick={() => onSuccess && onSuccess()}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DiscountForm;
