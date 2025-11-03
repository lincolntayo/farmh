import { Text, TouchableOpacity, View } from "react-native";
import CustomDropdown from "./Dropdown";
import Input from "./Input";

const categoryType = [
  {
    label: "Livestock",
    value: "livestock",
  },
  {
    label: "Fruits",
    value: "fruits",
  },
];

interface FormProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: () => void;
}

export default function Form(props: FormProps) {
  const { category, form, setForm, setCategory, handleSubmit } = props;

  const onChangeText = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <View className="mt-5">
      <Input
        label="Product Name *"
        name="productName"
        onChangeText={onChangeText}
        onSubmitEditing={() => {}}
        placeholder="e.g Watermelons"
        returnKeyType="next"
        value={form.productName}
      />

      <View className="mb-3">
        <Text className="text-base font-poppins-medium">Category *</Text>
        <CustomDropdown
          data={categoryType}
          placeholder="Select Category"
          setValue={setCategory}
          style={{
            backgroundColor: "#d9d9d9",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
          }}
          value={category}
        />
      </View>

      <Input
        label="Location *"
        name="location"
        onChangeText={onChangeText}
        onSubmitEditing={() => {}}
        placeholder="City, State"
        returnKeyType="next"
        value={form.location}
      />

      <View className="flex-row gap-x-2">
        <Input
          label="Quantity *"
          name="quantity"
          onChangeText={onChangeText}
          onSubmitEditing={() => {}}
          placeholder="100"
          returnKeyType="next"
          value={form.quantity.toLocaleString()}
          keyboardType="phone-pad"
        />

        <Input
          label="Unit *"
          name="unit"
          onChangeText={onChangeText}
          onSubmitEditing={() => {}}
          placeholder=""
          returnKeyType="next"
          value={form.unit}
        />
      </View>

      <View className="flex-row gap-x-2">
        <Input
          label="Price Range From *"
          name="priceFrom"
          onChangeText={onChangeText}
          onSubmitEditing={() => {}}
          placeholder="Price in ₦"
          returnKeyType="next"
          value={form.priceFrom.toLocaleString()}
          keyboardType="phone-pad"
        />

        <Input
          label="Price Range To *"
          name="priceTo"
          onChangeText={onChangeText}
          onSubmitEditing={() => {}}
          placeholder="Price in ₦"
          returnKeyType="next"
          value={form.priceTo.toLocaleString()}
          keyboardType="phone-pad"
        />
      </View>

      <View className="flex-row gap-x-2">
        <Input
          label="Available From"
          name="availableFrom"
          onChangeText={onChangeText}
          onSubmitEditing={() => {}}
          placeholder="dd/mm/yyyy"
          returnKeyType="next"
          value={form.availableFrom}
        />

        <Input
          label="Available Until"
          name="availableUntil"
          onChangeText={onChangeText}
          onSubmitEditing={() => {}}
          placeholder="dd/mm/yyyy"
          returnKeyType="next"
          value={form.availableUntil}
        />
      </View>

      <Input
        label="Description *"
        name="description"
        onChangeText={onChangeText}
        onSubmitEditing={() => {}}
        placeholder="Describe your product, quality, certification, etc"
        returnKeyType="next"
        value={form.description}
        numberOfLines={6}
        multiline
      />

      <View className="flex-row gap-x-2 flex-1 mt-5 mb-4">
        <TouchableOpacity className="flex-1 rounded-xl bg-gray py-3">
          <Text className="text-center font-poppins text-base">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 rounded-xl bg-deep-gray py-3"
          onPress={handleSubmit}
        >
          <Text className="text-center font-poppins text-base">Post Ad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
