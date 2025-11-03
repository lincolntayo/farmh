import { Text, View } from "react-native";

interface Props {
  figure: number;
  text: string;
}

export default function Info(props: Props) {
  return (
    <View className="flex-col justify-center items-center">
      <Text className="text-lg font-poppins-semibold">{props.figure}</Text>
      <Text className="text-sm font-poppins">{props.text}</Text>
    </View>
  );
}
