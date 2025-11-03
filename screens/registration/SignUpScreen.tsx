import Input from "@/components/registration/Input";
import { Checkbox } from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import pendingUser from "../../db/pendingUsers.json";
import users from "../../db/users.json";

const strictPendingUser = pendingUser as any;

export default function SignUpScreen() {
  const [form, setForm] = useState({
    name: "",
    farmName: "",
    phoneNumber: "",
    email: "",
    password: "",
    country: "",
    state: "",
    address: "",
    accountType: strictPendingUser[0].accountType,
    confirmPassword: "",
  });
  const [isChecked, setChecked] = useState(false);

  const phoneNumberRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const farmNameRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const onChangeText = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.email ||
      !form.password ||
      !form.address ||
      !form.country ||
      !form.confirmPassword ||
      !form.name ||
      !form.phoneNumber ||
      !form.state ||
      !isChecked
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if ((form.accountType === "seller" || "both") && !form.farmName) {
      Alert.alert("Error", "Sellers must input their farm name");
      return;
    }

    const existingUser = users.find((user) => user.email === form.email.trim());

    if (existingUser) {
      Alert.alert("Error", "Email address already exists, sign in");
      return;
    }

    if (form.password.trim() !== form.confirmPassword.trim()) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    pendingUser.length = 0;
    pendingUser.push(form);
    router.push("/register?pageType=upload");
  };

  return (
    <SafeAreaView className="flex-1 pt-10 bg-white" edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 bg-white px-4 pt-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center gap-y-12 pt-12">
          <View className="items-center">
            <Image
              source={require("../../assets/images/splash-icon.png")}
              className="w-44 h-44"
              resizeMode="contain"
            />
            <Text className="text-deep-green font-poppins-semibold text-3xl mt-2">
              FarmHub
            </Text>
            <Text className="text-lg text-center mt-2 font-poppins-medium">
              Create a{" "}
              {form.accountType === "seller" || form.accountType === "both"
                ? "Farmer"
                : "Buyer"}{" "}
              account
            </Text>
          </View>

          <View className="">
            <Input
              label={"Name"}
              onChangeText={onChangeText}
              name="name"
              onSubmitEditing={() => phoneNumberRef.current?.focus()}
              placeholder="e.g. John Doe"
              returnKeyType="next"
              value={form.name}
            />

            <Input
              label={"Phone Number"}
              onChangeText={onChangeText}
              name="phoneNumber"
              onSubmitEditing={() => emailRef.current?.focus()}
              placeholder="e.g. 08041941983"
              returnKeyType="next"
              value={form.phoneNumber}
              ref={phoneNumberRef}
              keyboardType="phone-pad"
            />

            <Input
              label="Email Address"
              onChangeText={onChangeText}
              name="email"
              onSubmitEditing={() => farmNameRef.current?.focus()}
              placeholder="e.g. johndoe@mail.com"
              returnKeyType="next"
              value={form.email}
              ref={emailRef}
              keyboardType="email-address"
            />

            <Input
              label="Farm Name"
              onChangeText={onChangeText}
              name="farmName"
              onSubmitEditing={() => countryRef.current?.focus()}
              placeholder="e.g. Growth Farms"
              returnKeyType="next"
              value={form.farmName}
              ref={farmNameRef}
            />

            <Input
              label="Country"
              onChangeText={onChangeText}
              name="country"
              onSubmitEditing={() => stateRef.current?.focus()}
              placeholder="e.g. Nigeria"
              returnKeyType="next"
              value={form.country}
              ref={countryRef}
            />

            <Input
              label="State"
              onChangeText={onChangeText}
              name="state"
              onSubmitEditing={() => addressRef.current?.focus()}
              placeholder="e.g. Kaduna"
              returnKeyType="next"
              ref={stateRef}
              value={form.state}
            />

            <Input
              label="Address"
              onChangeText={onChangeText}
              name="address"
              onSubmitEditing={() => passwordRef.current?.focus()}
              placeholder="Enter your farm or residential address"
              returnKeyType="next"
              value={form.address}
              ref={addressRef}
            />

            <Input
              label="Password"
              onChangeText={onChangeText}
              name="password"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              placeholder="Enter a strong Password"
              returnKeyType="next"
              value={form.password}
              ref={passwordRef}
              secureTextEntry
            />

            <Input
              label="Confirm Password"
              onChangeText={onChangeText}
              name="confirmPassword"
              onSubmitEditing={handleSubmit}
              placeholder="Repeat your password"
              returnKeyType="done"
              value={form.confirmPassword}
              secureTextEntry
              ref={confirmPasswordRef}
            />
            <View className="flex-row items-center px-2">
              <Checkbox
                value={isChecked}
                onValueChange={(e) => setChecked(e)}
                color={isChecked ? "#1a73e8" : undefined}
                className="mr-2"
              />
              <Text className="text-base font-poppins">
                {" "}
                I agree with the{" "}
                <Text className="text-sky-blue font-poppins-medium">
                  Terms and conditions
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-deep-green text-white  py-3 rounded-xl"
            onPress={handleSubmit}
          >
            <Text className="font-poppins-medium text-white text-base text-center">
              Sign up
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-base font-poppins">
              Already have an account?
            </Text>
            <Link
              href="/login"
              className="font-poppins-medium text-sky-blue text-base"
            >
              Sign in
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
