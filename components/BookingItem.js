import theme from '@/app/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BookingItem = props => {

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    return (
        <TouchableOpacity
            onPress={() => {
                props.showBooking(props.id);
            }}>
            <View style={[styles.item, { marginTop: props.isMarginTop ? '3%' : 0, height: 50 }]}>
                <View style={{ width: '50%', justifyContent: 'center', }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: 'white', fontSize: 20 }}>{props.name}</Text>
                    <Text numberOfLines={1}  style={{ color: 'grey', fontSize: scaleFontSize(16) }}>{""
                        + (props.date.getDate() < 10 ? "0" + props.date.getDate() : props.date.getDate()) + "."
                        + (props.date.getMonth() < 9 ? "0" + (props.date.getMonth() + 1) : (props.date.getMonth() + 1)) + "."
                        + props.date.getFullYear()}</Text>

                </View>
                <Text numberOfLines={1} style={{ color: props.value > 0 ? 'green' : 'red', fontSize: scaleFontSize(24), fontFamily: 'JetBrainsMono' }}>{props.value.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
        paddingHorizontal: 5,
        borderBottomColor: '#333333',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        color: theme.colors.primary_text,
    }
});

export default BookingItem;
