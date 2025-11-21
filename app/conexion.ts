import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

const obtenerApiUrl = () => { 
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(':')[0]; // toma la IP antes del puerto
      return `http://${ip}:3000/api`; // ⚠️ cambia el puerto si tu backend usa otro
    }
  } catch (error) {
    console.warn('No se pudo detectar la IP local automáticamente.');
  }

  // Fallback en caso de que no detecte la IP
  return 'http://localhost:3000/api';
};

const API_URL = obtenerApiUrl();

console.log('🌐 API detectada automáticamente:', API_URL);
interface RespuestaLogin {
  exito: boolean;
  mensaje: string;
  datos?: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    token: string;
  };
  errores?: any[];
}

interface RespuestaPerfil {
  exito: boolean;
  mensaje: string;
  datos?: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
}

class AutenticacionServicio {
  /**
   * Inicia sesión con correo y contraseña
   */
  async login(correo: string, contrasena: string): Promise<RespuestaLogin> {
    try {
      console.log('🔄 Intentando conexión con:', API_URL);
      
      const tokenDispositivo = await this.obtenerTokenDispositivo();
      const plataforma = Device.osName?.toLowerCase() || 'android';

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          contrasena,
          tokenDispositivo,
          plataforma,
        }),
      });

      const datos: RespuestaLogin = await response.json();

      console.log('📨 Respuesta del backend:', JSON.stringify(datos, null, 2));

      if (!response.ok) {
        return {
          exito: false,
          mensaje: datos.mensaje || 'Error en el inicio de sesión',
          errores: datos.errores,
        };
      }

      // Guardar token y datos del usuario
      if (datos.datos?.token) {
        await AsyncStorage.setItem('token', datos.datos.token);
        await AsyncStorage.setItem('usuario', JSON.stringify(datos.datos));
        console.log('✅ Token guardado correctamente');
      }

      return datos;
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      return {
        exito: false,
        mensaje: error.message || 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Registra un nuevo usuario común
   */
  async registro(
    nombre: string,
    apellido: string
  ): Promise<RespuestaLogin> {
    try {
      console.log('🔄 Registrando nuevo usuario...');
      
      const tokenDispositivo = await this.obtenerTokenDispositivo();
      const plataforma = Device.osName?.toLowerCase() || 'android';

      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          tokenDispositivo,
          plataforma,
        }),
      });

      const datos: RespuestaLogin = await response.json();

      console.log('📨 Respuesta del backend:', JSON.stringify(datos, null, 2));

      if (!response.ok) {
        return {
          exito: false,
          mensaje: datos.mensaje || 'Error en el registro',
          errores: datos.errores,
        };
      }

      // Guardar token y datos del usuario
      if (datos.datos?.token) {
        await AsyncStorage.setItem('token', datos.datos.token);
        await AsyncStorage.setItem('usuario', JSON.stringify(datos.datos));
      }

      return datos;
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      return {
        exito: false,
        mensaje: error.message || 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async obtenerPerfil(): Promise<RespuestaPerfil> {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        return {
          exito: false,
          mensaje: 'No hay sesión activa',
        };
      }

      const response = await fetch(`${API_URL}/auth/perfil`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const datos: RespuestaPerfil = await response.json();

      if (!response.ok) {
        return {
          exito: false,
          mensaje: datos.mensaje || 'Error al obtener perfil',
        };
      }

      return datos;
    } catch (error: any) {
      console.error('❌ Error en obtenerPerfil:', error);
      return {
        exito: false,
        mensaje: error.message || 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Cierra la sesión actual
   */
  async cerrarSesion(): Promise<void> {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }

  /**
   * Verifica si hay una sesión activa
   */
  async estaAutenticado(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene el token almacenado
   */
  async obtenerToken(): Promise<string | null> {
    try {
      // Buscar primero en la clave usada por AuthProvider
      let token = await AsyncStorage.getItem('userToken');

      // Si no existe, probar con la vieja clave (por compatibilidad)
      if (!token) {
        token = await AsyncStorage.getItem('token');
      }

      return token;
    } catch (error) {
      console.error("❌ Error al obtener el token:", error);
      return null;
    }
  }

  /**
   * Obtiene los datos del usuario almacenados
   */
  async obtenerUsuario(): Promise<any> {
    try {
      const usuarioJSON = await AsyncStorage.getItem('usuario');
      return usuarioJSON ? JSON.parse(usuarioJSON) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Genera o obtiene un token de dispositivo único
   */
  private async obtenerTokenDispositivo(): Promise<string> {
    try {
      let tokenGuardado = await AsyncStorage.getItem('tokenDispositivo');
      
      if (!tokenGuardado) {
        // Generar un token único si no existe
        tokenGuardado = `ExponentPushToken[${this.generarIdUnico()}]`;
        await AsyncStorage.setItem('tokenDispositivo', tokenGuardado);
      }
      
      return tokenGuardado;
    } catch (error) {
      return `ExponentPushToken[default]`;
    }
  }

  /**
   * Genera un ID único para el dispositivo
   */
  private generarIdUnico(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  async crearAdministrador(
    nombre: string,
    apellido: string,
    correo: string,
    contrasena: string
  ): Promise<{ exito: boolean; mensaje: string }> {
    try {
      const token = await this.obtenerToken();
      if (!token) {
        return { exito: false, mensaje: "No hay sesión activa del SuperAdmin" };
      }

      const response = await fetch(`${API_URL}/usuarios/administrador`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          contrasena,
        }),
      });

      const datos = await response.json();

      if (!response.ok) {
        return { exito: false, mensaje: datos.mensaje || "Error al crear el administrador" };
      }

      return { exito: true, mensaje: datos.mensaje || "Administrador creado exitosamente" };
    } catch (error) {
      console.error("❌ Error en crearAdministrador:", error);
      return { exito: false, mensaje: "Error de conexión con el servidor" };
    }
  }

  /**
   * Obtener lista de administradores (solo SuperAdmin)
   */
  async obtenerAdministradores(): Promise<any[]> {
    try {
      const token = await this.obtenerToken();
      if (!token) {
        console.warn("⚠️ No hay sesión activa del SuperAdmin");
        return [];
      }

      const response = await fetch(`${API_URL}/usuarios?rol=administrador`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const datos = await response.json();

      if (!response.ok || !datos.exito) {
        console.warn("⚠️ Error al obtener administradores:", datos.mensaje);
        return [];
      }

      return datos.datos || [];
    } catch (error) {
      console.error("❌ Error en obtenerAdministradores:", error);
      return [];
    }
  }

  /**
   * Eliminar un administrador (solo SuperAdmin)
   */
  async eliminarAdministrador(id: string): Promise<{ exito: boolean; mensaje: string }> {
    try {
      const token = await this.obtenerToken();
      if (!token) {
        return { exito: false, mensaje: "No hay sesión activa del SuperAdmin" };
      }

      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const datos = await response.json();

      if (!response.ok) {
        return { exito: false, mensaje: datos.mensaje || "Error al eliminar el administrador" };
      }

      return { exito: true, mensaje: datos.mensaje || "Administrador eliminado correctamente" };
    } catch (error) {
      console.error("❌ Error en eliminarAdministrador:", error);
      return { exito: false, mensaje: "Error de conexión con el servidor" };
    }
  }

 async obtenerAdministradorPorId(id: string) {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No hay sesión activa del SuperAdmin');

    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const datos = await response.json();
    console.log("📦 Datos del backend:", datos);

    if (!response.ok) {
      throw new Error(datos.mensaje || 'Error al obtener usuario');
    }

    // El backend devuelve el usuario directamente en "datos"
    return datos.datos;
  } catch (error) {
    console.error('❌ Error en obtenerAdministradorPorId:', error);
    throw error;
  }
}

/**
 * Edita los datos de un administrador existente
 */
async editarAdministrador(id: string, datosActualizados: any) {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No hay sesión activa del SuperAdmin');

    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosActualizados),
    });

    const datos = await response.json();

    if (!response.ok) {
      return { exito: false, mensaje: datos.mensaje || 'Error al editar el usuario' };
    }

    return { exito: true, mensaje: 'Administrador actualizado correctamente' };
  } catch (error: any) {
    console.error('❌ Error en editarAdministrador:', error);
    return { exito: false, mensaje: error.message || 'Error al editar usuario' };
  }
}

}

export default new AutenticacionServicio();