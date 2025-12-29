import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { WalletType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const WalletModal = () => {
    const { user } = useAuth();
    const [wallet, setWallet] = useState<WalletType>({
        name: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const oldWallet: { name: string; image: string; id: string } = useLocalSearchParams();

    useEffect(() => {
        if (oldWallet.id) {
            setWallet({
                name: oldWallet.name as string,
                image: oldWallet.image as string,
            });
        }
    }, [oldWallet.id]);

    const onDelete = async () => {
        if (!oldWallet.id) return;
        setLoading(true);
        const res = await deleteWallet(oldWallet.id as string);
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert('Wallet', res.msg);
        }
    };

    const showDeleteAlert = () => {
        Alert.alert('Confirm', "Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet", [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: onDelete, style: 'destructive' }
        ]);
    };

    const onSubmit = async () => {
        const { name, image } = wallet;
        if (!name.trim() || !image) {
            Alert.alert('Wallet', 'Please fill all fields');
            return;
        }

        setLoading(true);
        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        };

        if (oldWallet?.id) data.id = oldWallet?.id;
        const res = await createOrUpdateWallet(data);
        setLoading(false);

        if (res.success) {
            router.back();
        } else {
            Alert.alert('Wallet', res.msg);
        }
    };

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header title={oldWallet?.id ? "Update Wallet" : "New Wallet"} leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />

                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Name</Typo>
                        <Input
                            placeholder='Salary'
                            value={wallet.name}
                            onChangeText={(value) => setWallet({ ...wallet, name: value })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Icon</Typo>
                        <ImageUpload
                            file={wallet.image}
                            onSelect={(file) => setWallet({ ...wallet, image: file })}
                            onClear={() => setWallet({ ...wallet, image: null })}
                            placeholder='Upload Image'
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    {oldWallet.id && !loading && (
                        <TouchableOpacity
                            style={[styles.deleteButton]}
                            onPress={showDeleteAlert}
                        >
                            <Icons.TrashIcon color={colors.white} size={verticalScale(24)} weight='bold' />
                        </TouchableOpacity>
                    )}
                    <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                        <Typo color={colors.black} fontWeight={'700'}>
                            {
                                oldWallet?.id ? "Update Wallet" : "Add Wallet"
                            }
                        </Typo>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    );
};

export default WalletModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20
    },
    form: {
        gap: spacingY._30,
        paddingTop: spacingY._20
    },
    inputContainer: {
        gap: spacingY._10
    },
    footer: {
        paddingBottom: spacingY._20,
        flexDirection: 'row'
    },
    deleteButton: {
        backgroundColor: colors.rose,
        paddingHorizontal: spacingX._15,
        height: verticalScale(54),
        borderRadius: radius._15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacingX._10
  }
});