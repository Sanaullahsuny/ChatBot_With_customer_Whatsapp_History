import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Mixgraph = ({ route, navigation }) => {
  const {
    graphData = [],
    session1Title = 'S1 - Fall 2025',
    session2Title = 'S2 - Fall 2024',
  } = route.params || {};

  const [visibleSession, setVisibleSession] = useState('both'); // 'session1', 'session2', 'both'
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line'

  let formattedData;

  if (chartType === 'bar' && visibleSession === 'both') {
    const combinedLabels = graphData.flatMap(item => [
      `${item.title} S1`,
      `${item.title} S2`,
    ]);

    const combinedData = graphData.flatMap(item => [
      item.session1Chats,
      item.session2Chats,
    ]);

    formattedData = {
      labels: combinedLabels,
      datasets: [
        {
          data: combinedData,
        },
      ],
    };
  } else {
    formattedData = {
      labels: graphData.map(item => item.title),
      datasets:
        visibleSession === 'session1'
          ? [{ data: graphData.map(item => item.session1Chats) }]
          : visibleSession === 'session2'
          ? [{ data: graphData.map(item => item.session2Chats) }]
          : [
              {
                data: graphData.map(item => item.session1Chats),
                color: () => '#075E54',
              },
              {
                data: graphData.map(item => item.session2Chats),
                color: () => '#25D366',
              },
            ],
    };
  }

  const screenWidth = Dimensions.get('window').width;
  const labelCount = formattedData.labels.length;
  const perLabelWidth = 80;
  const chartWidth = Math.max(labelCount * perLabelWidth, screenWidth);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>📊 Session Graph</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setChartType('bar')} style={styles.iconButton}>
            <Ionicons name="bar-chart" size={22} color={chartType === 'bar' ? '#fff' : '#ccc'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setChartType('line')} style={styles.iconButton}>
            <Ionicons name="trending-up" size={22} color={chartType === 'line' ? '#fff' : '#ccc'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Session Toggles */}
      <View style={styles.toggleContainer}>
        {['session1', 'session2', 'both'].map(key => (
          <TouchableOpacity
            key={key}
            style={[
              styles.toggleButton,
              visibleSession === key && styles.selectedToggle,
            ]}
            onPress={() => setVisibleSession(key)}
          >
            <Text
              style={[
                styles.toggleText,
                visibleSession === key && styles.selectedToggleText,
              ]}
            >
              {key === 'session1' ? session1Title : key === 'session2' ? session2Title : 'Both'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.chartCard}>
          <ScrollView horizontal contentContainerStyle={{ minWidth: chartWidth }}>
            <View style={{ width: chartWidth }}>
              {chartType === 'bar' ? (
                <BarChart
                  data={formattedData}
                  width={chartWidth}
                  height={420} // Increased chart height here
                  fromZero
                  showValuesOnTopOfBars
                  verticalLabelRotation={45}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                />
              ) : (
                <LineChart
                  data={formattedData}
                  width={chartWidth}
                  height={420}
                  fromZero
                  bezier
                  verticalLabelRotation={45}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                />
              )}
            </View>
          </ScrollView>

          {/* Legend for both */}
          {visibleSession === 'both' && (
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#075E54' }]} />
                <Text style={styles.legendText}>S1 - Fall 2025</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#25D366' }]} />
                <Text style={styles.legendText}>S2 - Fall 2024</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Mixgraph;

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  barPercentage: 0.6,
  color: (opacity = 1) => `rgba(7, 94, 84, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForBackgroundLines: {
    stroke: '#ccc',
  },
  propsForLabels: {
    fontSize: 12,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    margin: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedToggle: {
    backgroundColor: '#075E54',
  },
  toggleText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedToggleText: {
    color: '#fff',
  },
  chartCard: {
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 4,
  },
  chartStyle: {
    borderRadius: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
