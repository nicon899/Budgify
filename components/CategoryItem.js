import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


const CategoryItem = props => {

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

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
                <Text numberOfLines={1} style={{ color: 'white', fontSize: scaleFontSize(32), fontWeight: 'bold' }}>{props.item.name} </Text>
                <Text numberOfLines={1} style={{ color: props.item.value > 0 ? 'green' : 'red', fontSize: scaleFontSize(28), fontFamily: 'JetBrainsMono' }}>{round(props.item.value)}</Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 10,
        paddingLeft: 5
    }
});

export default CategoryItem;
