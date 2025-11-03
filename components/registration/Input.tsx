import React from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (name: string, value: string) => void;
  placeholder: string;
  returnKeyType: "done" | "next";
  label: string;
  onSubmitEditing: () => void;
  secureTextEntry?: boolean;
  ref?: React.Ref<TextInput>;
  name: string;
  keyboardType?: "email-address" | "phone-pad";
}
export default function Input(props: InputProps) {
  return (
    <View className="mb-3">
      <Text className="text-base font-poppins-medium">{props.label}</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 text-base font-poppins"
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={(text) => props.onChangeText(props.name, text)}
        onSubmitEditing={props.onSubmitEditing}
        returnKeyType={props.returnKeyType}
        secureTextEntry={props.secureTextEntry}
        ref={props.ref}
        keyboardType={props.keyboardType}
      />
    </View>
  );
}
