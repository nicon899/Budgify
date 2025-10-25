import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useContext } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { finContext } from '../contexts/FinContext';

const Settings = () => {
    const { restoreBackup } = useContext(finContext).actions

    const restore = async () => {
        const file = await DocumentPicker.getDocumentAsync();
        await restoreBackup(file.uri);
        ToastAndroid.show('Restore complete!', ToastAndroid.SHORT);
    }

    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Settings</Text>
            <TouchableOpacity style={styles.button}
                onPress={async () => {
                    await Sharing.shareAsync(
                        FileSystem.documentDirectory + 'SQLite/budgifyDB.db',
                        { dialogTitle: 'share or copy your DB via' }
                    ).catch(error => {
                        console.log(error);
                    })
                }}
            >
                <Text style={styles.buttonText}>Share Backup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={restore}>
                <Text style={styles.buttonText}>Restore Backup</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0000',
        width: '100%'
    },
    heading: {
        color: 'white',
        fontSize: 30,
        margin: 25,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
    }
})
