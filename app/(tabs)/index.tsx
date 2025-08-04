import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Animated, Pressable, ScrollView, Dimensions } from 'react-native';
import mqtt from 'mqtt';

const coffeeTypes = [
  { name: 'ESPRESSO', code: 'led1', image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG' },
  { name: 'CAPPUCCINO', code: 'led2', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Cappuccino_at_Sightglass_Coffee.jpg' },
  { name: 'LATTE', code: 'led3', image: 'https://www.nescafe.com/co/sites/default/files/2023-04/RecipeHero_CaramelLatte_1066x1066.jpg' },
];

const loadingGif = 'https://i.pinimg.com/originals/8b/a9/f9/8ba9f9a104e4cc7ab03d66e9670d2763.gif';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

export default function HomeScreen() {
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loadingCoffee, setLoadingCoffee] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<string | null>(null);  // Para almacenar la temperatura recibida
  const [response, setResponse] = useState<string | null>(null); // Para almacenar la respuesta "sí" o "no"

  // Cambiar el broker público por la IP local del ESP32
  const MQTT_BROKER = 's://192.168.1.188:8080/';

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER);

    mqttClient.on('connect', () => {
      console.log('✅ Conectado a MQTT');
      setIsConnected(true);

      // Suscribirse a los topics relevantes
      mqttClient.subscribe('sensor/temperatura', (err) => {
        if (err) {
          console.error('❌ Error al suscribirse al topic sensor/temperatura:', err);
        } else {
          console.log('📡 Suscrito al topic: sensor/temperatura');
        }
      });

      mqttClient.subscribe('sensor/led/response', (err) => {
        if (err) {
          console.error('❌ Error al suscribirse al topic sensor/led/response:', err);
        } else {
          console.log('📡 Suscrito al topic: sensor/led/response');
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === 'sensor/temperatura') {
        const temperatura = message.toString();
        console.log('🌡️ Temperatura recibida:', temperatura);
        setTemperature(temperatura);  // Actualizar el estado de temperatura
      }

      if (topic === 'sensor/led/response') {
        const responseMessage = message.toString();
        console.log('💬 Respuesta del broker:', responseMessage);
        setResponse(responseMessage);  // Actualizar el estado con la respuesta
      }
    });

    mqttClient.on('error', (err) => {
      console.error('❌ Error de conexión MQTT:', err);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const sendCoffeeCode = (coffeeName: string, code: string) => {
    if (client && isConnected) {
      setLoadingCoffee(code);
      // Publicar en el topic correcto cuando se selecciona el café
      client.publish('sensor/led', code);  // Usamos el topic 'sensor/led' para enviar el valor
      console.log(`📤 Código enviado (${coffeeName}): ${code}`);
      Alert.alert('Café seleccionado', `Has pedido un ${coffeeName}`);

      setTimeout(() => {
        setLoadingCoffee(null);
      }, 3000);
    } else {
      console.warn('🚫 No hay conexión con MQTT');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.status}>
        ☕ Estado de conexión: {isConnected ? '✅ Conectado' : '❌ Desconectado'}
      </Text>

      {/* Mostrar temperatura debajo de los botones */}
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>
          🌡️ Temperatura: {temperature || 'Esperando datos...'}
        </Text>
      </View>

      {/* Mostrar respuesta del broker ("sí" o "no") */}
      <View style={styles.responseContainer}>
        <Text style={styles.response}>
          💬 Respuesta: {response || 'Esperando respuesta...'}
        </Text>
      </View>

      <View style={styles.grid}>
        {coffeeTypes.map((coffee) => {
          const scale = new Animated.Value(1);

          const handlePressIn = () => {
            Animated.spring(scale, {
              toValue: 0.95,
              useNativeDriver: false,
            }).start();
          };

          const handlePressOut = () => {
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: false,
              friction: 3,
              tension: 40,
            }).start();
          };

          const isLoading = loadingCoffee === coffee.code;

          return (
            <Pressable
              key={coffee.code}
              disabled={loadingCoffee !== null}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => sendCoffeeCode(coffee.name, coffee.code)}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ scale }],
                    width: cardWidth,
                    opacity: loadingCoffee !== null ? 0.5 : 1,
                  },
                ]}
              >
                <Image
                  source={{ uri: isLoading ? loadingGif : coffee.image }}
                  style={styles.image}
                />
                <Text style={styles.label}>{coffee.name}</Text>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FAF3E0',
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4A3F35',
    fontWeight: '500',
  },
  temperatureContainer: {
    marginBottom: 20,
  },
  temperature: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3F35',
    textAlign: 'center',
  },
  responseContainer: {
    marginBottom: 20,
  },
  response: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3F35',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4531',
    textAlign: 'center',
  },
});
