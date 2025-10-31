import { SelectOption } from '@/componentes/atomos/selectFormulario';
import { FormularioCierreData } from '@/componentes/moleculas/formularioCierre';
import TemplateEditarCierre from '@/componentes/templates/templateEditarCierre';
import { useAuth } from '@/contexto/autenticacion';
import { useUbicaciones } from '@/contexto/ubicaciones';
import Constants from 'expo-constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

const obtenerApiUrl = () => { 
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(':')[0]; 
      const apiUrl = `http://${ip}:3000/api`;
      console.log('🌐 API URL detectada (editarCierre):', apiUrl);
      return apiUrl;
    }
  } catch (error) {
    console.warn('⚠️ No se pudo detectar la IP local automáticamente.');
  }
  console.log('🌐 Usando localhost como fallback');
  return 'http://localhost:3000/api';
};

const API_URL = obtenerApiUrl(); 

const categoriasOptions: SelectOption[] = [
  { label: 'Bajo', value: 'BAJO' },
  { label: 'Medio', value: 'MEDIO' },
  { label: 'Alto', value: 'ALTO' },
];

interface ZonaAPI {
  id: number;
  nombreZona: string;
}

export default function EditarCierre() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth(); 
  const [zonasOptions, setZonasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [datosIniciales, setDatosIniciales] = useState<FormularioCierreData>();
  const { ubicaciones: ubicacionesSeleccionadas, setUbicaciones } = useUbicaciones();
  const cierreId = params.cierreId?.toString();

  // 🔹 Obtener zonas
  useEffect(() => {
  const fetchData = async () => {
    try {
      if (!cierreId) throw new Error("ID de cierre no proporcionado");

      // 🔹 Cargar zonas y cierre en paralelo
      const [zonasRes, cierreRes] = await Promise.all([
        fetch(`${API_URL}/zonas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/cierres/${cierreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const zonasData = await zonasRes.json();
      const cierreData = await cierreRes.json();

      if (!zonasRes.ok) throw new Error("Error al obtener zonas");
      if (!cierreRes.ok) throw new Error("Error al obtener cierre");

      const zonasOpts =
        zonasData?.datos?.map((z: any) => ({
          label: z.nombreZona,
          value: z.id.toString(), 
        })) || [];
      setZonasOptions(zonasOpts);

      const cierre = cierreData.datos;
      const ubicacionesData =
        cierre.ubicaciones?.map((u: any) => ({
          id: u.id,
          latitud: u.latitud,
          longitud: u.longitud,
        })) || [];

        setUbicaciones(ubicacionesData);

    setDatosIniciales({
      categoria: cierre.categoria,
      zona: cierre.idZona?.toString(), 
      lugarCierre: cierre.lugarCierre,
      fechaInicio: cierre.fechaInicio,
      fechaFin: cierre.fechaFin,
      motivo: cierre.descripcion,
      ubicaciones: ubicacionesData,
      });

    } catch (err: any) {
        console.error("Error cargando datos:", err);
        Alert.alert("Error", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cierreId, token]);

  const handleFormSubmit = async (data: FormularioCierreData) => {
    if (!cierreId) {
      Alert.alert("Error", "ID del cierre no especificado.");
      return;
    }

    const payload = {
      categoria: data.categoria,
      lugarCierre: data.lugarCierre,
      idZona: Number(data.zona),
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      descripcion: data.motivo,
      ubicaciones: data.ubicaciones.map(ub => ({
        latitud: ub.latitud,
        longitud: ub.longitud,
      })),
    };

    try {
      const res = await fetch(`${API_URL}/cierres/${cierreId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const dataRes = await res.json();
      if (!res.ok) throw new Error(dataRes.mensaje || "Error al editar");
      Alert.alert("Éxito", "Cierre actualizado correctamente");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146BF6" />
      </View>
    );
  }

  return (
    <TemplateEditarCierre
      categorias={categoriasOptions}
      zonas={zonasOptions}
      datosIniciales={datosIniciales}
      onSubmit={handleFormSubmit}
      ubicaciones={ubicacionesSeleccionadas}
      setUbicaciones={setUbicaciones}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
