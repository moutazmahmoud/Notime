import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig: Record<string, (props: any) => JSX.Element> = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50", backgroundColor: "#E8F5E9" , zIndex: 1000}}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
      }}
      text2Style={{
        fontSize: 14,
        color: "#388E3C",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#F44336", backgroundColor: "#FFEBEE" }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#F44336",
      }}
      text2Style={{
        fontSize: 14,
        color: "#D32F2F",
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#2196F3", backgroundColor: "#E3F2FD" }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#2196F3",
      }}
      text2Style={{
        fontSize: 14,
        color: "#1976D2",
      }}
    />
  ),
};

export default toastConfig;
