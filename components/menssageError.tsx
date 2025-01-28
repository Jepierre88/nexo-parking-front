import React from "react";
interface messageErrorProp {
  message?: string;
}

const MessageError: React.FC<messageErrorProp> = ({ message }) => {
  return <span className="text-xs text-red-500 ">{message}</span>;
};

export default MessageError;
