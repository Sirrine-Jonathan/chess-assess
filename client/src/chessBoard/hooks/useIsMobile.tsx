import { useEffect, useState } from "react";
import useWindowDimensions from "./useWindowDimensions";

const useIsMobile = () => {
  const isMobileWidth = useWindowDimensions().width <= 768;

  const [orientation, setOrientation] = useState("");

  const handleOrientation = () => {
    setOrientation(window.screen.orientation.type as string);
  };
  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation, true);
  }, []);

  console.log("useIsMobile", isMobileWidth, orientation);

  return isMobileWidth;
};

export default useIsMobile;
