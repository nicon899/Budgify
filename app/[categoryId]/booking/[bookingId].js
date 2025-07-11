import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { finContext } from '../../../contexts/FinContext';

const BookingScreen = () => {
    const { bookingId, categoryId } = useLocalSearchParams();
    const id = bookingId ? parseInt(bookingId, 10) : null; // Ensure id is a number
    const { transactions, actions } = useContext(finContext);
    const booking = transactions.find((booking) => booking.id === id);
    const router = useRouter();

    if (!booking) {
        return (<Text>Booking gelöscht!</Text>);
    }

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Delete Booking',
                            'This Booking will be removed for good!',
                            [{ text: 'Cancel', style: 'cancel' },
                            {
                                text: 'OK', onPress: () => {
                                    // props.navigation.goBack();
                                    actions.deleteTransaction(id)
                                }
                            },
                            ], { cancelable: true }
                        )
                    }}
                >
                    <MaterialCommunityIcons name="delete" size={scaleFontSize(48)} color="red" />
                </TouchableOpacity>
            </View>
            <View style={styles.name}>
                <Text style={{ color: 'white', fontSize: scaleFontSize(42), fontWeight: 'bold', maxWidth: '85%' }}>{booking.name} </Text>
                <TouchableOpacity
                    style={{ maxWidth: '15%' }}

                    onPress={() => {
                        router.navigate(`${categoryId}/booking/${id}/edit`);
                    }}
                >
                    <MaterialCommunityIcons name="lead-pencil" size={scaleFontSize(36)} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.info}>
                <Text style={{ color: 'grey', fontSize: scaleFontSize(36) }}>{
                    "" + (booking.date.getDate() < 10 ? "0" + booking.date.getDate() : booking.date.getDate()) + "."
                    + (booking.date.getMonth() < 9 ? "0" + (booking.date.getMonth() + 1) : (booking.date.getMonth() + 1)) + "."
                    + booking.date.getFullYear()}</Text>
                <Text style={{ color: booking.value > 0 ? 'green' : 'red', fontSize: scaleFontSize(36), fontWeight: 'bold' }}>{booking.value} €</Text>
                <Text style={{ color: 'white', fontSize: scaleFontSize(22) }}>{booking.details}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    info: {
        marginHorizontal: 25,
    },
    topBar: {
        height: '10%',
        padding: 5,
        alignItems: 'flex-end'
    },
    name: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '100%',
        marginHorizontal: 25,
    }
});

export default BookingScreen;
