import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = ({ orders }) => {
  // Calculate order status counts
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.order_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the chart
  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',    // Red - Pending
          'rgba(54, 162, 235, 0.8)',    // Blue - Confirmed
          'rgba(255, 206, 86, 0.8)',    // Yellow - Packing
          'rgba(75, 192, 192, 0.8)',    // Teal - Out for delivery
          'rgba(153, 102, 255, 0.8)',   // Purple - Delivered
          'rgba(255, 159, 64, 0.8)',    // Orange - Cancelled
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: 'Order Status',
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="h-48">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default OrderStatusChart;