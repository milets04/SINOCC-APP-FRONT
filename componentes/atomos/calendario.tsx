import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarioPersonalizadoProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate?: string;
  minimumDate?: Date;
  title?: string;
}

const CalendarioPersonalizado: React.FC<CalendarioPersonalizadoProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
  minimumDate = new Date(),
  title = 'Seleccionar fecha',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Agregar días vacíos antes del primer día del mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Agregar todos los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Validar fecha mínima
    if (minimumDate && selected < minimumDate) {
      return;
    }

    const formattedDate = selected.toISOString().split('T')[0];
    onSelectDate(formattedDate);
    onClose();
  };

  const isDateDisabled = (day: number | null) => {
    if (day === null) return true;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return minimumDate && date < minimumDate;
  };

  const isSelectedDate = (day: number | null) => {
    if (!day || !selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate === selectedDate;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = getDaysInMonth(currentMonth);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Navegación de mes */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color="#146BF6" />
            </TouchableOpacity>
            
            <Text style={styles.monthText}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color="#146BF6" />
            </TouchableOpacity>
          </View>

          {/* Nombres de los días */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((name, index) => (
              <Text key={index} style={styles.dayName}>
                {name}
              </Text>
            ))}
          </View>

          {/* Grid de días */}
          <ScrollView style={styles.daysContainer}>
            <View style={styles.daysGrid}>
              {days.map((day, index) => {
                const disabled = isDateDisabled(day);
                const selected = isSelectedDate(day);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      selected && styles.selectedDay,
                      disabled && styles.disabledDay,
                    ]}
                    onPress={() => day && !disabled && handleSelectDay(day)}
                    disabled={disabled || day === null}
                  >
                    {day && (
                      <Text
                        style={[
                          styles.dayText,
                          selected && styles.selectedDayText,
                          disabled && styles.disabledDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 5,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  daysContainer: {
    maxHeight: 300,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 días
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  selectedDay: {
    backgroundColor: '#146BF6',
    borderRadius: 20,
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '600',
  },
  disabledDayText: {
    color: '#CCC',
  },
});

export default CalendarioPersonalizado;