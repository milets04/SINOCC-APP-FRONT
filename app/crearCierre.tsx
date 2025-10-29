import { SelectOption } from '@/componentes/atomos/selectFormulario';
import { FormularioCierreData } from '@/componentes/moleculas/formularioCierre';
import TemplateCrearCierre from '@/componentes/templates/templateCrearCierre';
import { useAuth } from '@/contexto/autenticacion';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const obtenerApiUrl = () => { 
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(':')[0]; 
      const apiUrl = `http://${ip}:3000/api`;
      console.log('🌐 API URL detectada (crearCierre):', apiUrl);
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

export default function PantallaCrearCierre() {
  const router = useRouter();
  const { token } = useAuth(); 
  const [zonasOptions, setZonasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await fetch(`${API_URL}/zonas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });

        const zonasData: ZonaAPI[] = await response.json();
        
        const opcionesFormateadas = zonasData.map((zona) => ({
          label: zona.nombreZona,
          value: zona.id,
        }));
        
        setZonasOptions(opcionesFormateadas);
      } catch (error) {
        console.error("Error al cargar las zonas:", error);
        Alert.alert("Error", "No se pudieron cargar las zonas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchZonas();
  }, [token]); 

  const handleFormSubmit = async (data: FormularioCierreData) => {
    const payload = {
      categoria: data.categoria.toString(),
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
      console.log("Enviando al backend:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/cierres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.mensaje || 'Error al crear el cierre');
      }

      Alert.alert('Éxito', '¡Cierre creado con éxito!');
      router.back();

    } catch (error: any) {
      console.error("Error al crear el cierre:", error);
      Alert.alert("Error", `No se pudo crear el cierre: ${error.message}`);
    }
  };

  if (isLoading) {
    return null; 
  }

  return (
    <TemplateCrearCierre
      categorias={categoriasOptions}
      zonas={zonasOptions}
      onSubmit={handleFormSubmit}
    />
  );
}