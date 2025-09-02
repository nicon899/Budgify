import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { finContext } from '../contexts/FinContext';

const TemplateScreen = () => {
    const { templates } = useContext(finContext);
    const { fetchTemplates } = useContext(finContext).actions
    const router = useRouter();

    useEffect(() => {
        fetchTemplates();
    }, []);



    const scaleFontSize = (fontSize: number) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    return (
        <View style={styles.screen}>
            <Text style={{ color: 'white', fontSize: scaleFontSize(32), width: '100%', textAlign: 'center' }}>Templates</Text>
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
                <Text style={{ color: '#45FF44', fontSize: scaleFontSize(20) }}>Create Template </Text>
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