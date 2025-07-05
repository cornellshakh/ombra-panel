import { useFetchData } from "@/api/auth/auth";
import { useEffect, useState } from "react";

interface AdminData {
  title: string;
  content: string;
}

export default function Admin() {
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fData = useFetchData();

  useEffect(() => {
    async function fetchAdminData() {
      const result = await fData<AdminData>("http://localhost:5000/adminonly");
      if (result) {
        setData(result);
      }
      setIsLoading(false);
    }

    fetchAdminData();
  }, [useFetchData]);

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Error: Failed to fetch data</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Title: {data.title}</p>
      <p>Content: {data.content}</p>
    </div>
  );
}
