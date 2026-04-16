import { useEffect, useState } from "react";
import { getUserComplaints } from "../../api/complaint.api";
import UserLayout from "../../components/layout/UserLayout";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getUserComplaints();
      setComplaints(res.data.data);
    };
    fetch();
  }, []);

  return (
    <UserLayout>
      <div className="p-6">
      <h2 className="text-xl mb-4">My Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="border p-3 mb-2">
          <p className="font-bold">{c.title}</p>
          <p className="text-sm">{c.status}</p>
          <p className="text-xs">{c.category_id?.name}</p>
        </div>
      ))}
    </div>
    </UserLayout>
  );
};

export default Complaints;