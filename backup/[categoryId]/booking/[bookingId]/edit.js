import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import CategoryPicker from '../../../../components/CategoryPicker';
import DatePicker from '../../../../components/DatePicker';
import { finContext } from '../../../../contexts/FinContext';

const EditScreen = props => {
    const { bookingId } = useLocalSearchParams();
    const id = bookingId ? parseInt(bookingId, 10) : null; // Ensure id is a number
    const { transactions, actions } = useContext(finContext);
    const booking = transactions.find((booking) => booking.id === id);
    const [categoryId, setCategoryId] = useState(booking.categoryId);
    const [name, setName] = useState(booking.name);
    const [value, setValue] = useState(Math.abs(booking.value).toString());
    const [details, setDetails] = useState(booking.details);
    const [date, setDate] = useState(new Date(booking.date));
    const [isPositive, setIsPositive] = useState(booking.value > 0 ? true : false);
    const router = useRouter();

    if (!booking) {
        return (<Text>Booking not found!</Text>);
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.screen}>
                <Text style={{ color: 'white', marginBottom: 20, fontWeight: 'bold', fontSize: FONT_SIZE_XLARGE }}>Edit Booking</Text>

                <CategoryPicker style={styles.categoryPicker} categoryId={categoryId} setCategoryId={setCategoryId} />

                <TextInput
                    placeholder='Name'
                    placeholderTextColor="white"
                    style={[styles.input, { marginBottom: 25 }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={name}
                    onChangeText={(input) => setName(input)}
                />

                <DatePicker
                    style={styles.dateInput}
                    date={date}
                    setDate={setDate}
                    setTime={false}
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

                            await actions.updateTransaction({
                                id: id,
                                name: name,
                                value: isPositive ? value : -1 * value,
                                details: details,
                                date: date,
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
        width: '75%',
        marginBottom: 25
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

export default EditScreen;
