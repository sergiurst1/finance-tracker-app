import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/authContext'
import Typo from '@/components/Typo'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageServices'
import { accountOptionType } from '@/types'
import * as Icon from 'phosphor-react-native'

const Profile = () => {
    const { user } = useAuth();

    const accountOptions: accountOptionType[] = [
        {
            title: 'Edit Profile',
            icon: (
                <Icon.UserIcon
                    size={26}
                    color={colors.white}
                    weight='fill'
                ></Icon.UserIcon>
            ),
            routeName: '/(modals)/profileModal',
            bgColor: '#6366f1',
        },
        {
            title: 'Settings',
            icon: (
                <Icon.GearIcon
                    size={26}
                    color={colors.white}
                    weight='fill'
                ></Icon.GearIcon>
            ),
            bgColor: '#059669',
        },
        {
            title: 'Privacy Policy',
            icon: (
                <Icon.ShieldCheckIcon
                    size={26}
                    color={colors.white}
                    weight='fill'
                ></Icon.ShieldCheckIcon>
            ),
            bgColor: colors.neutral600,
        },
        {
            title: 'Log Out',
            icon: (
                <Icon.PowerIcon
                    size={26}
                    color={colors.white}
                    weight='fill'
                ></Icon.PowerIcon>
            ),
            bgColor: '#e11d48',
        },
    ];
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{marginVertical: spacingY._10}}/>

        <View style={styles.userInfo}> 
            <View>
                <Image source={getProfileImage(user?.image)} style={styles.avatar} contentFit="cover" transition={100}></Image>
            </View>
            <View style={styles.nameContainer}>
                <Typo size={24} fontWeight={"600"} color={colors.neutral100}>{user?.name}</Typo>
                <Typo size={15} color={colors.neutral400}>{user?.email}</Typo>
            </View>
        </View>

        <View style={styles.accountOptions}>
            {
                accountOptions.map((option, index) => {
                    return (
                        <View style={styles.listItem}>
                            <TouchableOpacity style={styles.flexRow}>
                                <View style={[styles.listIcon, {backgroundColor: option.bgColor}]}>
                                    {option.icon}
                                </View>
                                <Typo size={16} fontWeight={"500"} style={{marginLeft: spacingX._10, flex: 1}}>{option.title}</Typo>
                                <Icon.CaretRightIcon
                                    size={verticalScale(20)}
                                    color={colors.white}
                                    weight='bold'
                                ></Icon.CaretRightIcon>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    userInfo: {
        marginTop: verticalScale(30),
        alignItems: 'center',
        gap: spacingX._15,
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        borderRadius: 50,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    nameContainer: {
        alignItems: 'center',
        gap: verticalScale(4),
    },
    listIcon: {
        height: verticalScale(44),
        width: verticalScale(44),
        backgroundColor: colors.neutral500,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    listItem: {
        marginBottom: verticalScale(17),
    },
    accountOptions: {
        marginTop: spacingY._35,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._10,
    }
})