// src/components/RequestIngredientsForm.jsx
import React, { useState, useEffect, useMemo } from "react";
import RequestIngredientsUpdateForm from "./RequestIngredientsUpdateForm";
import Modal from "./Modal";
import { Factory, Edit, Trash2 } from "lucide-react";
import { authFetch } from "../../user-management/utils/authFetchStaff";

/**
 * Props (all optional for backward-compat):
 * - recipeNo?: string        // when provided (from RecipeForm green button), prefill & lock recipe_no
 * - onSuccess?: (data) => {} // called after successful create when embedded (to close parent modal, etc.)
 * - onCancel?: () => void    // used to render a Cancel button next to Submit in embedded mode
 * - hideList?: boolean       // force-hide the table; defaults to true if recipeNo is provided
 */
function RequestIngredientsForm({ recipeNo = "", onSuccess, onCancel, hideList }) {
  const isEmbedded = useMemo(() => Boolean(recipeNo), [recipeNo]);
  const shouldHideList = hideList ?? isEmbedded;

  // Initial form depends on recipeNo (embedded vs standalone)
  const makeInitialForm = (rno) => ({ recipe_no: rno || "", quantity: "" });
  const [formData, setFormData] = useState(makeInitialForm(recipeNo));

  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all requests only when we are in standalone mode (list visible)
  useEffect(() => {
    if (!shouldHideList) fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldHideList]);

  // Keep form in sync if parent changes recipeNo
  useEffect(() => {
    setFormData(makeInitialForm(recipeNo));
  }, [recipeNo]);

  const fetchRequests = async () => {
    try {
      //const res = await axios.get("http://localhost:5000/api/req_ingredients");
      const res = await authFetch({
                    method:"get",
                    url:"http://localhost:5000/api/req_ingredients",
                  });
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert empty strings to null for POST
    const payload = {};
    Object.keys(formData).forEach((key) => {
      const val = formData[key];
      payload[key] =
        val === undefined || val === null || String(val).trim() === ""
          ? null
          : val;
    });

    try {
      // const res = await axios.post(
      //   "http://localhost:5000/api/req_ingredients",
      //   payload
      // );

      const res = await authFetch({
                    method:"post",
                    url:"http://localhost:5000/api/req_ingredients",
                    data:payload,
                  });

      const created = res?.data?.data;
      if (created) {
        alert("✅ Ingredient request added!");

        // If embedded (opened from RecipeForm), notify parent & close
        if (onSuccess) onSuccess(created);

        // If we show the list here, update it
        if (!shouldHideList) {
          setRequests((prev) => [...prev, created]);
        }

        // Reset form, keep recipe_no if embedded
        setFormData(makeInitialForm(recipeNo));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add request.");
    }
  };

  const handleDelete = async (req_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmDelete) return;

    try {
      const res = await authFetch({
      method: "delete",
      url: `http://localhost:5000/api/req_ingredients/${req_id}`,
    });

      setRequests((prev) => prev.filter((r) => r.req_id !== req_id));
      alert("Request deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete request.");
    }
  };

  const handleEditClick = (req) => {
    setEditingRequest(req);
    setIsModalOpen(true);
  };

  // PUT quantity update after modal success
  const handleUpdateSuccess = async (updatedDraft) => {
    try {
      const body = {
        quantity:
          updatedDraft?.quantity === "" || updatedDraft?.quantity === undefined
            ? null
            : updatedDraft.quantity,
      };

      // const res = await axios.put(
      //   `http://localhost:5000/api/req_ingredients/${updatedDraft.req_id}`,
      //   body
      // );

      const res = await authFetch({
      method: "put",
      url: `http://localhost:5000/api/req_ingredients/${updatedDraft.req_id}`,
      data: body,
    });

      const updated = res?.data?.data || { ...updatedDraft };
      setRequests((prev) =>
        prev.map((r) => (r.req_id === updated.req_id ? updated : r))
      );
      setIsModalOpen(false);
      setEditingRequest(null);
    } catch (err) {
      console.error("❌ Failed to update request:", err);
      alert("❌ Failed to update request.");
    }
  };

  // 🔶 START PRODUCTION — only if status === 'accept'
  const handleStartProduction = async (reqRow) => {
    const status = (reqRow?.status || "").toLowerCase();
    if (status !== "accept") {
      alert("This request must be 'accept' before starting production.");
      return;
    }

    try {
      // const res = await axios.post(
      //   `http://localhost:5000/api/productions/start-from-request/${reqRow.req_id}`
      // );
      const res = await authFetch({
      method: "post",
      url: `http://localhost:5000/api/productions/start-from-request/${reqRow.req_id}`,
    });
      
      const started = res?.data?.production;
      alert(
        `✅ Production started${
          started?.batch_id ? ` (Batch: ${started.batch_id})` : ""
        }`
      );
      // Refresh list so you can see any status change (e.g., to "processing")
      fetchRequests();
    } catch (e) {
      console.error("❌ Failed to start production:", e);
      alert(e?.response?.data?.error || "Failed to start production");
    }
  };

  // simple pill for status (optional style)
  const StatusPill = ({ value }) => {
    const v = (value || "").toLowerCase();
    const cls =
      v === "accept"
        ? "bg-green-100 text-green-800"
        : v === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : v === "processing"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800";
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>
        {value || "-"}
      </span>
    );
  };

  return (
    <div className={shouldHideList ? "" : "p-6"}>
      {/* Add Request Form */}
      <div
        className={
          shouldHideList
            ? ""
            : "bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-6"
        }
      >
        {!shouldHideList && (
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Request Ingredients
          </h2>
        )}

        <form
          className={
            shouldHideList ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"
          }
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="recipe_no"
            placeholder="Recipe No"
            value={formData.recipe_no}
            onChange={handleChange}
            required
            disabled={isEmbedded} // lock when opened from RecipeForm
            className={`p-2 border rounded-md ${
              isEmbedded ? "bg-gray-100 text-gray-600" : ""
            }`}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="p-2 border rounded-md"
          />

          <div
            className={
              shouldHideList
                ? "flex justify-end space-x-2"
                : "col-span-2 flex justify-end space-x-2"
            }
          >
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Request
            </button>

            {/* Show Cancel when embedded (modal use-case) */}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Requests Table (hidden in embedded/modal mode) */}
      {!shouldHideList && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            All Ingredient Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Recipe No</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Status</th>{/* ← added */}
                  <th className="p-2">Strawberry</th>
                  <th className="p-2">Mango</th>
                  <th className="p-2">Blueberry</th>
                  <th className="p-2">Milk</th>
                  <th className="p-2">Culture</th>
                  <th className="p-2">Sugar</th>
                  <th className="p-2">Top_1</th>
                  <th className="p-2">Top_2</th>
                  <th className="p-2">Top_3</th>
                  <th className="p-2">Bottom1</th>
                  <th className="p-2">Bottom2</th>
                  <th className="p-2">Bottom3</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const isAccept = (req?.status || "").toLowerCase() === "accept";
                  return (
                    <tr key={req.req_id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{req.req_id}</td>
                      <td className="p-2">{req.recipe_no}</td>
                      <td className="p-2">{req.quantity}</td>
                      <td className="p-2">
                        <StatusPill value={req.status} />
                      </td>
                      <td className="p-2">{req.total_strawberry}</td>
                      <td className="p-2">{req.total_mango}</td>
                      <td className="p-2">{req.total_blueberry}</td>
                      <td className="p-2">{req.total_milk}</td>
                      <td className="p-2">{req.total_culture}</td>
                      <td className="p-2">{req.total_sugar}</td>
                      <td className="p-2">{req.total_topping1}</td>
                      <td className="p-2">{req.total_topping2}</td>
                      <td className="p-2">{req.total_topping3}</td>
                      <td className="p-2">{req.total_bottom1}</td>
                      <td className="p-2">{req.total_bottom2}</td>
                      <td className="p-2">{req.total_bottom3}</td>
                      <td className="p-2 space-x-2 text-center">
                        {/* Yellow button — only enabled when status is 'accept' */}
                        <button
                          onClick={() => handleStartProduction(req)}
                          className={`${
                            isAccept
                              ? "text-yellow-600 hover:text-yellow-800"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          title={
                            isAccept
                              ? "Start Production"
                              : "Disabled until status is 'accept'"
                          }
                          disabled={!isAccept}
                        >
                          <Factory size={16} />
                        </button>

                        <button
                          onClick={() => handleEditClick(req)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(req.req_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {requests.length === 0 && (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={17}>
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Update (only relevant when list is visible) */}
      {editingRequest && !shouldHideList && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Update Request"
          size="large"
        >
          <RequestIngredientsUpdateForm
            request={editingRequest}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default RequestIngredientsForm;
