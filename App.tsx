import React, {useEffect, useState} from 'react';
import {
  Button,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState();
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onPasswordChange = (e: string) => {
    setError('');
    setPassword(e);
  };

  const onEmailChange = (e: string) => {
    setError('');
    setEmail(e);
  };

  const onPhoneChange = (e: string) => {
    setPhoneNumber(e);
  };

  const createUserByEmailAndPassword = (
    emailInput: string,
    passwordInput: string,
  ) => {
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

  // Handle the verify phone button press
  const verifyPhoneNumber = async phoneNumbervalid => {
    const confirmation = await auth().verifyPhoneNumber(phoneNumbervalid);
    setConfirm(confirmation);
  };

  const confirmCode = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      let userData = await auth().currentUser.linkWithCredential(credential);
      setUser(userData.user);
      // eslint-disable-next-line no-catch-shadow
    } catch (error) {
      if (error.code === 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    setLoading(false);
  };

  const submit = () => {
    if (email === '' || password === '') {
      setError('Llene los campos');
      return;
    }
    createUserByEmailAndPassword(email, password);
  };

  const submitPhone = () => {
    console.log('PhoneNumber');
    const formatNumber = `+52${phoneNumber}`;
    console.log('firmat----', formatNumber);
    verifyPhoneNumber(formatNumber);
  };

  if (initializing) return null;

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
          <Text style={styles.sectionTitle}>TacoLive</Text>
          {!user ? (
            <>
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

              <TouchableOpacity
                style={loading ? styles.butonDisabled : styles.button}
                onPress={submit}
                disabled={loading}>
                <Text
                  style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </>
          ) : !user.phoneNumber ? (
            !confirm ? (
              <>
                <TextInput
                  keyboardType="number-pad"
                  value={phoneNumber}
                  style={{...styles.inputStype, marginTop: 10, marginBottom: 10}}
                  placeholder="Numero de telefono"
                  onChangeText={onPhoneChange}
                />
                <Button title="Verify Phone Number" onPress={submitPhone} />
              </>
            ) : (
              <>
                <TextInput value={code} keyboardType='number-pad' onChangeText={text => setCode(text)} />
                <Button title="Confirm Code" onPress={() => confirmCode()} />
              </>
            )
          ) : (
            <>
            <Text>
              Welcome! {user.phoneNumber} linked with {user.email}
            </Text>
            <Button title="Cerrar sesion" onPress={signOut} />
            </>
          )}
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
  butonDisabled: {
    backgroundColor: 'gray',
    color: 'white',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },
});

export default App;
