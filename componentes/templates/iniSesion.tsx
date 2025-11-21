import Boton from "@/componentes/atomos/boton";
import Input from "@/componentes/atomos/input";
import Subtitulo from "@/componentes/atomos/subtitulo";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import PrincAdmin from "@/componentes/templates/princAdmin";
import PrincSuper from "@/componentes/templates/princSuper";
import { useAuth } from "@/contexto/autenticacion";
import React, { memo, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

const API_URL = 'https://sinocc-backend.onrender.com/api';

console.log('🌐 API Configurada:', API_URL);

const IniSesion = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const { rol: rolActual } = useAuth();

  const renderPantallaPorRol = () => {
    if (rolActual === "superadmin") {
      return <PrincSuper />;
    }
    if (rolActual === "administrador") {
      return <PrincAdmin />;
    }
    return null;
  };

  const handleIniciarSesion = async () => {
    if (!correo.trim()) {
      Alert.alert("Validación", "Por favor ingresa tu correo electrónico");
      return;
    }

    if (!contrasena.trim()) {
      Alert.alert("Validación", "Por favor ingresa tu contraseña");
      return;
    }

    setCargando(true);

    try {
      console.log("Iniciando sesión...");
      console.log("Correo:", correo);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          contrasena,
          tokenDispositivo: "expo-token-temp",
          plataforma: "android",
        }),
      });

      const datos = await response.json();

      console.log("Respuesta recibida:", JSON.stringify(datos, null, 2));

      if (datos.exito && datos.datos) {
        const { rol, nombre, apellido, token } = datos.datos;

        if (!rol) {
          Alert.alert("Error", "El servidor no devolvió un rol de usuario.");
          return;
        }
        await login(token, rol.toLowerCase());

        console.log("Login exitoso con rol:", rol);

        Alert.alert(
          "Bienvenido",
          `Hola ${nombre || "Usuario"} ${apellido || ""}\nRol: ${rol}`,
          [
            {
              text: "Continuar",
              onPress: () => {
              },
            },
          ]
        );

        setCorreo("");
        setContrasena("");

      } else {
        console.log("Error:", datos.mensaje);
        Alert.alert(
          "Error de Autenticación",
          datos.mensaje || "Credenciales incorrectas"
        );
      }

    } catch (error: any) {
      console.error("Error de conexión:", error);
      Alert.alert(
        "Error de Conexión",
        `No se pudo conectar con el servidor.\n\nDetalles: ${error.message}`,
        [{ text: "Entendido" }]
      );
    } finally {
      setCargando(false);
    }
  };

  if (rolActual === "superadmin" || rolActual === "administrador") {
    return renderPantallaPorRol();
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderSimple onPressRoute="/" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Subtitulo style={styles.subtitulo}>Email</Subtitulo>
            <Input
              placeholder="Ingresa tu correo"
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!cargando}
            />
          </View>

          <View style={styles.inputContainer}>
            <Subtitulo style={styles.subtitulo}>Contraseña</Subtitulo>
            <Input
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              style={styles.input}
              value={contrasena}
              onChangeText={setContrasena}
              editable={!cargando}
            />
          </View>

          <Boton
            texto={cargando ? "Conectando..." : "Iniciar Sesión"}
            onPress={handleIniciarSesion}
            variante="primario"
            tamaño="grande"
            ancho="completo"
            estilo={styles.button}
          />

          {cargando && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>
                Autenticando con el servidor...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 15,
    paddingHorizontal: 16,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 20,
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 150,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 55,
  },
  input: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 18,
    height: 50,
  },
  button: {
    marginTop: 120,
  },
  subtitulo: {
    marginBottom: 5,
    color: "#151717",
    fontSize: 16.2,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
});
export default memo(IniSesion);
