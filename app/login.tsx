import { authContext } from '@/contexts/AuthContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'expo-checkbox';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storageService } from '../util/StorageService';
import theme from './theme';

const Login = () => {
    const [name, setName] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isChecked, setChecked] = useState(false);
    const [savedLogins, setSavedLogins] = useState<string[]>([]);
    const [hidePwd, setHidePwd] = useState(true);

    useEffect(() => {
        const fetchSavedLogins = async () => {
            const storedLogins = await storageService.getItem('stored-logins');
            setSavedLogins(storedLogins ? Object.keys(JSON.parse(storedLogins)) : []);
        };
        fetchSavedLogins();
    }, []);


    const { login } = useContext(authContext).actions;

    const handleLogin = async (loginName: string, loginPwd: string) => {
        console.log('Attempting login with:', loginName, loginPwd);
        const result = await login({ name: loginName, password: loginPwd });
        if (!result) {
            return setErrorMessage('Invalid email or password');
        }
        setErrorMessage('');
        if (isChecked) {
            await storageService.setItem('user-login-options', JSON.stringify({ name: loginName, password: loginPwd }));
            const storedLogins = await storageService.getItem('stored-logins');
            const logins = storedLogins ? JSON.parse(storedLogins) : {};
            logins[loginName] = loginPwd;
            await storageService.setItem('stored-logins', JSON.stringify(logins));
        }
    };

    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, paddingVertical: 10 }}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ width: '80%', marginBottom: 20, borderBottomWidth: 1, borderColor: theme.colors.divider, paddingBottom: 10 }}>
                <Text style={styles.label}>Saved Logins</Text>
                {savedLogins.length > 0 ? savedLogins.map((loginName) => (
                    <TouchableOpacity key={loginName} onPress={() => {
                        setName(loginName);
                        storageService.getItem('stored-logins').then((storedLogins) => {
                            const logins = storedLogins ? JSON.parse(storedLogins) : {};
                            setPwd(logins[loginName] || '');
                            handleLogin(loginName, logins[loginName] || '');
                        }
                        );
                    }} style={styles.storedLoginItem}>
                        <Text style={{ color: theme.colors.primary_text }}>{loginName}</Text>
                    </TouchableOpacity>
                )) : <Text style={{ color: theme.colors.primary_text, fontStyle: 'italic' }}>No saved logins</Text>}

            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
                placeholder='Name'
                placeholderTextColor="white"
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />

            <View style={{ width: '80%', marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => setHidePwd(!hidePwd)} style={{  }}>
                    {hidePwd && <MaterialCommunityIcons name="eye" size={24} color={theme.colors.primary_text} />}
                    {!hidePwd && <MaterialCommunityIcons name="eye-off" size={24} color={theme.colors.primary_text} />}
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder='Password'
                placeholderTextColor="white"
                style={styles.input}
                secureTextEntry={hidePwd}
                value={pwd}
                onChangeText={(input) => setPwd(input)}
            />

            {errorMessage ? <Text style={{ color: theme.colors.negative_text, alignSelf: 'flex-start', marginLeft: '10%', marginBottom: 10 }}>{errorMessage}</Text> : null}


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '80%' }}>
                <Text style={styles.inlineLabel}>Remember login</Text>
                <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
            </View>
        </View>


        <TouchableOpacity onPress={() => handleLogin(name, pwd)} style={{ alignSelf: 'center', justifyContent: 'center', marginBottom: 25 }}>
            <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>


    </SafeAreaView>);
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    label: {
        color: theme.colors.primary_text,
        marginBottom: 10,
        // fontWeight: 'bold',
        fontSize: theme.fontSize.large,
        width: '80%',
    },
    inlineLabel: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.regular,
    },
    input: {
        width: '80%',
        marginBottom: 20,
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
        borderRadius: 5,
    },
    loginButton: {
        color: theme.colors.blue_text,
        fontSize: theme.fontSize.xlarge,
    },
    checkbox: {
        margin: 8,
    },
    storedLoginItem: {
        padding: 5,
        borderColor: theme.colors.divider,
        borderWidth: 1,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 5,
        marginBottom: 5,
    }
});

export default Login;