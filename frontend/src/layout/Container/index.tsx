import React, { PropsWithChildren } from "react";

const LayoutContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <main>{children}</main>;
};

export default LayoutContainer;
