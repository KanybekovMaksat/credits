import React, { useEffect, useRef } from "react";

const useClickOutside = (
  handler: any,
  toggleRef?: React.MutableRefObject<any>
) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maybeHandler = (event: any) => {
      const node = myRef.current;
      const toggleNode = toggleRef?.current;

      if (
        !node?.contains(event.target) &&
        !toggleNode?.contains(event.target)
      ) {
        handler();
      }
    };

    document.body.addEventListener("mousedown", maybeHandler);

    return () => {
      document.body.removeEventListener("mousedown", maybeHandler);
    };
  });

  return myRef;
};

export default useClickOutside;
