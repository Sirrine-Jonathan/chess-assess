import useWindowDimensions from "./useWindowDimensions";

const useIsMobile = () => useWindowDimensions().width <= 768;

export default useIsMobile;
