const DiscountCode = ({ onDiscountApplied }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const applyCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/discounts/apply-code",
        {
          code: code.trim(),
        }
      );

      if (response.data.success) {
        onDiscountApplied(response.data.discount);
        setCode("");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply discount code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <label className="block text-sm font-medium mb-2">Discount Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter discount code"
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={applyCode}
          disabled={loading || !code.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
};
