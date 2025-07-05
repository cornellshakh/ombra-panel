// GlobalLoader.tsx
import { useLoading } from "@/pages/Loading";
import { ClipLoader } from "react-spinners"; // Use any spinner component

const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null; // Only render when loading is true

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Ensure it appears above all other content
      }}
    >
      <ClipLoader size={50} color={"#123abc"} loading={loading} />
    </div>
  );
};

export default GlobalLoader;
