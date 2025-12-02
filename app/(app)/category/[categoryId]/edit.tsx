import CategoryPicker from '@/components/CategoryPicker';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/types/Category';
import { scaleFontSize } from '@/util/util';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

    return (
        <View style={styles.screen}>
            <View style={{ width: '100%', height: '90%' }}>
                {category.id !== null && <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.nameInputContainer}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor="white"
                            style={styles.input}
                            blurOnSubmit
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={category.name}
                            onChangeText={(input) => { setCategory({ ...category, name: input }) }}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Delete Category',
                                'Are you sure you want to delete this category with all its Bookings and child categories?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'OK', onPress: async () => {
                                            await deleteCategory(category.id)
                                            if (category.parentId) {
                                                return router.replace(`?categoryId=${parentId}`);
                                            }
                                        }
                                    },
                                ],
                                { cancelable: true }
                            )
                        }}
                    >
                        <MaterialCommunityIcons style={{ margin: 8 }} name="delete" size={32} color="red" />
                    </TouchableOpacity>
                </View>
                }
                <View style={{
                    width: '100%',
                    height: category.id === null ? '100%' : '90%',
                }}>
                    <View style={styles.bookingsheader}>
                        <Text style={{ color: 'white', fontSize: scaleFontSize(32), fontWeight: 'bold' }}>Categories:</Text>
                        <TouchableOpacity
                            onPress={() => {
                                router.navigate(`/category/create?parentId=${category.id}&listIndex=${category.children.length}`);
                            }}
                        >
                            <MaterialIcons style={{ marginRight: '10%' }} name="library-add" size={28} color="#00FF00" />
                        </TouchableOpacity>
                    </View>

                    {category.id !== null && category.id !== 'total' &&
                        <CategoryPicker categoryId={category.parentId} setCategoryId={(input: number) => { setCategory({ ...category, parentId: input }) }} filterChildCategories={category.id} />
                    }
                    <View style={{ flex: 1, width: '100%' }}>
                        {category.children && <DragList
                            data={category.children}
                            style={{ backgroundColor: '#202020', marginHorizontal: 25, borderRadius: 10, padding: 5 }}
                            keyExtractor={(item, index) => `${item.id}`}
                            renderItem={({ item, onDragStart, onDragEnd, isActive }) =>
                            (<TouchableOpacity
                                style={{
                                    backgroundColor: isActive ? "#606060" : '#303030',
                                    marginHorizontal: 10,
                                    marginVertical: 3,
                                    padding: 5,
                                    justifyContent: "center",
                                    borderRadius: 5,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }}
                                onPressIn={() => { onDragStart(); setIsOrderChanged(true); }}
                                onPressOut={onDragEnd}
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: "white",
                                        fontSize: 18
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>)
                            }
                            onReordered={onReordered}
                        />}
                    </View>
                </View>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: 'red' }]}
                    onPress={() => {
                        router.dismiss();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
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
                    <Text style={{ color: 'green' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
    },
    nameInputContainer: {
        width: '80%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginVertical: 5,
        padding: 3,
        borderColor: 'grey',
        borderBottomWidth: 1,
        color: 'white'
    },
    bookingsheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    actionButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 25,
        paddingVertical: 10,
    }
});

export default EditCategory;
