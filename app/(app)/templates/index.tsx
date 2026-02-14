import theme from '@/app/theme';
import { useApi } from '@/hooks/useApi';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TemplateScreen = () => {
    const [templates, setTemplates] = useState([])
    const { getTemplates } = useApi()
    const router = useRouter();
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            const fetchedTemplates = await getTemplates();
            setTemplates(fetchedTemplates);
        })()
    }, [isFocused]);

    return (
        <View style={styles.screen}>
            <FlatList
                style={styles.templateList}
                data={templates}
                keyExtractor={item => `${item.id}`}
                renderItem={itemData => {
                    return (<TouchableOpacity style={styles.templateItem} onPress={() => {
                        router.navigate(`/templates/${itemData.item.id}`);
                    }}>
                        <Text style={{ fontSize: 18, color: 'white' }}>{itemData.item.name}</Text>
                        <Text style={{ fontSize: 18, color: 'white' }}>{itemData.item.value}</Text>
                    </TouchableOpacity>
                    );
                }}
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.createTempButton}
                    onPress={() => {
                        router.navigate(`/templates/create`);
                    }}
                >
                    <MaterialIcons style={styles.createTempButtonText} name="library-add" size={32} color="#00FF00" />

                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
        color: theme.colors.primary_text,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    templateList: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginTop: 10,
        paddingVertical: 10,
        marginBottom: 20,
    },

    templateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        color: theme.colors.primary_text,
        backgroundColor: theme.colors.backgroundTertiary,
        marginBottom: 5,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    bottomBar: {
        marginBottom: 30,
        marginHorizontal: 30,
        alignItems: 'flex-end',
        // position: 'absolute',
        // bottom: 30, // Abstand vom unteren Bildschirmrand
        // right: 30,  // Abstand vom rechten Rand
    },
    createTempButton: {
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
    createTempButtonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 32,
    },





});

export default TemplateScreen;