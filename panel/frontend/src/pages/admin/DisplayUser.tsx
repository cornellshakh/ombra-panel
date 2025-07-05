import { getUser } from "@/api/users";
import { User } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DisplayUser() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    async function handleGetUser() {
      try {
        const user = await getUser(parseInt(userId ?? ""));
        setUserData(user);
      } catch (error: any) {
        console.log("DisplayUser error: ", error);
      }
    }

    if (userId) {
      handleGetUser();
    }
  }, [userId]);

  if (!userData) {
    return <div>This user doesnt exist</div>;
  }

  return (
    <div>
      <div>Username: {userData?.username}</div>
      <div>Email: {userData?.email}</div>
      <div>Passowrd: {userData?.password}</div>
      <div>HWID: {userData?.HWID}</div>
      ...
    </div>
  );
}
