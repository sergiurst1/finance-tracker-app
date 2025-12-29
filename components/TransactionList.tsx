import { expenseCategories, incomeCategory } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from './Loading';
import Typo from './Typo';

const TransactionList = ({ data, title, loading, emptyListMessage }: TransactionListType) => {
    const router = useRouter()

    const handleItemClick = (item: TransactionType) => {
        router.push({
            pathname: "/(modals)/transactionModal",
            params: {
                id: item?.id,
                type: item?.type,
                amount: item?.amount.toString(),
                category: item?.category,
                date: (item?.date as Timestamp).toDate().toISOString(),
                description: item?.description,
                image: item?.image,
                uid: item?.uid,
                walletId: item?.walletId,
            },
        });
    };

    return (
        <View style={styles.container}>
            {title && (
                <Typo size={20} fontWeight={'500'}>
                    {title}
                </Typo>
            )}

            <View style={styles.list}>
                {loading && (
                    <View style={{ top: verticalScale(100) }}>
                        <Loading></Loading>
                    </View>
                )}

                {!loading && data.length === 0 && (
                    <Typo size={15} color={colors.neutral400} style={styles.emptyListMessage}>
                        {emptyListMessage}
                    </Typo>
                )}

                <FlashList
                    data={data}
                    renderItem={({ item, index }) => (
                        <TransactionItem item={item} index={index} handleClick={handleItemClick} />
                    )}
                />
            </View>
        </View>
    );
};

const TransactionItem = ({ item, index, handleClick }: TransactionItemProps) => {
    const category =
        item.type === "income"
            ? incomeCategory
            : expenseCategories[item.category as keyof typeof expenseCategories];

    const date = (item.date as any).toDate().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });

    const IconComponent = category.icon;

    return (
        <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(14)}>
            <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
                <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
                    {
                        IconComponent && (
                            <IconComponent size={verticalScale(25)} color={colors.white} weight="fill" />
                        )
                    }
                </View>

                <View style={styles.categoryDesc}>
                    <Typo size={17}>{category.label}</Typo>
                    <Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
                        {item.description}
                    </Typo>
                </View>

                <View style={styles.amountDate}>
                    <Typo fontWeight={'500'} color={item.type == "income" ? colors.green : colors.rose}>
                        {`${item.type == "income" ? "+$" : "-$"}${item?.amount}`}
                    </Typo>
                    <Typo size={13} color={colors.neutral400}>
                        {date}
                    </Typo>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default TransactionList;

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17,
    },
    list: {
        minHeight: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacingX._12,
        marginBottom: spacingY._12,
        backgroundColor: colors.neutral800,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._17,
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius._12,
        borderCurve: 'continuous',
    },
    categoryDesc: {
        flex: 1,
        gap: 2.5,
    },
    amountDate: {
        alignItems: 'flex-end',
        gap: 3,
    },
    emptyListMessage: {
        textAlign: 'center',
        marginTop: spacingY._15,
    },
});