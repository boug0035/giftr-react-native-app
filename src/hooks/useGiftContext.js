import { useContext } from "react";
import GiftContext from "../contexts/GiftContext";

const useGiftContext = () => {
  return useContext(GiftContext);
};

export default useGiftContext;
