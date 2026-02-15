import theme, { CURRENCY_SYMBOL } from '@/app/theme';
import { useApi } from '@/hooks/useApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import CategoryPicker from '../../../../../components/CategoryPicker';

const TemplateTransaction = props => {
    const { templateId: templateIdParamStr } = useLocalSearchParams();
    const templateId = templateIdParamStr ? Number(templateIdParamStr) : null;
    const [categoryId, setCategoryId] = useState(null);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [detail, setDetails] = useState('');
    const [dateOffset, setDateOffset] = useState('0');
    const [isPositive, setIsPositive] = useState(true);
    const router = useRouter();
    const { createTemplateTransaction } = useApi()

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.screen}>

                <Text style={styles.label}>Category</Text>
                <CategoryPicker style={styles.categoryPicker} categoryId={categoryId} setCategoryId={setCategoryId} />

                <Text style={styles.label}>Value</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {!isPositive && <Text style={styles.negativeSymbol}>-</Text>}
                    <Text style={styles.currencySymbol}>{CURRENCY_SYMBOL}</Text>
                    <TextInput
                        style={[styles.valueInput]}
                        placeholderTextColor="white"
                        placeholder='00,00'
                        blurOnSubmit
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={value}
                        keyboardType='number-pad'
                        onChangeText={(input) => setValue(input)}
                    />
                </View>

                <View style={styles.expenseIncomeContainer}>
                    <TouchableOpacity
                        onPress={() => setIsPositive(false)}   >
                        <Text style={isPositive ? styles.expenseIncomeText : [styles.expenseIncomeTextSelected, {
                            backgroundColor: theme.colors.negative_text,
                        }]}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsPositive(true)}   >
                        <Text style={isPositive ? [styles.expenseIncomeTextSelected, {
                            backgroundColor: theme.colors.positive_text, color: theme.colors.dark_text
                        }] : styles.expenseIncomeText}>Income</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Default Name</Text>
                <TextInput
                    placeholderTextColor="grey"
                    style={[styles.input, { marginBottom: 25 }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={name}
                    onChangeText={(input) => setName(input)}
                />


                <Text style={styles.label}>Date Offset</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="white"
                    placeholder='0'
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={dateOffset}
                    keyboardType='number-pad'
                    onChangeText={(input) => setDateOffset(input)}
                />

                <Text style={styles.label}>Details</Text>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={detail}
                    numberOfLines={4}
                    multiline={true}
                    onChangeText={(input) => setDetails(input)}
                />
                
                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: 'green' }]}
                    onPress={async () => {
                        if (!templateId) return;
                        if (/^[0-9]+(\.[0-9]{1,2})?$/g.test(value)) {
                            await createTemplateTransaction({
                                name: name,
                                value: isPositive ? Number(value) : -1 * Number(value),
                                detail: detail,
                                dateOffset: Number(dateOffset),
                                templateId: templateId,
                                categoryId: Number(categoryId)
                            })
                            router.dismiss();
                        } else {
                            switch (Platform.OS) {
                                case 'android': ToastAndroid.show('Please enter a valid Value!', ToastAndroid.SHORT)
                                    break;
                                case 'web': alert('Please enter a valid Value');
                                    break;
                                default: Alert.alert('Invalid Value!', 'Please enter a valid Value');
                            }

                        }
                    }}
                >
                    <Text style={styles.actionButtonText}>Save Transaction</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        backgroundColor: 'black',
        paddingTop: 20,
    },
    input: {
        width: '80%',
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.primary_text,
        borderRadius: 10,
        padding: 10,
    },
    dateInput: {
        width: '80%',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
        padding: 10,
    },
    valueInput: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.xxxlarge,
        maxWidth: 256,
        // // width: '70%',
        // textAlign: 'center',
    },
    actionButton: {
        marginTop: 25,
        width: '80%',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: theme.colors.accent,
        color: theme.colors.primary_text,
    },
    actionButtonText: {
        color: theme.colors.dark_text,
        fontSize: theme.fontSize.regular,
    },
    categoryPicker: {
        width: '80%',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
    },
    currencySymbol: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.xxxlarge,
        marginRight: 5,
    },
    negativeSymbol: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.xxxlarge,
        // marginRight: 5,
        left: -20,
        position: 'absolute',
    },
    expenseIncomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        width: '80%',
        justifyContent: 'space-evenly',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
    },
    expenseIncomeText: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.regular,
    },
    expenseIncomeTextSelected: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.regular,
        paddingVertical: 2.5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    label: {
        color: theme.colors.secondary_text,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 5,
        marginTop: 15,
    }
});

export default TemplateTransaction;
