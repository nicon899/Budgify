import CustomDatePicker from '@/components/CustomDatePicker';
import { scaleFontSize } from '@/util/util';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton, Menu, Provider as PaperProvider } from "react-native-paper";
import CategoryItemList from '../components/CategoryItemList';
import { finContext } from '../contexts/FinContext';
import { Category } from '../types/Category';
import theme, { CURRENCY_SYMBOL, FONT_SIZE_LARGE, FONT_SIZE_SMALL, FONT_SIZE_XLARGE } from "./theme";


const CategoryScreen = () => {
    const { categoryId: categoryIdParamStr } = useLocalSearchParams();
    const categoryIdParam = categoryIdParamStr ? parseInt(categoryIdParamStr as string, 10) : null;
    const context = useContext(finContext);
    const [date, _setDate] = useState(new Date());
    const [selectedCategory, setSelectedCategory] = useState<Category>(categoryIdParam ? context.categories.find((c: Category) => c.id === categoryIdParam) : context.categories[0]);
    const childCategories = selectedCategory ? context.categories.filter((category: Category) => category.id !== null && category.parentId === selectedCategory.id) : [];
    const router = useRouter();
    const isFocused = useIsFocused();
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    useEffect(() => {
        if (selectedCategory) {
            setSelectedCategory(context.categories.find((c: Category) => c.id === selectedCategory.id))
        } else if (context.categories.length > 0) {
            setSelectedCategory(categoryIdParam ? context.categories.find((c: Category) => c.id === categoryIdParam) : context.categories[0]);
        }
    }, [context.categories, categoryIdParam, selectedCategory])


    const setDate = (date: Date) => {
        _setDate(date);
        context.actions.refresh(date.toISOString())
    };

    const setLatestDate = () => {
        let today = new Date();
        if (context.transactions[0]) {
            let newDate = new Date(context.transactions[0].date);
            setDate(newDate > today ? newDate : today);
        } else {
            setDate(today);
        }
    }

    useEffect(() => {
        setLatestDate();
    }, [isFocused]);


    useEffect(() => {
        const backAction = () => {
            if (selectedCategory.id === null) {
                return false;
            } else {
                setSelectedCategory(context.categories.find((category) => category.id === selectedCategory.parentId));
                return true;
            }
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            backHandler.remove()
        };
    }, [selectedCategory]);

    if (!selectedCategory) {
        return (
            <View style={styles.screen}>
                <View style={styles.header}>
                    <Text style={{ color: 'white', fontSize: scaleFontSize(36), fontWeight: 'bold', textAlign: 'center' }}>No Category Selected</Text>
                </View>
            </View>
        );
    }

    return (
        <PaperProvider>

            <View style={styles.screen}>
                {/* <View style={styles.topBar}>
                    <View style={styles.dateBar}>
                                    
                        <View style={styles.topBarDateIcons}>
                            
                        </View>
                    
                    </View>
                    
                </View> */}

                <View style={styles.toolbar}>
                    <CustomDatePicker
                        style={{}}
                        style_btn={styles.toolbar_button}
                        date={date}
                        setDate={setDate}
                        setTime={false}
                        showArrow={false}
                        text={'Custom'}
                    />
                    <TouchableOpacity
                        style={styles.toolbar_button}
                        onPress={() => setDate(new Date())}
                    >
                        <Text style={styles.toolbar_button_text}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.toolbar_button}
                        onPress={() => setLatestDate()}>
                        <Text style={styles.toolbar_button_text}>Latest</Text>
                    </TouchableOpacity>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton
                                icon="dots-vertical" // die drei Punkte
                                size={24}
                                onPress={openMenu}
                            />
                        }
                    >
                        <Menu.Item onPress={() => router.navigate(`/settings`)} title="Settings" />
                        <Menu.Item onPress={() => router.navigate(`/templates`)} title="Templates" />
                    </Menu>
                </View>


                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.header_inner}
                        onPress={() => {
                            router.navigate(`category/${selectedCategory.id}`);
                        }}
                    >
                        <Text style={styles.header_route}>Test/Test/Test</Text>
                        <View style={styles.header_title}>
                            <FontAwesome6 name="sack-dollar" size={FONT_SIZE_LARGE} color={selectedCategory.value > 0 ? theme.colors.positive_text : theme.colors.negative_text} />
                            <Text style={styles.header_title_text}>{selectedCategory.name}</Text>
                        </View>
                        <Text numberOfLines={1} style={[styles.header_value, { color: selectedCategory.value > 0 ? theme.colors.positive_text : theme.colors.negative_text }]}>{(selectedCategory.name + selectedCategory.value).length > 20 && '\n'}{selectedCategory.value.toFixed(2)} {CURRENCY_SYMBOL}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                    <CategoryItemList
                        style={styles.categoryList}
                        bookings={context.transactions.filter(t => t.categoryId === selectedCategory.id && t.date <= date)}
                        categories={childCategories}
                        showBooking={(id) => router.navigate(`${selectedCategory.id}/booking/${id}`)}
                        showCategory={(id) => setSelectedCategory(context.categories.find((category) => category.id === id))}
                        showBookings={selectedCategory.id !== null}
                    />
                </View>
            </View >
            {/* <View style={styles.transBar}>
                {selectedCategory.id !== null && <TouchableOpacity
                    style={[styles.transButton, { borderColor: '#00FF00', backgroundColor: '#00FF00' }]}
                    onPress={() => {
                        router.navigate(`${selectedCategory.id}/booking/create?isPositive=true`);
                    }}
                >
                    <Text style={{ color: 'white' }}>+</Text>
                </TouchableOpacity>}
                {selectedCategory.id !== null && <TouchableOpacity
                    style={[styles.transButton, { borderColor: '#FF0000', backgroundColor: '#FF0000' }]}
                    onPress={() => {
                        router.navigate(`${selectedCategory.id}/booking/create?isPositive=false`);
                    }}
                >
                    <Text style={{ color: 'white' }}>-</Text>
                </TouchableOpacity>}
            </View> */}
        </PaperProvider>

    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
        color: theme.colors.primary_text,
        paddingHorizontal: 15,
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginLeft: 0,
        minHeight: 48, // add this line for consistent height
        // gap: 10,
    },
    toolbar_button: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    toolbar_button_text: {
        color: theme.colors.primary_text,
        fontSize: FONT_SIZE_SMALL,
        fontWeight: 'bold',
    },
    dateInput: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    header_inner: {
        fontSize: FONT_SIZE_LARGE,
        flex: 1,

    },
    header_title: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 5
    },
    header_title_text: {
        color: theme.colors.primary_text,
        fontSize: FONT_SIZE_LARGE,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    header_value: {
        fontSize: FONT_SIZE_XLARGE,
        fontWeight: 'bold',
    },
    header_route: {
        color: theme.colors.secondary_text,
        fontSize: FONT_SIZE_SMALL,
        marginBottom: 5,
    },
    categoryList: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginTop: 10,
        paddingVertical: 10,
    },



    // header: {
    //     width: '100%',
    //     alignItems: 'center',
    //     justifyContent: 'space-around',
    //     flexDirection: 'row',
    //     borderBottomWidth: 1,
    //     borderColor: 'grey',
    // },
    // topBar: {
    //     width: '100%',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     paddingHorizontal: 5,
    //     paddingVertical: 5,
    // },
    // dateBar: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     width: '65%'
    // },
    // dateInput: {
    //     flex: 1
    // },
    // topBarDateIcons: {
    //     alignItems: 'center',
    //     justifyContent: 'space-evenly',
    //     flexDirection: 'row',
    //     paddingHorizontal: 5
    // },
    // headerCat: {
    //     width: '100%',
    //     flexDirection: 'row',
    //     alignItems: 'flex-end',
    //     justifyContent: 'space-between',
    //     paddingVertical: 2,
    //     paddingHorizontal: 5,
    // },
    // transBar: {
    //     flexDirection: 'row',
    //     width: '100%',
    // },
    // transButton: {
    //     borderWidth: 1,
    //     borderColor: 'red',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     padding: 10,
    //     margin: 10,
    //     flex: 1,
    // },
});

export default CategoryScreen;