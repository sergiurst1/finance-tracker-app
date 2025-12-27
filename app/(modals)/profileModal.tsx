import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageServices'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

const ProfileModal = () => {
    const {user, updateUserData} = useAuth();
    const [userData, setUserData] = React.useState<UserDataType>({
        name: '',
        image: null,
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if(user){
            setUserData({
                name: user.name || '',
                image: user.image || null,
            });
        }
    }, [user]);

    const onPickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.canceled) {
            setUserData({...userData, image: result.assets[0]});
        }
    }

    const onSubmit = async () => {
        let {name, image} = userData;
        // Perform validation
        if(!name.trim()){
            alert("Please enter your name");
            return;
        }

        setLoading(true);
        const res = await updateUser(user?.uid as string, userData);
        setLoading(false);
        if(res.success){
            updateUserData(user?.uid as string);
            router.back();
        } else {
            alert(res.msg || "Something went wrong");
        }
    }

  return (
    <ModalWrapper>
        <View style={styles.container}>
            <Header title="Update Profile" leftIcon={<BackButton />} style={{marginBottom: spacingY._10}}/>
        
            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={getProfileImage(userData.image)}
                        contentFit='cover'
                        transition={100}
                    />
                    <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                        <Icons.PencilIcon size={verticalScale(20)} color={colors.neutral800} weight="bold"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200}>Name</Typo>
                    <Input placeholder="Enter your name" value={userData.name} onChangeText={(value) => setUserData({...userData, name: value})} />
                </View>
            </ScrollView>
        </View>

        <View style={styles.footer}>
            <Button onPress={onSubmit}
                loading={loading}
                style={{flex: 1}}>
                <Typo color={colors.black} fontWeight={"700"}>Update Profile</Typo>
            </Button>
        </View>
    </ModalWrapper>
  )
}

export default ProfileModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._15,
        gap: scale(12),
        marginTop: spacingY._15,
        borderTopColor: colors.neutral700,
        borderTopWidth: 1,
        marginBottom: spacingY._15,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        width: verticalScale(135),
        height: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingX._5,
        right: spacingX._7,
        backgroundColor: colors.neutral100,
        borderRadius: 100,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingX._7,
    },
    inputContainer: {
        gap: spacingX._10,
    },
})