"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Ripple } from "react-css-spinners";
function Loading() {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <div
      className={`flex justify-center items-center h-screen w-full absolute z-10`}
    >
      <Ripple color="#00f" size={100} thickness={5} />
    </div>
  );
}

export default Loading;
