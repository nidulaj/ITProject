import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CustomOrderForm from "../components/CustomOrderForm";
import CustomOrderTable from "../components/CustomOrderTable";
import { ArrowLeft } from "lucide-react";

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
      const { data } = await axios.get(`${API}/api/customized_orders`);
      setRows(Array.isArray(data?.data) ? data.data : []);
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
          setOk("Order updated.");
        } else setError(data?.error || "Failed to update");
      } else {
        const { data } = await axios.post(`${API}/api/customized_orders`, form);
        if (data?.success) {
          setRows((r) => [data.data, ...r]);
          setOk("Order created.");
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
    <div className="min-h-screen bg-white">
      {/* Sticky Back bar (only if onBack provided) */}
      {typeof onBack === "function" && (
        //<div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl  px-6 py-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span className="text-lg"><ArrowLeft/></span>
              Back
            </button>
          </div>
        //</div>
      )}

      <div className="p-6">
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
          title={`All Customized Orders${loading ? " – Loading…" : ""}`}
          rows={rows}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
