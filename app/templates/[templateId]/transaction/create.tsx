import { finContext } from '@/contexts/FinContext';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import CategoryPicker from '../../../../components/CategoryPicker';

const TemplateTransaction = props => {
    const { categories, actions } = useContext(finContext)
    const addTemplateTransaction = actions.addTemplateTransaction;
    const { templateId: templateIdParam } = useLocalSearchParams();
    const templateId = templateIdParam ? parseInt(templateIdParam) : null;
    const [categoryId, setCategoryId] = useState(categories[1].id);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [details, setDetails] = useState('');
    const [dateOffset, setDateOffset] = useState('0');
    const [isPositive, setIsPositive] = useState(true);
    const router = useRouter();

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.screen}>

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
                        {isPositive && <AntDesign style={{ marginRight: '10%' }} name="pluscircle" size={32} color="green" />}
                        {!isPositive && <AntDesign style={{ marginRight: '10%' }} name="minuscircle" size={32} color="red" />}
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
                    value={details}
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
                        if (/^[0-9]+(\.[0-9]{1,2})?$/g.test(value)) {
                            await addTemplateTransaction({
                                name: name,
                                value: isPositive ? value : -1 * value,
                                details: details,
                                dateOffset: dateOffset,
                                templateId: templateId,
                                categoryId: categoryId
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
