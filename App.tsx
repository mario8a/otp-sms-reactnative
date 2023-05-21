import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onPasswordChange = (e: string) => {
    setPassword(e);
  };

  const onEmailChange = (e: string) => {
    setEmail(e);
  };

  const submit = () => {
    if (email === '' || password === '') {
      setError('Llene los campos');
      return;
    }
  };

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
          <Text style={styles.sectionTitle}>TacoLive</Text>
          <TextInput
            keyboardType="email-address"
            style={styles.inputStype}
            value={email}
            placeholder="Correo electronico"
            onChangeText={onEmailChange}
          />
          <TextInput
            secureTextEntry={true}
            value={password}
            style={{...styles.inputStype, marginTop: 10}}
            placeholder="Contraseña"
            onChangeText={onPasswordChange}
          />
          {error && <Text style={{color: 'red'}}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={() => submit()}>
            <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
              Registrarse
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputStype: {
    borderWidth: 1,
    borderColor: 'green',
    width: 350,
    borderRadius: 12,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },
});

export default App;
