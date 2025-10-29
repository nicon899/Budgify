import { useApi } from '@/hooks/useApi';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const CategoryPicker = props => {
    const [pickerItems, setPickerItems] = useState([]);
    const { getPossibleParents } = useApi()

    useEffect(() => {
        (async () => {
            const selectableCategories = await getPossibleParents(props.categoryId)

            const newPickerItems = [];
            selectableCategories.sort((a, b) => {
                if (a.path < b.path) { return -1; }
                if (a.path > b.path) { return 1; }
                return 0;
            }).forEach(c => {
                newPickerItems.push(
                    <Picker.Item
                        key={c.id}
                        label={c.path}
                        value={c.id}
                    />
                )
            });

            setPickerItems(newPickerItems)
        })()
    }, [])

    return (
        <View style={[styles.picker, props.style]}>
            {pickerItems.length > 0 && <Picker
                selectedValue={props.categoryId}
                style={{ color: 'white', textAlign: 'center' }}
                onValueChange={(itemValue, itemIndex) => {
                    props.setCategoryId(itemValue);
                }}>
                {pickerItems}
            </Picker>}
        </View>
    )
}

export default CategoryPicker

const styles = StyleSheet.create({
    title: {
        color: 'white',
        padding: 10
    },
    picker: {
        width: '100%',
    }
})
