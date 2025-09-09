// import { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Alert,
//   Animated,
//   Pressable,
//   ScrollView,
//   Dimensions,
//   TextInput,
//   Button,
// } from 'react-native';

// import './setupNodePolyfills';
// import mqtt from 'mqtt';

// import { Buffer } from 'buffer';

// global.Buffer = Buffer; // polyfill necesario para mqtt en React Native

// const coffeeTypes = [
//   { name: 'ESPRESSO', code: 'led1', image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG' },
//   { name: 'CAPPUCCINO', code: 'led2', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Cappuccino_at_Sightglass_Coffee.jpg' },
//   { name: 'LATTE', code: 'led3', image: 'https://www.nescafe.com/co/sites/default/files/2023-04/RecipeHero_CaramelLatte_1066x1066.jpg' },
// ];

// const loadingGif = 'https://i.pinimg.com/originals/8b/a9/f9/8ba9f9a104e4cc7ab03d66e9670d2763.gif';

// const screenWidth = Dimensions.get('window').width;
// const cardWidth = (screenWidth - 48) / 2;

// export default function HomeScreen() {
//   const [brokerUrl, setBrokerUrl] = useState('ws://192.168.1.188:8080'); // broker por defecto
//   const [client, setClient] = useState<any>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [loadingCoffee, setLoadingCoffee] = useState<string | null>(null);
//   const [temperature, setTemperature] = useState<string | null>(null);
//   const [response, setResponse] = useState<string | null>(null);

//   const connectToBroker = () => {
//     if (client) {
//       client.end(); // cerrar si ya hay uno
//       setIsConnected(false);
//     }

//     const mqttClient = mqtt.connect(brokerUrl);

//     mqttClient.on('connect', () => {
//       console.log('✅ Conectado a MQTT');
//       setIsConnected(true);

//       mqttClient.subscribe('sensor/temperatura');
//       mqttClient.subscribe('sensor/led/response');
//     });

//     mqttClient.on('message', (topic, message) => {
//       const msg = message.toString();
//       if (topic === 'sensor/temperatura') setTemperature(msg);
//       if (topic === 'sensor/led/response') setResponse(msg);
//     });

//     mqttClient.on('error', (err) => {
//       console.error('❌ Error de conexión MQTT:', err);
//       setIsConnected(false);
//     });

//     setClient(mqttClient);
//   };

//   const sendCoffeeCode = (coffeeName: string, code: string) => {
//     if (client && isConnected) {
//       setLoadingCoffee(code);
//       client.publish('sensor/led', code);
//       Alert.alert('Café seleccionado', `Has pedido un ${coffeeName}`);
//       setTimeout(() => setLoadingCoffee(null), 3000);
//     } else {
//       console.warn('🚫 No hay conexión con MQTT');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.status}>
//         ☕ Estado de conexión: {isConnected ? '✅ Conectado' : '❌ Desconectado'}
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="ws://192.168.x.x:port"
//         value={brokerUrl}
//         onChangeText={setBrokerUrl}
//       />
//       <Button title="Conectar Broker" onPress={connectToBroker} />

//       <View style={styles.temperatureContainer}>
//         <Text style={styles.temperature}>🌡️ {temperature || 'Esperando datos...'}</Text>
//       </View>

//       <View style={styles.responseContainer}>
//         <Text style={styles.response}>💬 {response || 'Esperando respuesta...'}</Text>
//       </View>

//       <View style={styles.grid}>
//         {coffeeTypes.map((coffee) => {
//           const scale = new Animated.Value(1);
//           const isLoading = loadingCoffee === coffee.code;

//           return (
//             <Pressable
//               key={coffee.code}
//               disabled={loadingCoffee !== null}
//               onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: false }).start()}
//               onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start()}
//               onPress={() => sendCoffeeCode(coffee.name, coffee.code)}
//             >
//               <Animated.View
//                 style={[
//                   styles.card,
//                   { transform: [{ scale }], width: cardWidth, opacity: loadingCoffee !== null ? 0.5 : 1 },
//                 ]}
//               >
//                 <Image
//                   source={{ uri: isLoading ? loadingGif : coffee.image }}
//                   style={styles.image}
//                 />
//                 <Text style={styles.label}>{coffee.name}</Text>
//               </Animated.View>
//             </Pressable>
//           );
//         })}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { paddingTop: 40, paddingBottom: 30, paddingHorizontal: 16, backgroundColor: '#FAF3E0' },
//   status: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#4A3F35', fontWeight: '500' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10, backgroundColor: '#fff' },
//   temperatureContainer: { marginBottom: 20 },
//   temperature: { fontSize: 18, fontWeight: '600', color: '#4A3F35', textAlign: 'center' },
//   responseContainer: { marginBottom: 20 },
//   response: { fontSize: 18, fontWeight: '600', color: '#4A3F35', textAlign: 'center' },
//   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.07,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   image: { width: '100%', height: 110, borderRadius: 12, marginBottom: 8, resizeMode: 'cover' },
//   label: { fontSize: 14, fontWeight: '600', color: '#5C4531', textAlign: 'center' },
// });
