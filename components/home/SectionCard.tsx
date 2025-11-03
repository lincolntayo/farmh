import { Image, ImageSourcePropType, View } from "react-native";

interface SectionCardProps {
  image: ImageSourcePropType;
}
export default function SectionCard(props: SectionCardProps) {
  return (
    <View className="relative">
      <Image source={props.image} className="rounded-2xl w-44 h-44" />
    </View>
  );
}
