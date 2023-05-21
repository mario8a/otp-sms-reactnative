import React, {useEffect, useState} from 'react';
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
import auth from '@react-native-firebase/auth';

const App = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = user => {
    console.log('user???', user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onPasswordChange = (e: string) => {
    setPassword(e);
  };

  const onEmailChange = (e: string) => {
    setEmail(e);
  };

  const createUser = (emailInput: string, passwordInput: string) => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(emailInput, passwordInput)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        setLoading(false);
        setError('Ocurrio un error');
        console.error(error);
      });
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const submit = () => {
    if (email === '' || password === '') {
      setError('Llene los campos');
      return;
    }
    createUser(email, password);
  };

  if (initializing) return null;

  if (user) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hola {user.email}</Text>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
            Cerrar sesion
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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

          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}} disabled={loading}>
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
