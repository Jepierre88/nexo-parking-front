import React from "react";
interface messageErrorProp {
  message?: string;
}

const MessageError: React.FC<messageErrorProp> = ({ message }) => {
  return <span className="text-sm text-red-500 mt-1 ml-36">{message}</span>;
};

export default MessageError;
