import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import { colors, radius, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import * as transactionService from '@/services/transactionService';
import { TransactionType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const Statistics = () => {
    const { user } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);

    useEffect(() => {
        if (activeIndex === 0) getWeeklyStats();
        if (activeIndex === 1) getMonthlyStats();
        if (activeIndex === 2) getYearlyStats();
    }, [activeIndex]);

    const getWeeklyStats = async () => {
        setChartLoading(true);
        const res = await transactionService.fetchWeeklyStats(user?.uid as string);
        setChartLoading(false);
        if (res.success && res.data) {
            setChartData(res.data.stats);
            setTransactions(res.data.transactions);
        }
    };

    const getMonthlyStats = async () => {
        setChartLoading(true);
        const res = await transactionService.fetchMonthlyStats(user?.uid as string);
        setChartLoading(false);
        if (res.success && res.data) {
            setChartData(res.data.stats);
            setTransactions(res.data.transactions);
        }
    };

    const getYearlyStats = async () => {
        setChartLoading(true);
        const res = await transactionService.fetchYearlyStats(user?.uid as string);
        setChartLoading(false);
        if (res.success && res.data) {
            setChartData(res.data.stats);
            setTransactions(res.data.transactions);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header title="Statistics" />
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <SegmentedControl
                        values={['Weekly', 'Monthly', 'Yearly']}
                        selectedIndex={activeIndex}
                        onChange={(event) => {
                            setActiveIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                        tintColor={colors.neutral200}
                        backgroundColor={colors.neutral800}
                        appearance="dark"
                        activeFontStyle={styles.segmentFontStyle}
                        fontStyle={styles.fontStyle}
                        style={styles.segmentStyle}
                    />

                    <View style={styles.chartContainer}>
                        {chartData.length > 0 ? (
                            <BarChart
                                data={chartData}
                                barWidth={scale(12)}
                                spacing={activeIndex === 0 ? scale(16) : scale(25)}
                                roundedTop
                                roundedBottom
                                hideRules
                                yAxisLabelPrefix="$"
                                yAxisThickness={0}
                                xAxisThickness={0}
                                yAxisLabelWidth={activeIndex === 0 ? scale(25) : scale(35)}
                                yAxisTextStyle={styles.axisText}
                                xAxisLabelTextStyle={styles.axisText}
                                noOfSections={3}
                                minHeight={5}
                                isAnimated={false}
                            />
                        ) : null}

                        {chartLoading && (
                            <View style={styles.chartLoadingContainer}>
                                <Loading color={colors.white} />
                            </View>
                        )}
                    </View>

                    <TransactionList
                        title="Transactions"
                        emptyListMessage="No transactions found"
                        data={transactions}
                    />
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default Statistics;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: verticalScale(5),
        gap: spacingY._10,
    },
    scrollContainer: {
        gap: spacingY._20,
        paddingTop: spacingY._5,
        paddingBottom: verticalScale(100),
    },
    segmentStyle: {
        height: scale(37),
    },
    segmentFontStyle: {
        fontSize: verticalScale(13),
        fontWeight: 'bold',
        color: colors.black,
    },
    fontStyle: {
        fontSize: verticalScale(13),
        color: colors.white,
    },
    chartContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral900,
        padding: spacingY._12,
        borderRadius: radius._12,
        width: '100%',
        height: verticalScale(210),
    },
    chartLoadingContainer: {
        position: 'absolute',
        width: '100%',
        height: verticalScale(210),
        borderRadius: radius._12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    axisText: {
        color: colors.neutral350,
        fontSize: verticalScale(12),
    },
});