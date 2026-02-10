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
                data={templates}
                keyExtractor={item => `${item.id}`}
                renderItem={itemData => {
                    return (<TouchableOpacity style={styles.templateItem}>
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
    templateItem: {
    },
    bottomBar: {
        position: 'absolute',
        bottom: 30, // Abstand vom unteren Bildschirmrand
        right: 30,  // Abstand vom rechten Rand
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