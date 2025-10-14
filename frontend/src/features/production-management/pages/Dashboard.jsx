// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import ProductionTable from '../components/ProductionTable';
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import RecipeForm from '../components/RecipeForm';
import RequestIngredientsForm from '../components/RequestIngredientsForm';
import BarChartCard from '../components/BarChartCard';
import PieChartCard from '../components/PieChartCard';

import { Package, ShoppingCart, RotateCcw, Factory, Plus, DollarSignIcon, X } from 'lucide-react';
import { authFetch } from '../../user-management/utils/authFetchStaff';
import { Routes, Route } from "react-router-dom";
import UserProfile from '../../user-management/components/UserProfile';
import { jsPDF } from "jspdf";

const API = 'http://localhost:5000';

const ProductionDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Productions (used in Dashboard + Productions tab)
  const [productions, setProductions] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState('');

  // Ingredient requests (slim list for Dashboard only)
  const [reqRows, setReqRows] = useState([]);

  // ===== Returns (PM view) =====
  const [returnsData, setReturnsData] = useState([]);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [returnsError, setReturnsError] = useState('');

  // ===== Customized Orders (pending for bell) =====
  const [pendingCO, setPendingCO] = useState([]);
  const [pendingCOLoading, setPendingCOLoading] = useState(false);
  const [pendingCOError, setPendingCOError] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const [modalImage, setModalImage] = useState(null); // State to hold the image URL for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchProductions();
    fetchRequestsSlim();
    fetchReturns();
    fetchPendingCustomOrders();

    // auto-refresh every 30s so stats/cards update
    const id = setInterval(() => {
      fetchProductions();
      fetchRequestsSlim();
      fetchReturns();
      fetchPendingCustomOrders();
    }, 30000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/staff/auth/userInfo`,
        });
        setUserInfo(res.data);
        console.log("userinfo : ", userInfo)
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();

  }, []);

  // Function to handle View button click and open modal
  const handleViewImage = (imageUrl) => {
    setModalImage(imageUrl); // Set the image URL for the modal
    setIsModalOpen(true); // Open the modal
  };

  //Close modal
  const closeModalPic = () => {
    setIsModalOpen(false);
    setModalImage(null); // Reset the modal image
  };

  const fetchProductions = async () => {
    try {
      setProdLoading(true);
      setProdError('');
      //const res = await axios.get(`${API}/api/productions`);
      const res = await authFetch({
        method: "get", // Using GET method
        url: `${API}/api/productions`, // Same URL
      });
      setProductions(res?.data?.data || []);
    } catch (err) {
      console.error('Failed to load productions', err);
      setProdError('Failed to load productions');
    } finally {
      setProdLoading(false);
    }
  };

  // Only slim fields for dashboard: ID, Recipe No, Quantity, Status
  const fetchRequestsSlim = async () => {
    try {
      const res = await authFetch({
        method: 'get',
        url: `${API}/api/req_ingredients`,
      });

      const rows = res?.data?.data || [];
      const slim = rows.map((r) => ({
        'Request ID': r.req_id,
        'Recipe No': r.recipe_no,
        Quantity: r.quantity,
        Status: r.status,
      }));
      setReqRows(slim);
    } catch (err) {
      console.error('Failed to load ingredient requests', err);
      setReqRows([]);
    }
  };
const generatePDF = () => {
  const doc = new jsPDF();

  // Add title with larger font
  doc.setFontSize(22);
  doc.text("Production Report", 20, 20);

  // Add Production Details heading
  doc.setFontSize(16);
  doc.text("Production Details:", 20, 30);

  // Set up table formatting
  const columnHeaders = ["Batch ID", "Recipe No", "Quantity", "Status", "Created At"];
  const productionDetails = productions.map((p) => [
    String(p.batch_id),
    String(p.recipe_no),
    String(p.quantity),
    String(p.status),
    new Date(p.created_at).toLocaleString(),
  ]);

  // Set font and style for table
  doc.setFontSize(12);
  doc.setTextColor(0);

  // Table headers
  const headerY = 40;
  const colWidth = [30, 40, 30, 30, 50]; // Column widths for each column
  columnHeaders.forEach((header, index) => {
    doc.text(header, 20 + colWidth.slice(0, index).reduce((a, b) => a + b, 0), headerY);
  });

  // Table rows
  let yPosition = headerY + 10;
  productionDetails.forEach((detail) => {
    colWidth.forEach((width, index) => {
      doc.text(detail[index], 20 + colWidth.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += 10;
  });

  // Save the document
  doc.save("production_report.pdf");
};


  // ===== Returns (PM data) =====
  const fetchReturns = async () => {
    try {
      setReturnsLoading(true);
      setReturnsError('');
      //const res = await axios.get(`${API}/api/returns`);
      const res = await authFetch({
        method: "get", // Using GET method
        url: `${API}/api/returns`, // Same URL
      });
      const rows = res?.data?.data || [];

      const mapped = rows.map((r) => ({
        'Return ID': r.id,
        Product: r.product,
        Customer: r.customer,
        Phone: r.phone || '—',
        Reason: r.reason,
        Image: r.image_url ? (

          <button
            onClick={() => handleViewImage(r.image_url)} // Open modal with image
            className="text-blue-600 hover:underline"
          >
            View Image
          </button>
        ) : (
          "—"
        ),
        Status: r.status,
        __raw: r,
      }));

      setReturnsData(mapped);
    } catch (err) {
      console.error('Failed to load returns', err);
      setReturnsError('Failed to load returns');
      setReturnsData([]);
    } finally {
      setReturnsLoading(false);
    }
  };

  const pmSetReturnStatus = async (id, status) => {
    try {
      //await axios.patch(`${API}/api/returns/${id}/status`, { status });
      await authFetch({
        method: "patch", // Using PATCH method
        url: `${API}/api/returns/${id}/status`, // Same URL with dynamic id
        data: { status }, // Send status as the request body
      });

      setReturnsData((prev) =>
        prev.map((r) => (r['Return ID'] === id ? { ...r, Status: status } : r))
      );
    } catch (e) {
      alert(e?.response?.data?.error || e.message || 'Failed to update status');
    }
  };

  // ===== Customized Orders (pending only; for bell & modal) =====
  const fetchPendingCustomOrders = async () => {
    try {
      setPendingCOLoading(true);
      setPendingCOError('');
      //const res = await axios.get(`${API}/api/customized_orders`);
      const res = await authFetch({
        method: "get", // Using GET method
        url: `${API}/api/customized_orders`, // Same URL
      });

      const all = res?.data?.data || [];
      const pending = all.filter((o) => (o.status || '').toLowerCase() === 'pending');
      setPendingCO(pending);
    } catch (e) {
      console.error('Failed to load customized orders', e);
      setPendingCOError('Failed to load customized orders');
      setPendingCO([]);
    } finally {
      setPendingCOLoading(false);
    }
  };

  const pmSetCustomOrderStatus = async (id, status) => {
    try {
      //await axios.patch(`${API}/api/customized_orders/${id}/status`, { status });
      await authFetch({
        method: "patch", // Using PATCH method
        url: `${API}/api/customized_orders/${id}/status`, // Same URL with dynamic id
        data: { status }, // Send the status as the request body
      });

      // remove from pending list immediately (accepted/rejected)
      setPendingCO((list) => list.filter((x) => x.id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || e.message || 'Failed to update status');
    }
  };

  // --- Stats cards derived from productions ---
  const buildStats = (rows = []) => {
    const active = rows.filter((p) => (p.status || '').toLowerCase() === 'in production').length;
    const completed = rows.filter((p) => (p.status || '').toLowerCase() === 'completed').length;

    return [
      {
        title: 'Yogurt Stock',
        value: productions
          .filter(p => p.status?.toLowerCase() === 'completed') // only completed
          .reduce((total, p) => total + (p.quantity || 0), 0)
          .toLocaleString(),
        subtitle: 'Total Production Quantity',
        status: 'Good',
        icon: Package,
      },

      { title: 'Custom Orders', value: String(pendingCO.length), subtitle: 'Pending Review', status: pendingCO.length > 0 ? 'High' : 'Low', icon: ShoppingCart },
      { title: 'Completed Batches', value: String(completed), subtitle: 'Last 40 mins window', status: completed > 0 ? 'Good' : 'Low', icon: DollarSignIcon },
      { title: 'Active Batches', value: String(active), subtitle: 'In Production', status: active > 2 ? 'High' : 'Low', icon: Factory },
    ];
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  // Map productions → dashboard table rows
  const mapProductionsForDashboard = (rows) =>
    (rows || []).map((p) => ({
      id: p.id,
      batch_id: p.batch_id,
      recipe_no: p.recipe_no,
      quantity: p.quantity,
      status: p.status,
      created_at: p.created_at ? new Date(p.created_at).toLocaleString() : '',
    }));
  const dashProdCols = ['id', 'batch_id', 'recipe_no', 'quantity', 'status', 'created_at'];

  // Returns columns (shared by PM card + Returns tab)
  const returnsCols = ['Return ID', 'Product', 'Customer', 'Phone', 'Reason', 'Image', 'Status', 'Actions'];

  // Build rows with Accept/Reject actions for PM
  const buildReturnsRowsWithActions = (rows) =>
    (rows || []).map((r) => {
      const base = {
        'Return ID': r['Return ID'],
        Product: r['Product'],
        Customer: r['Customer'],
        Phone: r['Phone'],
        Reason: r['Reason'],
        Image: r['Image'],
        Status: r['Status'],
      };

      const id = r['Return ID'];
      const status = (r['Status'] || '').toLowerCase();

      const actionsEl = (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => pmSetReturnStatus(id, 'accept')}
            className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
            disabled={status === 'accept'}
            title="Accept"
          >
            Accept
          </button>
          <button
            onClick={() => pmSetReturnStatus(id, 'reject')}
            className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
            disabled={status === 'reject'}
            title="Reject"
          >
            Reject
          </button>
        </div>
      );

      return { ...base, Actions: actionsEl };
    });

  // ===== Manager-side: Pending Customized Orders =====
  // Include Order No in columns
  const coCols = ['ID', 'Order No', 'Customer', 'Fruit', 'Topping', 'Bottom', 'Qty', 'Order Date', 'Status', 'Actions'];

  // Build rows including order_no
  const buildPendingCORows = (rows) =>
    (rows || []).map((o) => {
      const status = (o.status || '').toLowerCase();
      const actionsEl = (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => pmSetCustomOrderStatus(o.id, 'accepted')}
            className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
            disabled={status === 'accepted'}
            title="Accept"
          >
            Accept
          </button>
          <button
            onClick={() => pmSetCustomOrderStatus(o.id, 'rejected')}
            className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
            disabled={status === 'rejected'}
            title="Reject"
          >
            Reject
          </button>
        </div>
      );
      return {
        ID: o.id,
        'Order No': o.order_no, // <<< NEW
        Customer: o.customer_name,
        Fruit: o.fruit,
        Topping: o.topping,
        Bottom: o.bottom,
        Qty: o.quantity,
        'Order Date': o.order_date,
        Status: o.status,
        Actions: actionsEl,
      };
    });
  
    // handeling deliver button
    const handleDelivered = async (batchId) => {
      try {
        await authFetch({
          method: "patch",
          url: `${API}/api/productions/delivered/${batchId}`,
        });
        // Remove locally
        setProductions(prev => prev.filter(p => p.batch_id !== batchId));
      } catch (err) {
        alert("Error marking production as delivered");
      }
    };


  const renderDashboardContent = () => {
    const prodRows = mapProductionsForDashboard(productions);
    const miniReturns = buildReturnsRowsWithActions(returnsData.slice(0, 6));

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buildStats(productions).map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Refresh Productions (Gray) */}
          <ActionButton
            variant="outline"
            icon={RotateCcw}
            onClick={() => {
              fetchProductions();
              fetchRequestsSlim();
              fetchReturns();
              fetchPendingCustomOrders();
            }}
            className="justify-center bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Refresh
          </ActionButton>

          <ActionButton
            icon={Plus}
            onClick={() => setActiveTab('recipes')}
            className="justify-center bg-blue-600 text-white hover:bg-blue-700"
          >
            Create New Recipe
          </ActionButton>

          <ActionButton
            icon={Package}
            onClick={generatePDF}
            className="justify-center bg-green-500 text-white hover:bg-green-600"
          >
            Production Report
          </ActionButton>
        </div>
      </div>



        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard
              data={productions.slice(-8).map((p) => ({
              recipe_no: p.recipe_no,
              quantity: p.quantity,
              }))}
            />

          <PieChartCard
            data={[
              { status: 'In Production', value: productions.filter(p => p.status.toLowerCase() === 'in production').length },
              { status: 'Completed', value: productions.filter(p => p.status.toLowerCase() === 'completed').length },
              { status: 'Delivered', value: productions.filter(p => p.status.toLowerCase() === 'delivered').length },
              { status: 'Other', value: productions.filter(p =>
                  !['in production','completed','delivered'].includes(p.status.toLowerCase())
                ).length },
            ]}
          />
        </div>


        {/* Ongoing Productions (real) — actions hidden */}
        <ProductionTable title="Ongoing Productions" data={prodRows} columns={dashProdCols} actions={false} />

        {/* Ingredient Requests (real, slim) — actions hidden */}
        <ProductionTable title="Ingredient Requests" data={reqRows} columns={['Request ID', 'Recipe No', 'Quantity', 'Status']} actions={false} />

        {/* Returns (Production Manager) – mini card with Accept/Reject */}
        <ProductionTable
          title={`Returns (Production Manager)${returnsLoading ? ' – Loading…' : ''}`}
          data={miniReturns}
          columns={['Return ID', 'Product', 'Customer', 'Phone', 'Reason', 'Image', 'Status', 'Actions']}
          actions={false}
        />
        {returnsError && <div className="text-sm text-red-600">{returnsError}</div>}
      </div>
    );
  };

  // Productions tab table
  const mapProductionsToRows = (rows) =>
  (rows || []).map((p) => {
    let actionsEl;

    if (p.status?.toLowerCase() === 'completed') {
      // Show "Deliver Now" button if not yet delivered
      actionsEl = (
        <button
          onClick={async () => {
            try {
              await authFetch({
                method: "patch",
                url: `${API}/api/productions/delivered/${p.batch_id}`,
              });
              // update the button text to "Delivered"
              setProductions((prev) =>
                prev.map((item) =>
                  item.batch_id === p.batch_id
                    ? { ...item, delivered: true }
                    : item
                )
              );
            } catch (err) {
              alert("Error marking production as delivered");
            }
          }}
          className={`px-3 py-1 rounded text-white text-sm ${
            p.delivered ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          disabled={p.delivered}
        >
          {p.delivered ? "Delivered" : "Deliver Now"}
        </button>
      );
    } else {
      actionsEl = <span className="text-gray-400 text-sm">—</span>;
    }

    return {
      id: p.id,
      batch_id: p.batch_id,
      recipe_no: p.recipe_no,
      quantity: p.quantity,
      status: p.status,
      created_at: p.created_at ? new Date(p.created_at).toLocaleString() : '',
      Actions: actionsEl,
    };
  });


  const prodTabCols = ['id', 'batch_id', 'recipe_no', 'quantity', 'status', 'created_at', 'Actions'];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();

      case 'productions': {
        const liveRows = mapProductionsToRows(productions);
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Production Management</h2>
              <div className="space-x-3">
                <ActionButton
                  variant="outline"
                  icon={RotateCcw}
                  onClick={() => {
                    fetchProductions();
                    fetchRequestsSlim();
                    fetchReturns();
                    fetchPendingCustomOrders();
                  }}
                  className="justify-center"
                >
                  {prodLoading ? 'Refreshing…' : 'Refresh'}
                </ActionButton>
                <ActionButton
                  icon={Package}
                  onClick={generatePDF}
                  className="justify-center"
                >
                  Download PDF Report
                </ActionButton>
              </div>
            </div>

            {prodError && <div className="text-sm text-red-600">{prodError}</div>}

            <ProductionTable title="All Productions" data={liveRows} columns={prodTabCols} actions={false} />
          </div>
        );
      }

      case 'recipes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Recipe Management</h2>
            </div>
            <RecipeForm />
          </div>
        );

      case 'ingredients':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Recipe Management</h2>
            </div>
            <RequestIngredientsForm />
          </div>
        );

      case 'order': {
        // reuse the same rows/columns used by the notification modal
        const notifRows = buildPendingCORows(pendingCO);
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <div className="space-x-3">
                <ActionButton variant="outline" icon={RotateCcw} onClick={fetchPendingCustomOrders} className="justify-center">
                  {pendingCOLoading ? 'Refreshing…' : 'Refresh'}
                </ActionButton>
              </div>
            </div>

            {pendingCOError && <div className="text-sm text-red-600">{pendingCOError}</div>}

            <ProductionTable
              title={`Pending Customized Orders${pendingCOLoading ? ' – Loading…' : ''}`}
              data={notifRows}
              columns={coCols}
              actions={false}
            />
          </div>
        );
      }

      case 'returns': {
        const fullReturns = buildReturnsRowsWithActions(returnsData);
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Returns & Refunds</h2>
              <div className="space-x-3">
                <ActionButton variant="outline" icon={RotateCcw} onClick={fetchReturns} className="justify-center">
                  {returnsLoading ? 'Refreshing…' : 'Refresh'}
                </ActionButton>
              </div>
            </div>

            {returnsError && <div className="text-sm text-red-600">{returnsError}</div>}

            <ProductionTable
              title="All Returns (Production Manager)"
              data={fullReturns}
              columns={['Return ID', 'Product', 'Customer', 'Phone', 'Reason', 'Image', 'Status', 'Actions']}
              actions={false}
            />
          </div>
        );
      }

      case 'userProfile': {
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            </div>
            <UserProfile />
          </div>
        );
      }


      default:
        return renderDashboardContent();
    }
  };

  // Build rows for the notification modal (pending custom orders)
  const notifRows = buildPendingCORows(pendingCO);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pendingCount={pendingCO.length} onOpenNotifications={() => setNotifOpen(true)} userInfo={userInfo} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setModalType('');
        }}
        title={
          modalType === 'normal_batch'
            ? 'Create Normal Yogurt Batch'
            : modalType === 'custom_batch'
              ? 'Create Custom Batch'
              : modalType === 'ingredient_request'
                ? 'New Ingredient Request'
                : 'Modal'
        }
        size="medium"
      >
        {/* form inputs already handled above */}
      </Modal>

      {/* Notifications Modal: Pending Customized Orders */}
      <Modal isOpen={notifOpen} onClose={() => setNotifOpen(false)} title="Pending Customized Orders" size="large">
        {pendingCOError && (
          <div className="mb-3 p-2 rounded border border-red-300 bg-red-50 text-red-700">{pendingCOError}</div>
        )}
        <ProductionTable
          title={`Pending Customized Orders${pendingCOLoading ? ' – Loading…' : ''}`}
          data={notifRows}
          columns={coCols}
          actions={false} // we inject our own Actions cells already
        />
      </Modal>
      {/* Modal for viewing image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">View Image</h2>
              <button
                onClick={closeModalPic}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4">
              <img src={`http://localhost:5000${modalImage}`} alt="Return Image" className="w-full h-auto" />

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionDashboard;
