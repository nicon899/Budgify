import alert from '@/components/alert';
import CategoryPicker from '@/components/CategoryPicker';
import { useApi } from '@/hooks/useApi';
import { scaleFontSize } from '@/util/util';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

const TemplateTransaction = props => {
    const { templateId: templateIdStr, transactionId: transactionIdStr } = useLocalSearchParams();
    const templateId = templateIdStr ? Number(templateIdStr) : null;
    const transactionId = transactionIdStr ? Number(transactionIdStr) : null;
    const { getTemplateTransactionById } = useApi()
    const [categoryId, setCategoryId] = useState(null);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [detail, setDetails] = useState('');
    const [dateOffset, setDateOffset] = useState('0');
    const [isPositive, setIsPositive] = useState(true);
    const router = useRouter();
    const { updateTemplateTransaction, deleteTemplateTransaction } = useApi()

    useEffect(() => {
        if (!transactionId) return
        (async () => {
            const templateTransaction = await getTemplateTransactionById(transactionId);
            if (templateTransaction) {
                setCategoryId(templateTransaction.categoryId);
                setName(templateTransaction.name);
                setValue(Math.abs(templateTransaction.value).toString());
                setDetails(templateTransaction.detail);
                setDateOffset(templateTransaction.dateOffset);
                setIsPositive(templateTransaction.value > 0 ? true : false);
            }
        })();
    }, [transactionId]);

    useEffect(() => {
        console.log(categoryId)
    }, [categoryId]);

    if (!transactionId) {
        return (<Text>Template Transaction not found!</Text>);
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.screen}>

                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            alert(
                                'Delete Template Transaction',
                                'This Template Transaction will be removed for good!',
                                [{ text: 'Cancel', style: 'cancel', onPress: () => { } },
                                {
                                    text: 'OK', onPress: async () => {
                                        await deleteTemplateTransaction(transactionId)
                                        router.setParams({ refresh: Date.now() });
                                        router.dismiss();
                                    }
                                },
                                ], { cancelable: true }
                            )
                        }}
                    >
                        <MaterialCommunityIcons name="delete" size={scaleFontSize(48)} color="red" />
                    </TouchableOpacity>
                </View>

                <CategoryPicker style={styles.categoryPicker} categoryId={categoryId} setCategoryId={setCategoryId} />

                <View style={{ flexDirection: 'row', width: '75%', alignItems: 'center', marginBottom: 25, backgroundColor: '#222', padding: 5, borderRadius: 10, justifyContent: 'space-between' }}>
                    <Text style={{ color: 'white', marginRight: 10 }}>Date Offset</Text>
                    <TextInput
                        style={[styles.dateInput, { width: '50%' }]}
                        placeholderTextColor="white"
                        placeholder='0'
                        blurOnSubmit
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={dateOffset}
                        keyboardType='number-pad'
                        onChangeText={(input) => setDateOffset(input)}
                    />
                </View>


                <TextInput
                    placeholder='Default Name'
                    placeholderTextColor="grey"
                    style={[styles.input, { marginBottom: 25 }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={name}
                    onChangeText={(input) => setName(input)}
                />

                <View style={styles.valueInput}>
                    <TouchableOpacity
                        onPress={() => setIsPositive(!isPositive)}   >
                        {isPositive && <AntDesign style={{ marginRight: '10%' }} name="plus-circle" size={32} color="green" />}
                        {!isPositive && <AntDesign style={{ marginRight: '10%' }} name="minus-circle" size={32} color="red" />}
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, { width: '50%' }]}
                        placeholderTextColor="white"
                        placeholder='Amount'
                        blurOnSubmit
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={value}
                        keyboardType='number-pad'
                        onChangeText={(input) => setValue(input)}
                    />
                </View>

                <TextInput
                    placeholder='Details'
                    placeholderTextColor="white"
                    style={[styles.input, { marginBottom: 50 }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={detail}
                    numberOfLines={4}
                    multiline={true}
                    onChangeText={(input) => setDetails(input)}
                />
            </View>

            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: 'red' }]}
                    onPress={() => {
                        router.dismiss();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: 'green' }]}
                    onPress={async () => {
                        if (transactionId == null || templateId == null) return;
                        console.log(categoryId)
                        if (/^[0-9]+(\.[0-9]{1,2})?$/g.test(value)) {
                            await updateTemplateTransaction({
                                id: transactionId,
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
                                default: alert('Invalid Value!', 'Please enter a valid Value');
                            }

                        }
                    }}
                >
                    <Text style={{ color: 'green' }}>OK</Text>
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
    topBar: {
        // height: '10%',
        padding: 5,
        alignItems: 'flex-end'
    },
    input: {
        width: '75%',
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
        borderRadius: 5,
    },
    dateInput: {
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
        borderRadius: 5,
    },
    valueInput: {
        flexDirection: 'row',
        width: '75%',
        alignItems: 'center',
        marginBottom: 25
    },
    actionButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
    categoryPicker: {
        width: '80%',
        marginBottom: 20,
    }
});

export default TemplateTransaction;
