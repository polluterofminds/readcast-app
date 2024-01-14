import { showMessage, hideMessage } from "react-native-flash-message";

const useToast = () => {
  const setToastMessage = (type: string, text: string) => {
    showMessage({
      type: "default",
      message: text, 
      backgroundColor: type === "info" ? "#EAF4F4" : "#92bcb0",
      color: "#181A1A",
    })
  }

  const hideToastMessage = () => {
    hideMessage();
  }
  return { setToastMessage, hideToastMessage }
};

export default useToast;