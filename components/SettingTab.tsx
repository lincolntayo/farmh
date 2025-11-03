import { Text, TouchableOpacity } from "react-native";

interface Props {
  icon: React.ReactElement;
  name: string;
}
export default function SettingTab(props: Props) {
  return (
    <TouchableOpacity className="px-4 py-4 flex-row gap-x-4 items-center">
      {props.icon}
      <Text className="font-poppins-medium text-lg">{props.name}</Text>
    </TouchableOpacity>
  );
}
