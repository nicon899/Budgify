import CategoryItemList from '@/components/CategoryItemList';
import CustomDatePicker from '@/components/CustomDatePicker';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/types/Category';
import { Transaction } from '@/types/Transaction';
import { FontAwesome6 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton, Menu, PaperProvider } from 'react-native-paper';
import theme, { CURRENCY_SYMBOL, FONT_SIZE_LARGE, FONT_SIZE_SMALL, FONT_SIZE_XLARGE } from "../../../theme";

const CategoryScreen = () => {
    const { categoryId: categoryIdParamStr } = useLocalSearchParams();
    const categoryIdParam = categoryIdParamStr ? parseInt(categoryIdParamStr as string, 10) : null;
    const [category, setCategory] = useState<Category | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [date, _setDate] = useState<Date>(new Date());
    const { getFirstLevelCategories, getCategoryById, getLatestDate, getTransactionsOfCategory } = useApi();
    const isFocused = useIsFocused();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const setLatestDate = async () => {
        const latestDate = await getLatestDate()
        setDate(latestDate, true);
    }

    const updateData = async (newDate: Date | null) => {
        const category = categoryIdParam ? await getCategoryById(categoryIdParam, newDate?.toISOString()) : await getFirstLevelCategories(newDate?.toISOString())
        setCategory(category)
        if (categoryIdParam) {
            const fetchedTransactions = await getTransactionsOfCategory(categoryIdParam, newDate?.toISOString())
            setTransactions(fetchedTransactions);
        }
        if (!newDate) {
            setDate(new Date(category.latestDate))
        }
    }

    const setDate = (newDate: Date, setByUser: boolean = false) => {
        _setDate(newDate);
        if (setByUser) {
            updateData(newDate);
        }
    }

    const openCategory = (id: number) => {
        if (id == null) return
        router.navigate(`/category/${id}`);
    }

    useEffect(() => {
        updateData(null);
    }, [categoryIdParam, isFocused])

    if (!category) {
        return <></>;
    }

    return (<PaperProvider>
        <View style={styles.screen}>
            <View style={styles.toolbar}>
                <CustomDatePicker
                    style={{}}
                    style_btn={styles.toolbar_button}
                    date={date}
                    setDate={(date: Date) => setDate(date, true)}
                    setTime={false}
                    showArrow={false}
                    text={'Custom'}
                />
                <TouchableOpacity
                    style={styles.toolbar_button}
                    onPress={() => setDate(new Date(), true)}
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
                    <Text style={styles.header_route}>{category.pathLabel}</Text>
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
                    bookings={transactions}
                    categories={category.children ? category.children : []}
                    showBooking={(id: number) => router.navigate(`category/${category.id}/transaction/${id}/edit`)}
                    showCategory={(id: number) => openCategory(id)}
                    showBookings={category.id !== null}
                />
            </View>
        </View >

        <View style={styles.transBar}>
            {category.id !== null && (
                <TouchableOpacity
                    style={styles.transButton}
                    onPress={() => {
                        router.navigate(`category/${category.id}/transaction/create?isPositive=false`);
                    }}
                >
                    <Text style={styles.transButtonText}>€</Text>
                </TouchableOpacity>
            )}
        </View>
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
    transBar: {
        position: 'absolute',
        bottom: 30, // Abstand vom unteren Bildschirmrand
        right: 30,  // Abstand vom rechten Rand
    },
    transButton: {
        width: 60,
        height: 60,
        borderRadius: 30, // Hälfte der Breite/Höhe für einen Kreis
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // für Android Schatten
        shadowColor: '#000', // für iOS Schatten
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    transButtonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 32,
    },

});

export default CategoryScreen;