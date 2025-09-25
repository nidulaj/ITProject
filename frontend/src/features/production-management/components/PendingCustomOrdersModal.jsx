// components/PendingCustomOrdersModal.jsx
import React from 'react';
import Modal from './Modal';
import ProductionTable from './ProductionTable';

const badge = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'accepted') return 'bg-green-100 text-green-800';
  if (s === 'rejected') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

export default function PendingCustomOrdersModal({
  isOpen,
  onClose,
  rows = [],
  onAccept = () => {},
  onReject = () => {},
  loading = false,
  error = '',
}) {
  // Build columns and mapped data for ProductionTable
  const columns = ['ID','Customer','Fruit','Topping','Bottom','Qty','Order Date','Status','Actions'];

  const data = (rows || []).map((r) => {
    const StatusEl = (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${badge(r.status)}`}>
        {r.status}
      </span>
    );

    const ActionsEl = (
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          onClick={() => onAccept(r.id)}
          disabled={(r.status || '').toLowerCase() === 'accepted'}
        >
          Accept
        </button>
        <button
          className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          onClick={() => onReject(r.id)}
          disabled={(r.status || '').toLowerCase() === 'rejected'}
        >
          Reject
        </button>
      </div>
    );

    // IMPORTANT: create keys in the same order as columns
    return {
      ID: r.id,
      Customer: r.customer_name,
      Fruit: r.fruit,
      Topping: r.topping,
      Bottom: r.bottom,
      Qty: r.quantity,
      'Order Date': r.order_date,
      Status: StatusEl,
      Actions: ActionsEl,
    };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pending Customized Orders"
      size="large"
    >
      {error && (
        <div className="mb-3 p-2 rounded border border-red-300 bg-red-50 text-red-700">
          {error}
        </div>
      )}
      <ProductionTable
        title={`Pending Customized Orders${loading ? ' – Loading…' : ''}`}
        data={data}
        columns={columns}
        actions={false}
      />
    </Modal>
  );
}
