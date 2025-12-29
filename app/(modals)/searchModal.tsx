import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BackButton from '../../components/BackButton';
import Header from '../../components/Header';
import Input from '../../components/Input';
import ModalWrapper from '../../components/ModalWrapper';
import TransactionList from '../../components/TransactionList';
import { colors, spacingX, spacingY } from '../../constants/theme';
import { useAuth } from '../../contexts/authContext';
import useFetchData from '../../hooks/useFetchData';
import { TransactionType } from '../../types';

const SearchModal = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');

    // Fetch all transactions for this user to filter them locally
    const constraints = [
        where('uid', '==', user?.uid),
        orderBy('date', 'desc')
    ];

    const {
        data: allTransactions,
        loading: transactionsLoading,
    } = useFetchData<TransactionType>('transactions', constraints);

    // Filtering Logic
    const filteredTransactions = allTransactions.filter((item) => {
        if (search.length > 1) {
            const searchLower = search.toLowerCase();
            if (item.category?.toLowerCase().includes(searchLower)) {console.log(item.category); return true};
            if (item.type.toLowerCase().includes(searchLower)) {console.log(item.type); return true};
            if (item.description?.toLowerCase().includes(searchLower)) {console.log(item.description); return true};
            return false;
        }
        return true; // Show all if search is empty
    });

    return (
        <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
            <View style={styles.container}>
                <Header 
                    title="Search" 
                    leftIcon={<BackButton />} 
                    style={{ marginBottom: spacingY._10 }} 
                />

                <ScrollView 
                    contentContainerStyle={styles.form}
                    showsVerticalScrollIndicator={false}
                >
                    <Input
                        placeholder="shoes..."
                        value={search}
                        onChangeText={(value) => setSearch(value)}
                        containerStyle={{ backgroundColor: colors.neutral800 }}
                        placeholderTextColor={colors.neutral400}
                    />

                    <View>
                        <TransactionList
                            title="Transactions"
                            data={filteredTransactions}
                            loading={transactionsLoading}
                            emptyListMessage="No transactions match your search keywords"
                        />
                    </View>
                </ScrollView>
            </View>
        </ModalWrapper>
    );
};

export default SearchModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._20,
    },
    form: {
        gap: spacingY._20,
    },
});