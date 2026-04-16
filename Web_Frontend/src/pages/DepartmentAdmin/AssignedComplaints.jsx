import { useEffect, useState } from "react";
import { getAssignedComplaints } from "../../api/complaint.api";
import { useNavigate } from "react-router-dom";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await getAssignedComplaints();
      setComplaints(res.data.data);
    };
    fetch();
  }, []);

  return (
    <DeptAdminLayout>
      <h2 className="text-xl mb-4">Assigned Complaints</h2>

      {complaints.map((c) => (
        <div
          key={c._id}
          className="bg-white p-4 shadow rounded mb-3 cursor-pointer"
          onClick={() =>
            navigate(`/dept-admin/complaints/${c._id}`)
          }
        >
          <div className="flex justify-between">
            <h3 className="font-bold">{c.title}</h3>

            <span className="text-xs bg-blue-200 px-2 rounded">
              {c.status}
            </span>
          </div>

          <p className="text-sm">{c.description}</p>

          <p className="text-xs mt-2">
            Category: {c.category_id?.name}
          </p>

          <p className="text-xs">
            User: {c.user_id?.full_name}
          </p>
        </div>
      ))}
    </DeptAdminLayout>
  );
};

export default AssignedComplaints;