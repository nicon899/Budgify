import { Picker } from '@react-native-picker/picker';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { finContext } from '../contexts/FinContext';

const CategoryPicker = props => {
    const allCategories = useContext(finContext).categories
    const [pickerItems, setPickerItems] = useState([]);

    useEffect(() => {
        const selectableCategories = allCategories.filter(c => props.noFilter || c.id !== null);
        selectableCategories.filter(c => c.parentId === null).forEach(c => c.label = c.name);

        const getParentLabel = (parentId) => {
            const parentCat = selectableCategories.find(c => c.id === parentId);
            if (!parentCat) return '';
            if (parentCat.label) return parentCat.label;
            parentCat.label = getParentLabel(parentCat.parentId) + '/' + parentCat.name;
            return parentCat.label;
        }

        selectableCategories.filter(c => c.parentId !== null).forEach(c => c.label = getParentLabel(c.parentId) + '/' + c.name);

        const newPickerItems = [];
        selectableCategories.sort((a, b) => {
            if (a.label < b.label) { return -1; }
            if (a.label > b.label) { return 1; }
            return 0;
        }).forEach(c => {
            newPickerItems.push(
                <Picker.Item
                    key={c.id}
                    label={c.label}
                    value={c.id}
                />
            )
        });

        setPickerItems(newPickerItems);
    }, [allCategories])

    return (
        <View style={{ width: '100%' }}>
            {pickerItems.length > 0 && <Picker
                selectedValue={props.categoryId}
                style={{ height: 50, color: 'white', width: '90%', textAlign: 'center', marginLeft: 50, marginBottom: 20 }}
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
})
