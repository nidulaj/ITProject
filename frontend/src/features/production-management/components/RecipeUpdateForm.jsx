// src/components/RecipeUpdateForm.jsx
import React, { useMemo, useState } from "react";
import { authFetch } from "../../user-management/utils/authFetchStaff";

const numberKeys = [
  "strawberry", "mango", "blueberry",
  "milk", "culture", "sugar",
  "topping1", "topping2", "topping3",
  "bottom1", "bottom2", "bottom3",
];

export default function RecipeUpdateForm({ recipe, onSuccess, onCancel }) {
  // Normalize incoming recipe
  const initial = useMemo(() => ({
    recipe_id: recipe?.recipe_id,
    order_no: recipe?.order_no || "",
    recipe_name: recipe?.recipe_name || "",
    strawberry: recipe?.strawberry ?? "",
    mango: recipe?.mango ?? "",
    blueberry: recipe?.blueberry ?? "",
    milk: recipe?.milk ?? "",
    culture: recipe?.culture ?? "",
    sugar: recipe?.sugar ?? "",
    topping1: recipe?.topping1 ?? "",
    topping2: recipe?.topping2 ?? "",
    topping3: recipe?.topping3 ?? "",
    bottom1: recipe?.bottom1 ?? "",
    bottom2: recipe?.bottom2 ?? "",
    bottom3: recipe?.bottom3 ?? "",
  }), [recipe]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toPayload = () => {
    if (!form.order_no?.trim() || !form.recipe_name?.trim()) {
      throw new Error("Order No and Recipe Name are required.");
    }
    const payload = {
      order_no: form.order_no.trim(),      // REQUIRED by backend/DB
      recipe_name: form.recipe_name.trim()
    };
    numberKeys.forEach((k) => {
      const s = String(form[k] ?? "").trim();
      if (s !== "") {
        const n = Number(s);
        if (Number.isFinite(n)) payload[k] = Math.trunc(n);
      }
    });
    return payload;
  };

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      setSaving(true);
      setError("");

      const payload = toPayload();
      const res = await authFetch({
        method: "put",
        url: `http://localhost:5000/api/recipe/${form.recipe_id}`,
        data: payload,
      });

      const updated = res?.data?.recipe || res?.data?.data || null;
      if (!updated) {
        throw new Error("Update response missing 'recipe'.");
      }
      onSuccess?.(updated);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Failed to update recipe.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Read-only Recipe No (auto) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipe No</label>
        <input
          type="text"
          value={recipe?.recipe_no || ""}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100 text-gray-700"
        />
        <p className="text-xs text-gray-500 mt-1">Auto-generated. Cannot be changed.</p>
      </div>

      {/* Editable Order No */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order No</label>
        <input
          type="text"
          value={form.order_no}
          onChange={(e) => set("order_no", e.target.value)}
          required
          className="w-full p-2 border rounded-md"
          placeholder="O1001"
        />
        <p className="text-xs text-gray-500 mt-1">Must exist in Customized Orders.</p>
      </div>

      {/* Recipe Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
        <input
          type="text"
          value={form.recipe_name}
          onChange={(e) => set("recipe_name", e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Ingredients */}
      <div className="grid grid-cols-3 gap-3">
        {[
          ["strawberry", "Strawberry (g)"],
          ["mango", "Mango (g)"],
          ["blueberry", "Blueberry (g)"],
          ["milk", "Milk (ml)"],
          ["culture", "Culture (g)"],
          ["sugar", "Sugar (g)"],
          ["topping1", "Chocolate Syrup (ml)"],
          ["topping2", "Strawberry Syrup (ml)"],
          ["topping3", "Honey Syrup (ml)"],
          ["bottom1", "Cashew (g)"],
          ["bottom2", "Peanut (g)"],
          ["bottom3", "Almond (g)"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
              type="number"
              inputMode="numeric"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
