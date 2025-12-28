import { colors } from '@/constants/theme';
import { getFilePaths } from '@/services/imageService';
import { ImageUploadProps } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Typo from './Typo';

const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder = ""
}: ImageUploadProps) => {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            onSelect(result.assets[0]);
        }
    };

    return (
        <View>
            {!file && (
                <TouchableOpacity
                    onPress={pickImage}
                    style={[styles.inputContainer, containerStyle]}
                >
                    <Icons.UploadSimpleIcon color={colors.neutral200} />
                    {placeholder && <Typo size={15} color={colors.neutral200}>{placeholder}</Typo>}
                </TouchableOpacity>
            )}

            {file && (
                <View style={[styles.image, imageStyle]}>
                    <Image
                        style={{ flex: 1 }}
                        source={getFilePaths(file)}
                        contentFit='cover'
                        transition={100}
                    />
                    <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
                        <Icons.XCircleIcon size={verticalScale(24)} weight='fill' color={colors.white} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ImageUpload;

const styles = StyleSheet.create({
    inputContainer: {
        height: verticalScale(54),
        backgroundColor: colors.neutral700,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.neutral500,
        borderStyle: 'dashed',
    },
    image: {
        height: scale(150),
        width: scale(150),
        borderRadius: 15,
        borderCurve: 'continuous',
        overflow: 'hidden',
        position: 'relative'
    },
    deleteIcon: {
        position: 'absolute',
        top: scale(6),
        right: scale(6),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 10,
    }
});