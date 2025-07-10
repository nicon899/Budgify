import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const Picker = props => {
    const [selectedItem, setSelectedItem] = useState(props.presetItemId !== null ? props.data.find((item) => item.id === props.presetItemId) : props.data[0]);
    const [showList, setShowList] = useState(false);

    useEffect(() => { props.onValueChange(selectedItem) }, [])

    return (
        <View style={[props.style, { height: showList ? props.style.height * 5 : props.style.height }]}>
            <View style={styles.item}>
                <TouchableOpacity
                    onPress={() => {
                        setShowList(!showList);
                    }}
                >
                    <Text>{selectedItem.name}</Text>
                </TouchableOpacity>
            </View>
            {showList && <View style={styles.list}>
                <FlatList
                    data={props.data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={itemData => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedItem(itemData.item);
                                props.onValueChange(itemData.item);
                            }}
                        >
                            <Text>{itemData.item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        width: '100%',
        height: '80%',
        backgroundColor: 'red'
    },
    item: {
        backgroundColor: 'red',
        alignItems: 'center',
    }
});

export default Picker;
