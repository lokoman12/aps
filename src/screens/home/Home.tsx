import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const [exchangeRatesUsd, setExchangeRatesUsd] = useState<{ [key: string]: number }>({});
  const [exchangeRatesEur, setExchangeRatesEur] = useState<{ [key: string]: number }>({});
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000); // Запрос каждые 60 секунд
    return () => clearInterval(interval);
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const responseUsd = await fetch('https://v6.exchangerate-api.com/v6/7808386d16bfaa218afeea15/latest/USD');
      const responseEur = await fetch('https://v6.exchangerate-api.com/v6/7808386d16bfaa218afeea15/latest/EUR');
      const dataUsd = await responseUsd.json();
      const dataEur = await responseEur.json();
      setExchangeRatesUsd(dataUsd.conversion_rates);
      setExchangeRatesEur(dataEur.conversion_rates);
      setDate(dataUsd.time_last_update_utc);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>Дата: {date}</Text>
      </View>
      <View style={styles.exchangeRates}>
        <Text style={[styles.rateText, styles.usdRate]}>
          Курс доллара к рублю: {exchangeRatesUsd.RUB}
        </Text>
        <Text style={[styles.rateText, styles.eurRate]}>
          Курс евро к рублю: {exchangeRatesEur.RUB}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  date: {
    marginTop: 50,
    fontSize: 18,
    color: 'black',
  },
  exchangeRates: {
    alignItems: 'center',
  },
  rateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  usdRate: {
    color: 'green',
  },
  eurRate: {
    color: 'red',
  },
});

export default HomeScreen;