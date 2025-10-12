import DescripcionNoti from '@/componentes/atomos/descripcionNotificacion';
import ImagenNotificacion from '@/componentes/atomos/imagenNotificacion';
import Titulo from '@/componentes/atomos/tituloNotificacion';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

type NotificationColor = 'red' | 'yellow' | 'green';

interface NotificationCardProps {
  color: NotificationColor;
  title: string;
  description: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  color,
  title,
  description,
  onPress,
  containerStyle,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <ImagenNotificacion color={color} size={36} />
      </View>
      
      <View style={styles.textContainer}>
        <Titulo style={styles.title}>{title}</Titulo>
        <DescripcionNoti texto={description} />
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 27,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 2,
  },
});

export default NotificationCard;