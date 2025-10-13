import NotificationCard from '@/componentes/moleculas/notificacion';
import { Text, View } from "react-native";
import MenuInf from '@/componentes/moleculas/menuInf';
import { Ionicons } from '@expo/vector-icons';
const handleGoHome = () => {
    console.log('Navegando a Home');
};

const handleGoMap = () => {
    console.log('Navegando a Mapa');
};

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

    <MenuInf
        homeIcon={<Ionicons name="home-outline" size={32} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
        onHomePress={handleGoHome}
        onMapPress={handleGoMap}
    />