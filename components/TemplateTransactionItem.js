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
        if (props.categoryId == null) return
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

            {/* <View style={[styles.item]}>
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
            </View> */}

            <View style={[styles.item]}>
                <View style={styles.item_info}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.item_name}>{props.name}</Text>
                    <Text numberOfLines={1} style={styles.dateText}>{""
                        + (props.executionDate.getDate() < 10 ? "0" + props.executionDate.getDate() : props.executionDate.getDate()) + "."
                        + (props.executionDate.getMonth() < 9 ? "0" + (props.executionDate.getMonth() + 1) : (props.executionDate.getMonth() + 1)) + "."
                        + props.executionDate.getFullYear()}</Text>
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
        fontSize: theme.fontSize.regular,
        fontWeight: 'bold',
    },
    valueText: {
        fontSize: theme.fontSize.regular,
        fontFamily: 'JetBrainsMono',
        color: theme.colors.primary_text,
    },
    dateText: {
        color: theme.colors.secondary_text,
        fontSize: 12,
    }
});

export default TemplateTransactionItem;
