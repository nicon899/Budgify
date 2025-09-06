import { finContext } from '@/contexts/FinContext';
import { useContext } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TemplateTransactionItem = props => {
    const context = useContext(finContext);
    const category = context.categories.find(cat => cat.id === props.categoryId);
    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    return (
        <TouchableOpacity
            onPress={() => {
                props.showBooking(props.id);
            }}>
            <View style={[styles.item]}>
                <View><Text style={{ color: 'grey', fontSize: scaleFontSize(16) }}>{category?.name}</Text></View>
                <View style={styles.itemName}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, maxWidth: '80%' }}>
                        <Text numberOfLines={1} style={{ color: 'grey', fontSize: scaleFontSize(16) }}>{""
                            + (props.date.getDate() < 10 ? "0" + props.date.getDate() : props.date.getDate()) + "."
                            + (props.date.getMonth() < 9 ? "0" + (props.date.getMonth() + 1) : (props.date.getMonth() + 1)) + "."
                            + props.date.getFullYear()}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: 'white', fontSize: 20 }}>{props.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ color: props.value > 0 ? 'green' : 'red', fontSize: scaleFontSize(24), fontFamily: 'JetBrainsMono' }}>{props.value.toFixed(2)}</Text>
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
