import CategoryItemList from '@/components/CategoryItemList';
import CustomDatePicker from '@/components/CustomDatePicker';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/types/Category';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton, Menu, PaperProvider } from 'react-native-paper';
import theme, { CURRENCY_SYMBOL, FONT_SIZE_LARGE, FONT_SIZE_SMALL, FONT_SIZE_XLARGE } from "../../../theme";

const CategoryScreen = () => {
    const { categoryId: categoryIdParamStr } = useLocalSearchParams();
    const categoryIdParam = categoryIdParamStr ? parseInt(categoryIdParamStr as string, 10) : null;
    const [category, setCategory] = useState<Category | null>(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [didUserSetDate, setDidUserSetDate] = useState<boolean>(false);
    const { getFirstLevelCategories, getCategoryById } = useApi();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const setLatestDate = () => {
        // TODO
    }

    const openCategory = (id: number) => {
        console.log(id)
        if(id == null) return
        router.replace(`/category/${id}`);
    }

    useEffect(() => {
        (async () => {
            if (categoryIdParam) {
                const category = await getCategoryById(categoryIdParam);
                setCategory(category);
                return;
            }
            const category = await getFirstLevelCategories();
            console.log('First level categories:', category);
            setCategory(category);
        })();
    }, [categoryIdParam])

    if (!category) {
        return <></>;
    }

    return (<PaperProvider>
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
                    disabled={category.id == null}
                    onPress={() => {
                        router.navigate(`/category/${category.id}/edit`);
                    }}
                >
                    <Text style={styles.header_route}>Test/Test/Test</Text>
                    <View style={styles.header_title}>
                        <FontAwesome6 name="sack-dollar" size={FONT_SIZE_LARGE} color={category.total > 0 ? theme.colors.positive_text : theme.colors.negative_text} />
                        <Text style={styles.header_title_text}>{category.name}</Text>
                    </View>
                    <Text numberOfLines={1} style={[styles.header_value, { color: category.total > 0 ? theme.colors.positive_text : theme.colors.negative_text }]}>{(category.name + category.total).length > 20 && '\n'}{category.total.toFixed(2)} {CURRENCY_SYMBOL}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <CategoryItemList
                    style={styles.categoryList}
                    bookings={category.transactions ? category.transactions : []}
                    categories={category.children ? category.children : []}
                    showBooking={(id: number) => router.navigate(`${category.id}/booking/${id}`)}
                    showCategory={(id: number) => openCategory(id)}
                    showBookings={category.id !== null}
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
    </PaperProvider>);
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
});

export default CategoryScreen;