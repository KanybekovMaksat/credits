import { useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default useQuery;
