import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface CustomDropdownProps {
  data: { label: string; value: string }[];
  style: StyleProp<ViewStyle>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
}

export default function CustomDropdown(props: CustomDropdownProps) {
  return (
    <Dropdown
      style={props.style}
      fontFamily="Poppins_400Regular"
      placeholderStyle={{
        color: "#888",
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
      }}
      selectedTextStyle={{
        color: "#000",
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
      }}
      data={props.data}
      labelField="label"
      valueField="value"
      placeholder={props.placeholder}
      value={props.value}
      onChange={(item) => props.setValue(item.value)}
      itemContainerStyle={
        {
          // paddingVertical: -1,
          // height: 50\,
        }
      }
      itemTextStyle={{
        fontSize: 14,
      }}
    />
  );
}
