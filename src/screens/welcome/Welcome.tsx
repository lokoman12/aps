import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, Image, ImageSourcePropType, ImageStyle, StyleSheet, Dimensions } from 'react-native';


const Welcome = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Main', { screen: 'Home' });
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('./Welcome.jpg')} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.text}>Добро пожаловать в приложение</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: Dimensions.get('window').width, // Устанавливаем ширину равной ширине экрана
        height: Dimensions.get('window').height, // Устанавливаем высоту равной высоте экрана
    },
    textContainer: {
        position: 'absolute',
        bottom: 40, // Располагаем текст внизу экрана с отступом 20 единиц от нижнего края
        width: '100%', // Располагаем текст на всю ширину экрана
        alignItems: 'center', // Выравниваем текст по центру
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
});

export default Welcome;