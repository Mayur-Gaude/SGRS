import {
  useEffect,
  useState,
} from "react";

import {
  getCategoryAnalytics,
} from "../../api/analytics.api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#8b5cf6",
];

const CategoryAnalytics = () => {

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {

    const fetch = async () => {

      try {

        const res =
          await getCategoryAnalytics();

        setCategories(
          res.data.data
        );

      } catch (error) {

        console.log(error);
      }
    };

    fetch();

  }, []);

  return (
    <SuperAdminLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Category Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Complaint category insights
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white shadow rounded-xl p-5">

            <p className="text-gray-500">
              Categories
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {categories.length}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">

            <p className="text-gray-500">
              Top Category
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-2">

              {
                categories[0]
                  ?.category_id || "N/A"
              }
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">

            <p className="text-gray-500">
              Highest Priority Cases
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">

              {
                categories.reduce(
                  (
                    sum,
                    c
                  ) =>
                    sum +
                    c.highPriority,
                  0
                )
              }
            </h2>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white shadow rounded-xl p-5 mt-8">

          <h2 className="text-xl font-semibold mb-5">
            Complaint Category Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={400}
          >

            <PieChart>

              <Pie
                data={categories}
                dataKey="total"
                nameKey="category_id"
                outerRadius={140}
                label
              >

                {categories.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-xl p-5 mt-8">

          <h2 className="text-xl font-semibold mb-5">
            Category Breakdown
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Category
                  </th>

                  <th className="text-left py-3">
                    Total
                  </th>

                  <th className="text-left py-3">
                    High Priority
                  </th>
                </tr>
              </thead>

              <tbody>

                {categories.map(
                  (
                    c,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="border-b"
                    >

                      <td className="py-3">
                        {
                          c.category_name
                        }
                      </td>

                      <td>
                        {c.total}
                      </td>

                      <td className="text-red-500 font-semibold">
                        {
                          c.highPriority
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default CategoryAnalytics;