import { StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useContext } from 'react';
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

            <TouchableOpacity style={styles.button}
                onPress={async () => {
                    await Sharing.shareAsync(
                        FileSystem.documentDirectory + 'SQLite/finDatabase.db',
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
        backgroundColor: '#000099',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    button: {
        borderWidth: 1,
        borderColor: 'white',
        padding: 25,
        margin: 25,
        width: '100%',
    },
    buttonText: {
        color: 'white',
    }
})
