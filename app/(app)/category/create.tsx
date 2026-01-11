import theme from '@/app/theme';
import CategoryPicker from '@/components/CategoryPicker';
import { useApi } from '@/hooks/useApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CreateCategoryScreen = () => {
    const { parentId: parentIdParamStr, listIndex: listIndexParamStr } = useLocalSearchParams();
    const listIndex = listIndexParamStr != null ? Number(listIndexParamStr) : 999999999
    const [name, setName] = useState('');
    const router = useRouter();
    const [categoryParentId, setCategoryParentId] = useState<number | null>(parentIdParamStr != null ? Number(parentIdParamStr) : null);
    const { createCategory } = useApi()


    return (
        <View style={styles.screen}>

            <Text style={styles.label}>Category</Text>
            <CategoryPicker style={{ width: '80%' }} categoryId={categoryParentId} setCategoryId={(input: number) => { setCategoryParentId(input) }} filterChildCategories={null} includeTotal={true} />

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />

            <TouchableOpacity
                style={[styles.actionButton, { borderColor: 'green' }]}
                onPress={async () => {
                    const category = {
                        name: name,
                        listIndex: listIndex,
                        parentId: categoryParentId
                    }
                    await createCategory(category);
                    router.dismiss();
                }}
            >
                <Text style={styles.actionButtonText}>Save Category</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
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
});

export default CreateCategoryScreen;
