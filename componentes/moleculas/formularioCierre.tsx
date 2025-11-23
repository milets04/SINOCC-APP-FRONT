
const getTodayNormalized = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return today;
};

const parseISODate = (dateString: string): Date => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return getTodayNormalized(); 
  }
  const parts = dateString.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
};

const calcularNivelCierre = (
  fechaInicio: string,
  horaInicio: string,
  fechaFin: string,
  horaFin: string
): { nivel: 'Bajo' | 'Medio' | 'Alto' | null; horas: number; dias: number; error: string | null } => {
  
  if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
    return { nivel: null, horas: 0, dias: 0, error: 'Faltan datos de fecha u hora' };
  }

  try {
    // Combinar fecha y hora
    const inicio = new Date(`${fechaInicio}T${horaInicio}:00`);
    const fin = new Date(`${fechaFin}T${horaFin}:00`);

    // Validar que las fechas sean válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return { nivel: null, horas: 0, dias: 0, error: 'Fechas u horas inválidas' };
    }

    // Calcular diferencia en milisegundos
    const diferenciaMs = fin.getTime() - inicio.getTime();
    
    // Validar que la fecha/hora fin sea posterior a la de inicio
    if (diferenciaMs <= 0) {
      return { nivel: null, horas: 0, dias: 0, error: 'La fecha/hora de fin debe ser posterior a la de inicio' };
    }

    // Convertir a horas y días
    const horas = diferenciaMs / (1000 * 60 * 60);
    const dias = horas / 24;

    // Validar duración mínima de 1 hora
    if (horas < 1) {
      return { nivel: null, horas, dias, error: 'El cierre debe tener una duración mínima de 1 hora' };
    }

    // Determinar nivel según las reglas
    // Bajo: 1 hora a 24 horas (1 día)
    // Medio: más de 24 horas hasta 144 horas (6 días)
    // Alto: más de 144 horas (más de 6 días)
    let nivel: 'Bajo' | 'Medio' | 'Alto';
    
    if (horas >= 1 && horas <= 24) {
      nivel = 'Bajo';
    } else if (horas > 24 && horas <= 144) { // 144 horas = 6 días
      nivel = 'Medio';
    } else {
      nivel = 'Alto';
    }

    return { nivel, horas, dias, error: null };
    
  } catch (error) {
    console.error('Error al calcular nivel:', error);
    return { nivel: null, horas: 0, dias: 0, error: 'Error al calcular el nivel del cierre' };
  }
};
