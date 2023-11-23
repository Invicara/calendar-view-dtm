import React, { useEffect, useState } from "react";

export const Title = ({ children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(!visible), 1000);
  }, [visible]);

  return visible && <h1>{children}</h1>;
};
