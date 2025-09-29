import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CustomOrderForm from "../components/CustomOrderForm";
import CustomOrderTable from "../components/CustomOrderTable";
import { ArrowLeft, Package, Sparkles } from "lucide-react";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

export default function CustomizedOrderPage({ onBack }) {
  const minDate = useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0,10);
  }, []);

  const empty = {
    customer_name: "",
    address: "",
    email: "",
    fruit: "",
    topping: "",
    bottom: "",
    quantity: 1,
    order_date: minDate,
  };

  const [form, setForm] = useState(empty);
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authFetch({
        method: "get",
        url: `${API}/api/customized_orders`,
      });
      setRows(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    try {
      setSubmitting(true);
      setError(""); setOk("");

      if (editingId) {
        const { data } = await axios.put(`${API}/api/customized_orders/${editingId}`, form);
        
        if (data?.success) {
          setRows((r) => r.map((x) => (x.id === editingId ? data.data : x)));
          setOk("Order updated successfully!");
        } else setError(data?.error || "Failed to update");
      } else {
        const { data } = await axios.post(`${API}/api/customized_orders`, form);
        
        if (data?.success) {
          setRows((r) => [data.data, ...r]);
          setOk("Order created successfully!");
        } else setError(data?.error || "Failed to create");
      }

      setForm(empty);
      setEditingId(null);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (row) => {
    setEditingId(row.id);
    setForm({
      customer_name: row.customer_name,
      address: row.address,
      email: row.email,
      fruit: row.fruit,
      topping: row.topping,
      bottom: row.bottom,
      quantity: row.quantity,
      order_date: row.order_date ? row.order_date.slice(0,10) : minDate,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (row) => {
    if (!confirm("Delete this order?")) return;
    try {
      await axios.delete(`${API}/api/customized_orders/${row.id}`);
      setRows((r) => r.filter((x) => x.id !== row.id));
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {typeof onBack === "function" && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">Custom Yogurt Orders</h1>
                  <p className="text-sm text-gray-500">Create and manage your personalized yogurt orders</p>
                </div>
              </div>
            </div>
            {rows.length > 0 && (
              <div className="hidden md:flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Total Orders: <span className="font-semibold text-blue-600">{rows.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <CustomOrderForm
          value={form}
          onChange={setForm}
          onSubmit={submit}
          submitting={submitting}
          editing={!!editingId}
          error={error}
          ok={ok}
        />

        <CustomOrderTable
          title={loading ? "Loading Your Orders..." : "Your Custom Orders"}
          rows={rows}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}