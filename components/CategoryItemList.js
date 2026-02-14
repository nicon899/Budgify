import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import BookingItem from './BookingItem';
import CategoryItem from './CategoryItem';

const CategoryItemList = props => {
    return (
        <View style={props.style}>
            <FlatList
                data={[...props.categories, ...props.bookings]}
                keyExtractor={item => `${item.categoryId ? 'transaction' : 'category'}_${item.id}`}
                onEndReached={props.loadMore}
                onEndReachedThreshold={0.5}
                renderItem={itemData => {
                    if (!itemData.item.categoryId) {
                        return <CategoryItem showContent={(id) => props.showCategory(id)} item={itemData.item} />
                    } else {
                        return <BookingItem showBooking={(id) => props.showBooking(id)} id={itemData.item.id} name={itemData.item.name} value={itemData.item.value} date={itemData.item.date} />
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
