import { Text, TouchableOpacity, View } from "react-native";

interface RadioButtonProps {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  selected: string;
  description?: string;
  label: string;
}

const Button = ({ selected, value }: { selected: string; value: string }) => {
  return (
    <View className="flex-row items-center mb-3">
      {/* Outer Circle */}
      <View
        className={`w-5 h-5 rounded-full border-2 ${
          selected === value ? "border-sky-blue" : "border-gray-400"
        }`}
      >
        {/* Inner Dot */}
        {selected === value && (
          <View className="w-3 h-3 bg-sky-blue rounded-full flex-1 m-[1.5px]" />
        )}
      </View>
    </View>
  );
};

export default function RadioButton(props: RadioButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => props.setSelected(props.value)}
      className="border rounded-xl flex flex-row justify-between px-3 py-2 mb-4 items-center"
    >
      <View>
        <Text className="font-poppins-semibold text-base">{props.label}</Text>
        <Text className="font-poppins text-sm">{props.description}</Text>
      </View>

      <Button selected={props.selected} value={props.value} />
    </TouchableOpacity>
  );
}
