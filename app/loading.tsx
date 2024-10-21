import { Ripple } from "react-css-spinners";
function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Ripple color="#00f" size={100} thickness={5} />
    </div>
  );
}

export default Loading;
