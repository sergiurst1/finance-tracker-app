import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories, transactionTypes } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType, WalletType } from '@/types';
import { verticalScale } from '@/utils/styling';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    description: '',
    category: '',
    date: new Date(),
    walletId: '',
    image: null
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const oldTransaction = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch wallets to populate the dropdown
  const { data: wallets, error: waletError, loading: walletLoading } = useFetchData<WalletType>('wallets', [
    where('uid', '==', user?.uid),
    orderBy('created', 'desc')
  ]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || transaction.date;
    if (Platform.OS === 'android') setShowDatePicker(false);
    setTransaction({ ...transaction, date: currentDate });
  };

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } = transaction;

    if (!walletId || !date || amount <= 0 || (type === 'expense' && !category)) {
      Alert.alert('Transaction', 'Please fill all the fields');
      return;
    }

    let transactionData : TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid
    }

    setLoading(true);

    console.log("Transaction Data:", transaction);
    setLoading(false);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title={oldTransaction.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton></BackButton>}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Type</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.type}
              onChange={item => { setTransaction({ ...transaction, type: item.value }) }}
            />
          </View>

          {/* Wallet Dropdown */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Wallet</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              selectedTextStyle={styles.dropdownSelectedText}
              placeholderStyle={styles.dropdownPlaceholder}
              iconStyle={styles.dropdownIcon}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              data={wallets.map(w => ({
                label: `${w?.name} ($${w.amount})`,
                value: w?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.walletId}
              placeholder={"Select wallet"}
              onChange={item => { setTransaction({ ...transaction, walletId: item.value || "" }) }}
            />
          </View>

          {/* Expense Category Dropdown (Conditional) */}
          {transaction.type === 'expense' && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>Expence Category</Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                selectedTextStyle={styles.dropdownSelectedText}
                placeholderStyle={styles.dropdownPlaceholder}
                iconStyle={styles.dropdownIcon}
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transaction.category}
                placeholder={"Select category"}
                onChange={item => { setTransaction({ ...transaction, category: item.value || "" }) }}
              />
            </View>
          )}

          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Date</Typo>
            {!showDatePicker && (
              <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Typo size={14}>{(transaction.date as Date).toLocaleDateString()}</Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View>
                <DateTimePicker
                  themeVariant='dark'
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                />
                {
                  Platform.OS === 'ios' && (
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(false)}>
                      <Typo size={15} fontWeight={'500'}>Ok</Typo>
                    </TouchableOpacity>
                  )
                }
              </View>
            )}
          </View>

          {/* Amount */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Amount</Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount.toString()}
              onChangeText={value => {
                setTransaction({ ...transaction, amount: Number(value.replace(/[^0-9.]/g, '')) });
              }}
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <Typo color={colors.neutral200} size={16}>Description</Typo>
              <Typo color={colors.neutral500} size={14}>(optional)</Typo>
            </View>
            <Input
              multiline
              containerStyle={styles.descriptionInput}
              value={transaction.description}
              onChangeText={value => setTransaction({ ...transaction, description: value })}
            />
          </View>

          {/* Receipt Upload */}
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <Typo color={colors.neutral200} size={16}>Receipt</Typo>
              <Typo color={colors.neutral500} size={14}>(optional)</Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onSelect={file => setTransaction({ ...transaction, image: file })}
              onClear={() => setTransaction({ ...transaction, image: null })}
              placeholder='Upload Image'
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
            <Typo color={colors.black} fontWeight={'700'}>
              {oldTransaction.id ? "Update" : "Submit"}
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  inputContainer: {
    gap: spacingY._10
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    borderCurve: 'continuous',
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: 'continuous',
    paddingHorizontal: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    borderWidth: 1,
    alignItems: 'center',
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: 'flex-end',
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  descriptionInput: {
    flexDirection: "row",
    height: verticalScale(100),
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  }
});