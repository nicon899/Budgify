import { authContext } from '@/contexts/AuthContext';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import theme from './theme';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { login } = useContext(authContext).actions;

    const handleLogin = async () => {
        const result = await login({ email: email, password: pwd });
        if (!result) {
            setErrorMessage('Invalid email or password');
        }
    };


    return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
            placeholder='Email'
            placeholderTextColor="white"
            style={styles.input}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(input) => setEmail(input)}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
            placeholder='Password'
            placeholderTextColor="white"
            style={styles.input}
            secureTextEntry
            value={pwd}
            onChangeText={(input) => setPwd(input)}
        />

        <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>

        {errorMessage ? <Text style={{ color: theme.colors.negative_text, marginTop: 10 }}>{errorMessage}</Text> : null}
    </View>);
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
    }
});

export default Login;