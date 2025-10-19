import Boton from '@/componentes/atomos/boton';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import CardAdministrador, { CardAdministradorProps } from '@/componentes/moleculas/cardAdministrador';
import Header from '@/componentes/moleculas/header';
import MenuInf from '@/componentes/moleculas/menuInf';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface TemplateGestionAdministradoresProps {
  administradores: CardAdministradorProps[];
  onEditAdmin: (nombre: string) => void;
  onDeleteAdmin: (nombre: string) => void;
  onRegistrarNuevo: () => void;
  homeIcon: React.ReactNode;
  mapIcon: React.ReactNode;
  onHomePress: () => void;
  onMapPress: () => void;
}

const TemplateGestionAdministradores: React.FC<TemplateGestionAdministradoresProps> = ({
  administradores,
  onEditAdmin,
  onDeleteAdmin,
  onRegistrarNuevo,
  homeIcon,
  mapIcon,
  onHomePress,
  onMapPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Header />

      {/* Contenido con scroll */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <TituloPestania style={styles.titulo}>
          Administradores Activos
        </TituloPestania>

        {/* Lista de administradores */}
        <View style={styles.listaAdmins}>
          {administradores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <TituloPestania style={styles.emptyText}>
                No hay administradores
              </TituloPestania>
            </View>
          ) : (
            administradores.map((admin, index) => (
              <CardAdministrador
                key={index}
                nombre={admin.nombre}
                correo={admin.correo}
                usuario={admin.usuario}
                fotoUri={admin.fotoUri}
                onEdit={() => onEditAdmin(admin.nombre)}
                onDelete={() => onDeleteAdmin(admin.nombre)}
              />
            ))
          )}
        </View>

        {/* Botón Registrar nuevo administrador */}
        <View style={styles.botonContainer}>
          <Boton
            texto="Registrar nuevo administrador"
            onPress={onRegistrarNuevo}
            variante="primario"
            estilo={styles.botonRegistrar}
          />
        </View>
      </ScrollView>

      {/* Menú Inferior */}
      <MenuInf
        homeIcon={homeIcon}
        mapIcon={mapIcon}
        onHomePress={onHomePress}
        onMapPress={onMapPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  titulo: {
    marginBottom: 20,
  },
  listaAdmins: {
    gap: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  botonContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  botonRegistrar: {
    width: 295,
    height: 50,
  },
});

export default TemplateGestionAdministradores;