import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect} from 'react';
import NfcManager, {NfcTech, NfcEvents} from 'react-native-nfc-manager';
import QRCode from 'react-native-qrcode-svg';

const {width, height} = Dimensions.get('window');

export default function App() {
  useEffect(() => {
    async function initNfc() {
      await NfcManager.start();
      // to detect NFC tags and perform various action when tag is discovered
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        console.log('Tag found:', tag);
        Alert.alert('Tag found', JSON.stringify(tag));
        NfcManager.setAlertMessageIOS('NFC tag detected'); // for ios whenver the nfc tag is discovered
        NfcManager.unregisterTagEvent().catch(() => 0); // is from unmounting tag from the dom
        // .catch(() =<0) is used to suppress any error that may occur during the unregisteration process
      });
      // callback function to handle the session closed
      NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
        console.log('NFC session closed');
      });
    }

    initNfc();
    // it is a clean up method execute when the component unmounts. Basically to clean up the function for
    // tasks that need to be performed when the component is removed from the DOM.
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    };
  }, []);
  // is to handle the button when click it will directly open then linkin url
  const handleButtonPress = async () => {
    try {
      Linking.openURL('https://nextlinkinternet.com/fiber-internet-to-the-home/');
    } catch (error) {
      console.log('Error opening URL:', error);
    }
  };

    // This function will check that is there any ongoing ptoccess. if thrue it pop up the alert
  const handleNfcPress = async () => {
    if (NfcManager.isRequestPending()) {
      Alert.alert(
        'Operation in progress',
        'Please wait for the current operation to complete.',
      );
      return;
    }
    // else it will execute the try catch block
    try {
      // if no going process then requestTechnology will request for  NFC Data Exchange format for Reading and Writing
  
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.registerTagEvent(); // this tag allow our application to react toNFC tags being discovered or read
    } catch (error) {
      console.warn(error);
      console.log('NFC Error:', error);
      Alert.alert('NFC Error', 'An error occurred while reading the tag.');
      await NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{top: 50}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleButtonPress}>
            <Image
              style={styles.arrow}
              source={require('./src/assets/down.png')}
            />
            <Text style={styles.btnText}>Share my card</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.qrContainer}>
        <QRCode
          value="https://nextlinkinternet.com/fiber-internet-to-the-home/"
          size={width * 0.5} // Adjust size based on screen width
        />
      </View>

      <View style={styles.card}>
        {[
          {src: require('./src/assets/share.png'), text: 'Share my card'},
          {src: require('./src/assets/wallet.png'), text: 'Add card to wallet'},
          {
            src: require('./src/assets/home.png'),
            text: 'Add card to homescreen',
          },
          {
            src: require('./src/assets/write.png'),
            text: 'Create Email signature',
          },
          {
            src: require('./src/assets/virtual.png'),
            text: 'Create virtual background',
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardInner}
            onPress={handleNfcPress}>
            <Image style={styles.imgTxt} source={item.src} />
            <Text style={styles.cardText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btn2} onPress={handleButtonPress}>
        <Image style={styles.arrow} source={require('./src/assets/wifi.png')} />
        <Text style={styles.btnText}>Share with AirDrop</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: '#dcdcdc',
    height: 50,
    top: 10,
    elevation: 1,
    width: width * 0.8,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 100,
    justifyContent: 'center',
  },
  qrContainer: {
    marginTop: height * 0.2,
    alignItems: 'center',
  },
  imgTxt: {
    height: 24,
    width: 24,
  },
  cardText: {
    color: 'black',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 18,
  },
  btn: {
    backgroundColor: '#ff7f00',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 60,
    top: -5,
    flexDirection: 'row',
    height: 50,
  },
  btn2: {
    backgroundColor: '#ff7f00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03,
    borderRadius: 60,
    alignSelf: 'center',
    width: width * 0.8,
    flexDirection: 'row',
    marginBottom: height * 0.1,
    height: 50,
  },
  btnText: {
    fontWeight: '800',
    color: 'white',
    fontSize: 18,
  },
  arrow: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  card: {
    marginTop: height * 0.03,
    borderRadius: 10,
    alignSelf: 'center',
    opacity: 0.5,
    width: width * 0.8,
    backgroundColor: '#dcdcdc',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
});
