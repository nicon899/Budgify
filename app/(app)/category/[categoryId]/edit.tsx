import theme from '@/app/theme';
import alert from '@/components/alert';
import CategoryPicker from '@/components/CategoryPicker';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/types/Category';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DragList from 'react-native-draglist';

const EditCategory = () => {
    const { categoryId: categoryIdParamStr } = useLocalSearchParams();
    const categoryIdParam = categoryIdParamStr ? parseInt(categoryIdParamStr as string, 10) : null;
    const [category, setCategory] = useState<Category | null>(null);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const { updateCategory, deleteCategory } = useApi();
    const router = useRouter();
    const { getCategoryById, getFirstLevelCategories } = useApi()
    const isFocused = useIsFocused();


    useEffect(() => {
        if (!categoryIdParam && categoryIdParamStr !== 'total') return;
        updateData(categoryIdParamStr === "total" ? "total" : categoryIdParam!);
    }, [categoryIdParam, categoryIdParamStr, isFocused]);

    const updateData = async (id: number | "total") => {
        const loadedCategory = (id === 'total') ? await getFirstLevelCategories(new Date().toISOString()) : await getCategoryById(id);
        console.log(loadedCategory);
        if (!loadedCategory) return;
        setCategory(loadedCategory)
    }

    // TODO: Update Indexes when changing subcategory order
    const updateIndexes = async () => {
        let index = 0;
        if (!category?.children) return;
        category.children.forEach(cat => {
            cat.listIndex = index;
            index++;
        });
        category.children.forEach(async (cat) => {
            await updateCategory(cat);
        })
    };

    const update = async () => {
        if (!category) return;
        await updateCategory(category);
        updateData(category.id);
    };

    const onReordered = async (fromIndex: number, toIndex: number) => {
        if (!category?.children) return;
        const copy = [...category.children];
        const removed = copy.splice(fromIndex, 1);
        copy.splice(toIndex, 0, removed[0]);
        setCategory({ ...category, children: copy })
    }

    if (!category) {
        return <></>;
    }

    if (category.id === null && categoryIdParamStr !== 'total') {
        return <></>;
    }

    return (
        <View style={styles.screen}>

            {category.id !== null && <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => {
                        alert(
                            'Delete Category',
                            'Are you sure you want to delete this category with all its Bookings and child categories?',
                            [
                                { text: 'Cancel', style: 'cancel', onPress: () => { } },
                                {
                                    text: 'OK', onPress: async () => {
                                        await deleteCategory(category.id)
                                        if (category.parentId) {
                                            console.log("Navigating to parent category:", category.parentId);
                                            return router.replace(`category/${category.parentId}`);
                                        }
                                        else {
                                            console.log("Navigating to root category view");
                                            router.dismissAll();
                                            router.replace('/');
                                        }
                                    }
                                },
                            ],
                            { cancelable: true }
                        )
                    }}
                >
                    <MaterialCommunityIcons style={{ margin: 8 }} name="delete" size={32} color={theme.colors.negative_text} />
                </TouchableOpacity>
            </View>
            }

            {category.id !== null && category.id !== 'total' && < View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.label}>Category</Text>
                <CategoryPicker categoryId={category.parentId} style={{ width: '80%' }}
                    setCategoryId={(input: number) => { setCategory({ ...category, parentId: input }) }}
                    filterChildCategories={category.id} includeTotal={true} /> </View>
            }

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={category.name}
                onChangeText={(input) => setCategory({ ...category, name: input })}
            />

            {category.children && <Text style={styles.label}>Sub-Categories</Text>}
            {category.children && <View style={styles.listContainer}><DragList
                data={category.children}
                style={styles.dragList}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={({ item, onDragStart, onDragEnd, isActive }) =>
                (<TouchableOpacity
                    style={{

                    }}
                    onPressIn={() => { onDragStart(); setIsOrderChanged(true); }}
                    onPressOut={onDragEnd}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons style={{ marginRight: 5 }} name="drag" size={theme.fontSize.large} color={theme.colors.divider} />
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: "white",
                                fontSize: theme.fontSize.regular,
                                borderRadius: 5,
                                borderColor: theme.colors.divider,
                                borderWidth: 1,
                                backgroundColor: isActive ? theme.colors.accent : theme.colors.backgroundTertiary,
                                marginVertical: 3,
                                padding: 5,
                                justifyContent: "center",
                                flex: 1,
                            }}
                        >
                            {item.name}
                        </Text>
                    </View>

                </TouchableOpacity>)
                }
                onReordered={onReordered}
            /></View>}


            <TouchableOpacity
                onPress={() => {
                    router.navigate(`/category/create?parentId=${category.id}&listIndex=${category.children.length}`);
                }}
            >
                <Text style={styles.addCategoryButton}>+ Add Category</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, { borderColor: 'green' }]}
                onPress={async () => {
                    await update();
                    if (isOrderChanged) {
                        await updateIndexes();
                    }
                    router.dismiss();
                }}
            >
                <Text style={styles.actionButtonText}>Save Category</Text>
            </TouchableOpacity>










        </View >
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: theme.colors.background,
        maxHeight: '100%',
        paddingBottom: 25,
    },
    input: {
        width: '80%',
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.primary_text,
        borderRadius: 10,
        padding: 10,
        // maxWidth: 500,
    },
    label: {
        color: theme.colors.secondary_text,
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 5,
        marginTop: 15,
    },
    actionButton: {
        marginTop: 25,
        width: '80%',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: theme.colors.accent,
        color: theme.colors.primary_text,
    },
    actionButtonText: {
        color: theme.colors.dark_text,
        fontSize: theme.fontSize.regular,
    },
    addCategoryButton: {
        marginTop: 20,
        color: theme.colors.accent,
        fontSize: theme.fontSize.regular,
    },
    dragList: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
        paddingVertical: 5,
        paddingRight: 10,
        paddingLeft: 5,
        marginTop: 10,
        width: 500,
        maxWidth: '80%',
    },
    // This wrapper allows the list to grow and fill space
    listContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },

    nameInputContainer: {
        width: '80%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookingsheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    },
});

export default EditCategory;
