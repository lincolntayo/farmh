import FirstScreen from "@/screens/registration/FirstScreen";
import SignUpScreen from "@/screens/registration/SignUpScreen";
import UploadImageScreen from "@/screens/registration/UploadImageScreen";
import { useLocalSearchParams } from "expo-router";

type PageType = "accountType" | "form" | "upload";

export default function Register() {
  const { pageType }: { pageType: PageType } = useLocalSearchParams();

  switch (pageType) {
    case "accountType":
      return <FirstScreen />;
    case "form":
      return <SignUpScreen />;
    case "upload":
      return <UploadImageScreen />;
    default:
      return <></>;
  }
}
