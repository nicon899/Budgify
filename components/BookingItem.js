import theme, { FONT_SIZE_REGULAR } from '@/app/theme';
import { getDateText } from '@/util/util';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BookingItem = props => {

    return (
        <TouchableOpacity
            onPress={() => {
                props.showBooking(props.id);
            }}>
            <View style={[styles.item]}>
                <View style={styles.item_info}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.item_name}>{props.name}</Text>
                    <Text numberOfLines={1}  style={styles.dateText}>{getDateText(props.date)}</Text>
                </View>
                <Text numberOfLines={1} style={[styles.valueText, { color: props.value > 0 ? theme.colors.positive_text : theme.colors.negative_text }]}>{props.value.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomColor: '#333333',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        color: theme.colors.primary_text,
    },
    item_info: {
        maxWidth: '70%',
    },
    item_name: {
        color: theme.colors.primary_text,
        fontSize: FONT_SIZE_REGULAR,
        fontWeight: 'bold',
    },
    valueText: {
        fontSize: FONT_SIZE_REGULAR,
        fontFamily: 'JetBrainsMono',
        color: theme.colors.primary_text,
    },
    dateText: {
        color: theme.colors.secondary_text,
        fontSize: 12,
    }
});

export default BookingItem;
