import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { finContext } from '../../../contexts/FinContext';
import theme, { FONT_SIZE_LARGE, FONT_SIZE_XLARGE } from '../../theme';

const BookingScreen = () => {
    const { bookingId, categoryId } = useLocalSearchParams();
    const id = bookingId ? parseInt(bookingId, 10) : null; // Ensure id is a number
    const { transactions, actions } = useContext(finContext);
    const booking = transactions.find((booking) => booking.id === id);
    const router = useRouter();

    if (!booking) {
        return (<Text>Booking gelöscht!</Text>);
    }

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Delete Booking',
                                'This Booking will be removed for good!',
                                [{ text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'OK', onPress: async () => {
                                        await actions.deleteTransaction(id)
                                        router.dismiss();
                                    }
                                },
                                ], { cancelable: true }
                            )
                        }}
                    >
                        <MaterialCommunityIcons name="delete" size={FONT_SIZE_XLARGE} color="red" />
                    </TouchableOpacity>
                </View>
                <View style={styles.name}>
                    <Text style={{ color: 'white', fontSize: FONT_SIZE_XLARGE, fontWeight: 'bold', maxWidth: '85%' }}>{booking.name} </Text>
                    <TouchableOpacity
                        style={{ maxWidth: '15%' }}

                        onPress={() => {
                            router.navigate(`${categoryId}/booking/${id}/edit`);
                        }}
                    >
                        <MaterialCommunityIcons name="lead-pencil" size={FONT_SIZE_LARGE} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.info}>
                    <Text style={{ color: 'grey', fontSize: FONT_SIZE_LARGE }}>{
                        "" + (booking.date.getDate() < 10 ? "0" + booking.date.getDate() : booking.date.getDate()) + "."
                        + (booking.date.getMonth() < 9 ? "0" + (booking.date.getMonth() + 1) : (booking.date.getMonth() + 1)) + "."
                        + booking.date.getFullYear()}</Text>
                    <Text style={{ color: booking.value > 0 ? 'green' : 'red', fontSize: FONT_SIZE_LARGE, fontWeight: 'bold' }}>{booking.value} €</Text>
                    <Text style={{ color: 'white', fontSize: FONT_SIZE_LARGE }}>{booking.details}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    card: {
        backgroundColor: theme.colors.backgroundSecondary,
        // flex: 1,
        margin: 25,
        marginTop: 75,
        borderRadius: 20,
    },
    info: {
        marginHorizontal: 25,
    },
    topBar: {
        // height: '10%',
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
