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
                    return (<TouchableOpacity style={{ padding: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, marginVertical: 10 }} onPress={() => router.navigate(`/templates/${itemData.item.id}`)}>
                        <Text style={{ fontSize: 18, color: 'white' }}>{itemData.item.name}</Text>
                        <Text style={{ fontSize: 18, color: 'white' }}>{itemData.item.value}</Text>
                    </TouchableOpacity>
                    );
                }}
            />
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 10, width: '100%' }}
                onPress={() => {
                    router.navigate(`/templates/create`);
                }}
            >
                <Text style={{ color: '#45FF44', fontSize: theme.fontSize.regular }}>Create Template </Text>
                <MaterialIcons style={{}} name="library-add" size={32} color="#00FF00" />
            </TouchableOpacity>
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

export default TemplateScreen;