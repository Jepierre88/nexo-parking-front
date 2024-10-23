import { Ripple } from "react-css-spinners";
function Loading() {
  return (
    <div className="flex justify-center items-center h-screen w-full absolute z-10 bg-white">
      <Ripple color="#00f" size={100} thickness={5} />
    </div>
  );
}

export default Loading;
