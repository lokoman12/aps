import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

interface WeatherData {
  city: {
    name: string;
  };
  list: Array<{
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
    rain?: {
      "3h": number;
    };
    snow?: {
      "3h": number;
    };
    visibility: number;
    clouds: {
      all: number;
    };
  }>;
}

function WeatherScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const apiKey = "a08030033db4cd2d349172fabe68f55c";
  const city = "St Petersburg";
  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`; // Добавляем параметр units=metric для получения температуры в градусах Цельсия

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    // Выполняем первый запрос при монтировании компонента
    fetchData();

    // Устанавливаем интервал для обновления каждую минуту
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []); // Пустой массив означает, что эффект выполняется только при монтировании и размонтировании

  return (
    <View style={styles.container}>
      {weatherData ? (
        <>
          <Text style={styles.city}>{weatherData.city.name}</Text>
          <Text style={styles.temperature}>{Math.round(weatherData.list[0].main.temp)}°C</Text>
          <Text style={styles.weatherCondition}>{weatherData.list[0].weather[0].description}</Text>
          <Text>Wind: {weatherData.list[0].wind.speed} m/s</Text>
          {weatherData.list[0].rain && <Text>Rain: {weatherData.list[0].rain["3h"]} mm</Text>}
          {weatherData.list[0].snow && <Text>Snow: {weatherData.list[0].snow["3h"]} mm</Text>}
          <Text>Visibility: {weatherData.list[0].visibility} meters</Text>
          <Text>Cloudiness: {weatherData.list[0].clouds.all}%</Text>
        </>
      ) : (
        <Text>Loading weather data...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 40,
    marginTop: 10,
  },
  weatherCondition: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default WeatherScreen;
