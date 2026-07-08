import {
  useEffect,
  useState,
} from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  getOverview,
  getAreaAnalytics,
  getCategoryAnalytics,
} from "../../api/analytics.api";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const AnalyticsOverview = () => {

  const [overview, setOverview] =
    useState(null);

  const [areas, setAreas] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {

    const fetch = async () => {

      try {

        const [
          overviewRes,
          areaRes,
          categoryRes,
        ] = await Promise.all([
          getOverview(),
          getAreaAnalytics(),
          getCategoryAnalytics(),
        ]);

        setOverview(
          overviewRes.data.data,
        );

        setAreas(
          areaRes.data.data
        );

        setCategories(
          categoryRes.data.data
        );

      } catch (error) {

        console.log(error);
      }
    };

    fetch();

  }, []);

  if (!overview) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">Loading analytics dashboard...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const pieData = [
    {
      name: "Resolved",
      value: overview.resolved,
    },
    {
      name: "Pending",
      value: overview.pending,
    },
  ];

  return (
    <SuperAdminLayout>

      <div className="space-y-8 w-full">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            System-wide grievance analytics and insights
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Total Complaints
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              {overview.total}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Resolved
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              {overview.resolved}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              {overview.pending}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Rejected
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              {overview.rejected}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
              Under_Review
            </p>

            <h2 className="text-4xl font-bold text-blue-400 mt-3">
              {overview.under_review}
            </h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PIE */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Complaint Status Distribution
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  <Cell fill="#93c5fd" />
                  <Cell fill="#60a5fa" />

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>
          </div>

          {/* AREA ANALYTICS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Top Complaint Areas
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={areas}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="area_id" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="complaintCount" fill="#60a5fa" />

              </BarChart>

            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Category Insights
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-200">

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Total Complaints
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    High Priority
                  </th>

                </tr>
              </thead>

              <tbody>

                {categories.map((c, index) => (

                  <tr
                    key={c.category_name}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                  >

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.category_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {c.total}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold text-xs">
                        {c.highPriority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AnalyticsOverview;