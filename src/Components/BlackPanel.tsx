import React from "react";

export const BlackPanel = ({ children }: Props) => (
  <div
    style={{
      background: "black",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }}
  >
    {children}
  </div>
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}
