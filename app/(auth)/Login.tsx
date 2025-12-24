import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from "expo-router";
import { useAuth } from '@/contexts/authContext'

const Login = () => {

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {login: loginUser} = useAuth();

  const handleSubmit = async () => {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    if(!res.success){
      Alert.alert("Error", res.msg);
    } else {
      router.push("/(tabs)");
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton></BackButton>
        <View style={{gap: 5, marginTop: spacingY._20}}>
          <Typo style={styles.welcomeText}>Hello,</Typo>
          <Typo style={styles.welcomeText}>Welcome Back!</Typo>
        </View>

        <View style={styles.form}>
          <Typo size={15} color={colors.textLighter}>Enter your credentials to access your account</Typo>
          <Input placeholder="Enter your email" onChangeText={(value) => (emailRef.current = value)} icon={<Icons.EnvelopeIcon size={verticalScale(26)} color={colors.neutral300}/>}></Input>
          <Input placeholder='Enter your password'  onChangeText={(value) => (passwordRef.current = value)} icon={<Icons.LockIcon size={verticalScale(26)} color={colors.neutral300}/>} secureTextEntry={true}></Input>
          <Typo size={14} color={colors.text} style={styles.forgotPassword}>Forgot Password?</Typo>
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>Login</Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo style={styles.footerText}>Don't have an account?</Typo>
          <Pressable onPress={() => router.push('/(auth)/Register')}>
            <Typo fontWeight={"500"} color={colors.primary}>Sign up</Typo>
          </Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(30),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  }
})