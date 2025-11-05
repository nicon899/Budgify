import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../app/theme.ts';

const TemplateTransactionItem = props => {
    const [categoryLabel, setCategoryLabel] = useState('');
    const { getCategoryPathLabelById } = useApi()

    useEffect(() => {
        if (props.dateOffset != null && props.dateOffset !== 0) {
            const newDate = new Date(props.date);
            //add props.dateOffset days to newDate
            newDate.setDate(newDate.getDate() + props.dateOffset);
            props.setExecutionDate(newDate);
        } else {
            props.setExecutionDate(new Date(props.date));
        }
    }, [props.date, props.dateOffset]);

    useEffect(() => {
        if(props.categoryId == null) return
        (async () => {
            const fetchedLabel = getCategoryPathLabelById(props.categoryId)
            setCategoryLabel(fetchedLabel)
        })()
    }, [props.categoryId])

    return (
        <TouchableOpacity
            onPress={() => {
                props.onPress();
            }}>
            <View style={[styles.item]}>
                <View><Text style={{ color: 'grey', fontSize: theme.fontSize.regular }}>{categoryLabel}</Text></View>
                <View style={styles.itemName}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, maxWidth: '80%' }}>
                        <Text numberOfLines={1} style={{ color: 'grey', fontSize: theme.fontSize.regular }}>{""
                            + (props.executionDate.getDate() < 10 ? "0" + props.executionDate.getDate() : props.executionDate.getDate()) + "."
                            + (props.executionDate.getMonth() < 9 ? "0" + (props.executionDate.getMonth() + 1) : (props.executionDate.getMonth() + 1)) + "."
                            + props.executionDate.getFullYear()}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: 'white', fontSize: 20 }}>{props.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ color: props.value > 0 ? 'green' : 'red', fontSize: theme.fontSize.large, fontFamily: 'JetBrainsMono' }}>{props.value.toFixed(2)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'column',
        marginVertical: 5,
        marginHorizontal: 15,
        paddingHorizontal: 5,
        borderBottomColor: '#333333',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        backgroundColor: '#1e1e1e',
        borderRadius: 5,
        paddingVertical: 5
    },
    itemName: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
        paddingHorizontal: 5,
        justifyContent: 'space-between',
        color: 'white'
    },
    dateOffset: {
        color: 'grey',
    }
});

export default TemplateTransactionItem;
