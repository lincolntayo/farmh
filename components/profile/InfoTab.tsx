import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  figure?: number;
  text: string;
  border?: string;
}

export default function InfoTab(props: Props) {
  return (
    <View
      className={`flex-row items-center justify-between ${props.border} px-6 py-2`}
    >
      <Text className="text-sm font-poppins">{props.text}</Text>
      {(props.figure as number) >= 0 && (
        <View className="flex-row items-center gap-x-6">
          <View className="py-1.5 px-3 rounded-full flex-row justify-center items-center bg-deep-gray">
            <Text className="text-sm font-poppins">{props.figure}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </View>
      )}
    </View>
  );
}
