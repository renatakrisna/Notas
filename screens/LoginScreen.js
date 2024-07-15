// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth()


    const handleLogin = async () => {
        try {
            const user = signInWithEmailAndPassword(auth, email, password).then(() => {
                navigation.navigate('Notes');
            }).catch((err)=> {
                alert(err)
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register')
    }
    

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", justifyContent: "center" , marginBottom: 50}}>
                <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>
                    Bem-vindo, faça seu Login!
                </Text>
            </View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button 
            title="Login" 
            onPress={handleLogin}
            style={styles.button}
            color="#FF8096"/>
            <Text></Text>
            <Button 
            title="Registrar" 
            onPress={handleRegister}
            style={styles.button}
            color="#FF8096"/>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
    },
    button:{
        borderWidth: 1,
        marginBottom: 20,
        color: '#FFC0CB',
   
    }
});

export default LoginScreen;
