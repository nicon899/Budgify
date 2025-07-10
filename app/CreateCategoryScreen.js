import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { finContext } from '../contexts/FinContext';

const CreateCategoryScreen = props => {
    const [name, setName] = useState('');
    const context = useContext(finContext);

    return (
        <View style={styles.screen}>
            <Text style={{ color: 'white', marginBottom: 10, fontWeight: 'bold', fontSize: 32 }}>Create Category</Text>
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
            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: 'red' }]}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: 'green' }]}
                    onPress={() => {
                        const category = {
                            name: name,
                            index: props.route.params.index,
                            parentId: props.route.params.categoryId
                        }
                        context.actions.addCategory(category);
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'green' }}>ADD</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    input: {
        width: '80%',
        marginBottom: 20,
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white'
    },
    actionButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 25,
        paddingVertical: 10,
    }
});

export default CreateCategoryScreen;
