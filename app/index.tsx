import OnboardingScreen from "@/components/onboarding/Onboarding";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-light-green pb-12 pt-12 px-4">
      <OnboardingScreen />
    </SafeAreaView>
  );
}
