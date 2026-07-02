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
          overviewRes.data.data
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
        <p className="p-6">
          Loading...
        </p>
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

      <div className="p-6">

        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            System-wide grievance analytics
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500">
              Total Complaints
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {overview.total}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500">
              Resolved
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {overview.resolved}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              {overview.pending}
            </h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* PIE */}
          <div className="bg-white shadow rounded-xl p-5">

            <h2 className="text-xl font-semibold mb-4">
              Complaint Status
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

                  <Cell fill="#22c55e" />
                  <Cell fill="#f97316" />

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>
          </div>

          {/* AREA ANALYTICS */}
          <div className="bg-white shadow rounded-xl p-5">

            <h2 className="text-xl font-semibold mb-4">
              Top Complaint Areas
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={areas}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="area_id" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="complaintCount" />

              </BarChart>

            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY TABLE */}
        <div className="bg-white shadow rounded-xl p-5 mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Category Insights
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-2">
                    Category
                  </th>

                  <th className="text-left py-2">
                    Total
                  </th>

                  <th className="text-left py-2">
                    High Priority
                  </th>

                </tr>
              </thead>

              <tbody>

                {categories.map((c) => (

                  <tr
                    key={c.category_name}
                    className="border-b"
                  >

                    <td className="py-3">
                      {c.category_name}
                    </td>

                    <td>
                      {c.total}
                    </td>

                    <td className="text-red-500 font-semibold">
                      {c.highPriority}
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