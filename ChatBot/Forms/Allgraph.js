// ChatBot/Forms/Allgraph.js

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';

const sessionColors = ['#075E54', '#25D366', '#128C7E', '#34B7F1', '#FFC107'];

const Allgraph = ({ route, navigation }) => {
  const { reports = {} } = route.params || {};
  const [chartType, setChartType] = useState('bar');

  // Step 1: Get unique categories
  const categorySet = new Set();
  Object.values(reports).forEach(session =>
    session.forEach(item => categorySet.add(item.category_title))
  );
  const categories = Array.from(categorySet);

  // Step 2: Prepare datasets per session
  const sessionTitles = Object.keys(reports);
  const datasets = sessionTitles.map((session, index) => {
    const categoryToValue = {};
    reports[session].forEach(item => {
      categoryToValue[item.category_title] = item.total_chats;
    });

    const data = categories.map(cat => categoryToValue[cat] || 0);

    return {
      data,
      color: () => sessionColors[index % sessionColors.length],
      strokeWidth: 2,
      label: session,
    };
  });

  const formattedData = {
    labels: categories,
    datasets: chartType === 'line' ? datasets : [
      {
        data: datasets.flatMap(ds => ds.data),
      },
    ],
  };

  // For bar chart: flatten labels too
  const flatLabels = chartType === 'bar'
    ? sessionTitles.flatMap(title => categories.map(cat => `${cat} - ${title}`))
    : categories;

  const screenWidth = Dimensions.get('window').width;
  const perLabelWidth = 80;
  const labelCount = chartType === 'bar' ? flatLabels.length : categories.length;
  const chartWidth = Math.max(labelCount * perLabelWidth, screenWidth);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>📈 All Sessions Graph</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setChartType('bar')} style={styles.iconButton}>
            <Ionicons name="bar-chart" size={22} color={chartType === 'bar' ? '#fff' : '#ccc'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setChartType('line')} style={styles.iconButton}>
            <Ionicons name="trending-up" size={22} color={chartType === 'line' ? '#fff' : '#ccc'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.chartCard}>
          <ScrollView horizontal contentContainerStyle={{ minWidth: chartWidth }}>
            <View style={{ width: chartWidth }}>
              {chartType === 'bar' ? (
                <BarChart
                  data={{
                    labels: flatLabels,
                    datasets: formattedData.datasets,
                  }}
                  width={chartWidth}
                  height={400}
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
                  height={400}
                  fromZero
                  bezier
                  verticalLabelRotation={45}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                />
              )}
            </View>
          </ScrollView>

          {/* Legend */}
          {chartType === 'line' && (
            <View style={styles.legendContainer}>
              {sessionTitles.map((title, idx) => (
                <View key={title} style={styles.legendItem}>
                  <View style={[styles.colorBox, { backgroundColor: sessionColors[idx % sessionColors.length] }]} />
                  <Text style={styles.legendText}>{title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Allgraph;

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
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
    flexWrap: 'wrap',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 5,
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
