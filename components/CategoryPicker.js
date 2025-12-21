import theme from '@/app/theme';
import { useApi } from '@/hooks/useApi';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const CategoryPicker = props => {
    const [pickerItems, setPickerItems] = useState([]);
    const { getPossibleParents, getAllCategories } = useApi()

    useEffect(() => {
        (async () => {
            const selectableCategories = []
            if (props.filterChildCategories != null) {
                const fetchedCategories = await getPossibleParents(props.filterChildCategories)
                fetchedCategories.push({
                    id: null,
                    path: '*Total*'
                })
                selectableCategories.push(...fetchedCategories)
            } else {
                const fetchedCategories = await getAllCategories(true)
                selectableCategories.push(...fetchedCategories)
            }

            if (props.categoryId == null) {
                props.setCategoryId(selectableCategories[0].id)
            }

            const newPickerItems = [];
            selectableCategories.sort((a, b) => {
                if (a.path < b.path) { return -1; }
                if (a.path > b.path) { return 1; }
                return 0;
            }).forEach(c => {
                newPickerItems.push(
                    <Picker.Item
                        style={{ color: theme.colors.dark_text }}
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
                style={{ color: theme.colors.primary_text, textAlign: 'center', backgroundColor: 'transparent' }}
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
    picker: {
        width: '80%',
        maxWidth: 300,
        backgroundColor: theme.colors.backgroundSecondary,
    }
})
