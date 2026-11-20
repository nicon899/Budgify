import theme from '@/app/theme';
import { useApi } from '@/hooks/useApi';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CategoryPicker = (props) => {
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getPossibleParents, getAllCategories } = useApi();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            let selectableCategories = [];
            if (props.includeTotal) {
                selectableCategories.push({
                    id: null,
                    path: '*Total*',
                });
            }

            if (props.filterChildCategories != null) {
                const fetchedCategories = await getPossibleParents(props.filterChildCategories);
                if (Array.isArray(fetchedCategories)) {
                    selectableCategories.push(...fetchedCategories);
                }
            } else {
                const fetchedCategories = await getAllCategories(true);
                if (Array.isArray(fetchedCategories)) {
                    selectableCategories.push(...fetchedCategories);
                }
            }

            if (!isMounted) return;

            if (props.categoryId == null && selectableCategories.length > 0) {
                props.setCategoryId(selectableCategories[0].id);
            }

            selectableCategories.sort((a, b) => {
                if (a.path < b.path) return -1;
                if (a.path > b.path) return 1;
                return 0;
            });

            setCategories(selectableCategories);
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const selectedCategory = useMemo(() => {
        if (props.categoryId == null && props.includeTotal) {
            return categories.find((c) => c.id === null) ?? { id: null, path: '*Total*' };
        }
        return categories.find((c) => c.id === props.categoryId);
    }, [categories, props.categoryId, props.includeTotal]);

    const filteredCategories = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((c) => c.path?.toLowerCase().includes(q));
    }, [categories, searchQuery]);

    const handleSelect = (category) => {
        props.setCategoryId(category.id);
        setModalVisible(false);
        setSearchQuery('');
    };

    const handleClose = () => {
        setModalVisible(false);
        setSearchQuery('');
    };

    return (
        <View style={[styles.container, props.style]}>
            <TouchableOpacity
                style={styles.trigger}
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
                disabled={categories.length === 0}
            >
                <Text
                    style={[
                        styles.triggerText,
                        !selectedCategory && styles.placeholderText,
                    ]}
                    numberOfLines={1}
                >
                    {selectedCategory ? selectedCategory.path : 'Loading categories...'}
                </Text>
                <MaterialCommunityIcons
                    name="chevron-down"
                    size={22}
                    color={theme.colors.secondary_text}
                />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                statusBarTranslucent
                animationType="fade"
                onRequestClose={handleClose}
            >
                <View style={styles.backdrop}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.modalWrapper}
                        pointerEvents="box-none"
                    >
                        <View style={styles.modalCard}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Category</Text>
                                <TouchableOpacity onPress={handleClose} hitSlop={8}>
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={22}
                                        color={theme.colors.secondary_text}
                                    />
                                </TouchableOpacity>
                            </View>

                            {categories.length > 6 && (
                                <View style={styles.searchContainer}>
                                    <MaterialCommunityIcons
                                        name="magnify"
                                        size={18}
                                        color={theme.colors.secondary_text}
                                        style={styles.searchIcon}
                                    />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search categories..."
                                        placeholderTextColor={theme.colors.secondary_text}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {searchQuery.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={6}>
                                            <MaterialCommunityIcons
                                                name="close-circle"
                                                size={16}
                                                color={theme.colors.secondary_text}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            <FlatList
                                data={filteredCategories}
                                keyExtractor={(item) => (item.id === null ? '__total__' : String(item.id))}
                                style={styles.list}
                                keyboardShouldPersistTaps="handled"
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>No categories found</Text>
                                }
                                renderItem={({ item }) => {
                                    const isSelected =
                                        (item.id === null && props.categoryId == null && props.includeTotal) ||
                                        item.id === props.categoryId;

                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.optionItem,
                                                isSelected && styles.optionItemSelected,
                                            ]}
                                            activeOpacity={0.7}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    isSelected && styles.optionTextSelected,
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {item.path}
                                            </Text>
                                            {isSelected && (
                                                <MaterialCommunityIcons
                                                    name="check"
                                                    size={20}
                                                    color={theme.colors.accent}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
};

export default CategoryPicker;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 10,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 46,
    },
    triggerText: {
        flex: 1,
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.regular,
        marginRight: 8,
    },
    placeholderText: {
        color: theme.colors.secondary_text,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalWrapper: {
        width: '100%',
        maxWidth: 420,
        maxHeight: '70%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCard: {
        width: '100%',
        maxHeight: '100%',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#343842',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#2E323B',
    },
    modalTitle: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.regular,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundTertiary,
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2E323B',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.primary_text,
        fontSize: 15,
        paddingVertical: 8,
    },
    list: {
        paddingVertical: 6,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 8,
        marginVertical: 2,
        borderRadius: 8,
    },
    optionItemSelected: {
        backgroundColor: 'rgba(33, 150, 243, 0.16)',
    },
    optionText: {
        flex: 1,
        color: theme.colors.primary_text,
        fontSize: 16,
        marginRight: 8,
    },
    optionTextSelected: {
        color: theme.colors.accent,
        fontWeight: '600',
    },
    emptyText: {
        color: theme.colors.secondary_text,
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 15,
    },
});
