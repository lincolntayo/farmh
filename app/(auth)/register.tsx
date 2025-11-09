import FirstScreen from "@/screens/registration/FirstScreen";
import SignUpScreen from "@/screens/registration/SignUpScreen";
import UploadImageScreen from "@/screens/registration/UploadImageScreen";
import { useLocalSearchParams } from "expo-router";

type PageType = "accountType" | "form" | "upload";

export default function Register() {
  const { pageType } = useLocalSearchParams<{ pageType?: PageType }>();

  switch (pageType) {
    case "accountType":
      return <FirstScreen />;
    case "form":
      return <SignUpScreen />;
    case "upload":
      return <UploadImageScreen />;
    default:
      // Default to FirstScreen if no pageType is provided
      return <FirstScreen />;
  }
}
