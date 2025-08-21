import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import BookingItem from './BookingItem';
import CategoryItem from './CategoryItem';

const CategoryItemList = props => {
    return (
        <View style={props.style}>
            <FlatList
                data={props.categories.concat(props.bookings)}
                keyExtractor={item => `${item.id}`}
                renderItem={itemData => {
                    if (!itemData.item.categoryId) {
                        return <CategoryItem showContent={(id) => props.showCategory(id)} item={itemData.item} />
                    } else {
                        return <BookingItem showBooking={(id) => props.showBooking(id)} id={itemData.item.id} name={itemData.item.name} value={itemData.item.value} date={itemData.item.date} isMarginTop={itemData.item.id === props.bookings[0].id} />
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    categoryList: {
        marginBottom: 20,
        marginTop: 10,
    }
});

export default CategoryItemList;
