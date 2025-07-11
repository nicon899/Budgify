import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import CategoryPicker from '../../components/CategoryPicker';
import { finContext } from '../../contexts/FinContext';

const EditCategory = () => {
    const { categoryId: categoryIdParam } = useLocalSearchParams();
    const categoryId = categoryIdParam === 'null' ? null : parseInt(categoryIdParam);
    const { categories, transactions, actions } = useContext(finContext);
    const [childCategories, setChildCategories] = useState([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [name, setName] = useState('');
    const { updateCategory, deleteCategory } = useContext(finContext).actions
    const [categoryParentId, setCategoryParentId] = useState();
    const router = useRouter();

    useEffect(() => {
        const categoryToUpdate = categories.find(c => c.id === categoryId);
        if (!categoryToUpdate) return;
        setChildCategories(categories.filter((category) => category.id !== null && category.parentId === categoryId).sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0));
        setCategoryParentId(categoryToUpdate.parentId)
        setName(categoryToUpdate.name);
    }, [categories]);

    const updateIndexes = async () => {
        let index = 0;
        childCategories.forEach(cat => {
            cat.index = index;
            index++;
        });
        childCategories.forEach(async (cat) => {
            await updateCategory(cat);
        })
    };

    const update = async () => {
        const updatedCategory = categories.find(c => c.id === categoryId);
        updatedCategory.name = name;
        updatedCategory.parentId = categoryParentId;
        await updateCategory(updatedCategory);
    };

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    return (
        <View style={styles.screen}>
            <View style={{ width: '100%', height: '90%' }}>
                {categoryId !== null && <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.nameInputContainer}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor="white"
                            style={styles.input}
                            blurOnSubmit
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={name}
                            onChangeText={(input) => { setName(input) }}
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
                                            await deleteCategory(categoryId)
                                            router.replace(`?categoryId=${categoryParentId}`);
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
                    height: categoryId === null ? '100%' : '90%',
                }}>
                    <View style={styles.bookingsheader}>
                        <Text style={{ color: 'white', fontSize: scaleFontSize(32), fontWeight: 'bold' }}>Categories:</Text>
                        <TouchableOpacity
                            onPress={() => {
                                router.navigate(`/category/${categoryId}/create?index=${childCategories.length}`);
                            }}
                        >
                            <MaterialIcons style={{ marginRight: '10%' }} name="library-add" size={28} color="#00FF00" />
                        </TouchableOpacity>
                    </View>

                    {categoryId !== -1 && <CategoryPicker categoryId={categoryParentId} setCategoryId={setCategoryParentId} noFilter={true} />}
                    <View style={{ flex: 1, width: '100%' }}>
                        <DraggableFlatList
                            data={childCategories}
                            style={{ backgroundColor: '#202020', marginHorizontal: 25, borderRadius: 10, padding: 5 }}
                            onDragBegin={() => setIsOrderChanged(true)}
                            keyExtractor={(item, index) => `${item.id}`}
                            renderItem={({ item, index, drag, isActive }) =>
                            (<TouchableOpacity
                                style={{
                                    backgroundColor: isActive ? "#0000FF80" : '#303030',
                                    marginHorizontal: 10,
                                    marginVertical: 3,
                                    padding: 5,
                                    justifyContent: "center",
                                    borderRadius: 5,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }}
                                onLongPress={drag}
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
                            onDragEnd={(data) => setChildCategories(data.data)}
                        />
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
