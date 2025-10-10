import theme, { FONT_SIZE_LARGE } from '@/app/theme';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const CategoryItem = props => {

    const round = (value) => {
        return (Math.round((value) * 100 + Number.EPSILON) / 100).toFixed(2);
    }

    return (
        <TouchableOpacity
            onPress={() => {
                props.showContent(props.item.id);
            }}
        >
            <View style={styles.item}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.name}>{props.item.name} </Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.value, { color: props.item.value > 0 ? theme.colors.positive_text : theme.colors.negative_text }]}>{round(props.item.value)}</Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    name: {
        color: theme.colors.primary_text,
        fontSize: FONT_SIZE_LARGE,
        fontWeight: 'bold',
        maxWidth: '70%',
    },
    value: {
        fontSize: FONT_SIZE_LARGE, 
        fontFamily: 'JetBrainsMono'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        color: theme.colors.primary_text,
        backgroundColor: theme.colors.backgroundTertiary,
        marginBottom: 5,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
    }
});

export default CategoryItem;
