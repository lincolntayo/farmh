import { Link, Redirect, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import signedUser from "../../db/signedUser.json";
import users from "../../db/users.json";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const passwordRef = useRef<TextInput>(null);

  if ("name" in signedUser[0]) {
    return <Redirect href={"/home"} />;
  }

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const existingUser = users.find((user) => user.email === email.trim());

    if (!existingUser) {
      Alert.alert("Error", "Email address doesn't exist, sign up");
      return;
    }

    if (existingUser.password === password) {
      signedUser.length = 0;
      signedUser.push(existingUser);
      router.push("/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white  px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 justify-center gap-y-12">
            <View className="items-center">
              <Image
                source={require("../../assets/images/splash-icon.png")}
                className="w-44 h-44"
                resizeMode="contain"
              />
              <Text className="font-poppins-semibold text-3xl mt-2">
                Welcome Back!
              </Text>
            </View>

            <View className="">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-5"
                placeholder="Enter email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => passwordRef.current?.focus()}
                returnKeyType="next"
              />

              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-2"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                secureTextEntry
                ref={passwordRef}
              />

              <Text className="text-sm font-poppins text-sky-blue text-right">
                Forgot password?
              </Text>
            </View>

            <View>
              <TouchableOpacity
                className="bg-deep-green text-white  py-3 rounded-xl mb-2"
                onPress={handleSubmit}
              >
                <Text className="font-poppins-medium text-white text-base text-center">
                  Sign in
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-base font-poppins">No account yet? </Text>
                <Link
                  href={"/register?pageType=accountType"}
                  className="text-base font-poppins text-sky-blue"
                >
                  Sign up
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
