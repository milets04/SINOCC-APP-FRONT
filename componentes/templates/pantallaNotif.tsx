import Header from '@/componentes/moleculas/header';
import MenuInf from '@/componentes/moleculas/menuInf';
import NotificationCard from '@/componentes/moleculas/notificacion';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function pantallaNotificaciones() {
  const handleGoHome = () => {
    console.log('Navegando a Home');
  };

  const handleGoMap = () => {
    console.log('Navegando a Mapa');
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <NotificationCard
          color="red"
          title="Title"
          description="Description"
        />
        <NotificationCard
          color="green"
          title="Title"
          description="Description"
        />
        <NotificationCard
          color="yellow"
          title="Title"
          description="Description"
        />
      </ScrollView>

      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={32} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
        onHomePress={handleGoHome}
        onMapPress={handleGoMap}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingVertical: 10,
  },
});