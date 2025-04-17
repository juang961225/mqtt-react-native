import React from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, Platform } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine } from 'victory-native';
import {
  VictoryBar as WebVictoryBar,
  VictoryChart as WebVictoryChart,
  VictoryLine as WebVictoryLine,
  VictoryTheme as WebVictoryTheme,
} from 'victory';

const screenWidth = Dimensions.get('window').width;

const coffeeData = {
  espresso: 5,
  americano: 3,
  latte: 7,
  capuccino: 4,
  mocha: 2,
  macchiato: 6,
};

const temperature = 22;

const coffeeByDay = [
  { day: 'Lun', count: 3 },
  { day: 'Mar', count: 4 },
  { day: 'Mié', count: 6 },
  { day: 'Jue', count: 2 },
  { day: 'Vie', count: 5 },
  { day: 'Sáb', count: 4 },
  { day: 'Dom', count: 7 },
];

const coffeeByHour = [
  { hour: '8am', count: 1 },
  { hour: '10am', count: 3 },
  { hour: '12pm', count: 2 },
  { hour: '2pm', count: 4 },
  { hour: '4pm', count: 2 },
  { hour: '6pm', count: 1 },
];

export default function TabTwoScreen() {
  const BarChart = Platform.OS === 'web' ? WebVictoryBar : VictoryBar;
  const LineChart = Platform.OS === 'web' ? WebVictoryLine : VictoryLine;
  const Chart = Platform.OS === 'web' ? WebVictoryChart : VictoryChart;
  const theme = Platform.OS === 'web' ? WebVictoryTheme.material : VictoryTheme.material;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>☕ Café Tracker</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de café</Text>
        {Object.entries(coffeeData).map(([type, count]) => (
          <Text key={type} style={styles.itemText}>
            {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌡️ Temperatura actual</Text>
        <Text style={styles.temp}>{temperature}°C</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Café por día</Text>
        <Chart
          width={screenWidth - 32}
          height={220}
          theme={theme}
          domainPadding={20}
        >
          <BarChart
            data={coffeeByDay}
            x="day"
            y="count"
            animate={{ duration: 800, easing: 'bounce' }}
            style={{
              data: {
                fill: '#A9715E',
                width: 20,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              },
            }}
          />
        </Chart>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Café por hora</Text>
        <Chart
          width={screenWidth - 32}
          height={220}
          theme={theme}
        >
          <LineChart
            data={coffeeByHour}
            x="hour"
            y="count"
            animate={{ duration: 1000, easing: 'linear' }}
            style={{
              data: { stroke: '#4A3F35', strokeWidth: 3 },
              parent: { border: '1px solid #ccc' },
            }}
          />
        </Chart>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FAF3E0', // Tono latte
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4A3F35',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    color: '#7B6D63',
  },
  itemText: {
    fontSize: 16,
    color: '#4A3F35',
    paddingVertical: 2,
  },
  temp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D2691E',
    textAlign: 'center',
  },
});
