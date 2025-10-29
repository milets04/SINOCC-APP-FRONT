import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

  // NUEVO: Reiniciar al mes actual cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setCurrentMonth(new Date());
    }
  }, [visible]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

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
    selected.setHours(0, 0, 0, 0);
    
    const minDate = new Date(minimumDate);
    minDate.setHours(0, 0, 0, 0);
    
    if (selected < minDate) {
      return;
    }

    const formattedDate = selected.toISOString().split('T')[0];
    onSelectDate(formattedDate);
    onClose();
  };

  const isDateDisabled = (day: number | null) => {
    if (day === null) return true;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    
    const minDate = new Date(minimumDate);
    minDate.setHours(0, 0, 0, 0);
    
    return date < minDate;
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

  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const days = getDaysInMonth(currentMonth);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalBackdrop}>
        <Pressable 
          style={styles.backdropPress}
          onPress={onClose}
        />
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Navegación de mes */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity 
              onPress={handlePreviousMonth} 
              style={styles.navButton}
            >
              <Text style={styles.navIcon}>{'<'}</Text>
            </TouchableOpacity>
            
            <Text style={styles.monthText}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            
            <TouchableOpacity 
              onPress={handleNextMonth} 
              style={styles.navButton}
            >
              <Text style={styles.navIcon}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          {/* Nombres de los días */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((name, index) => (
              <View key={index} style={styles.dayNameCell}>
                <Text style={styles.dayName}>{name}</Text>
              </View>
            ))}
          </View>

          {/* Grid de días */}
          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              const disabled = isDateDisabled(day);
              const selected = isSelectedDate(day);

              return (
                <TouchableOpacity
                  key={`day-${index}`}
                  style={[
                    styles.dayCell,
                    selected && styles.selectedDay,
                    disabled && styles.disabledDay,
                  ]}
                  onPress={() => day && !disabled && handleSelectDay(day)}
                  disabled={disabled || day === null}
                  activeOpacity={0.7}
                >
                  {day !== null && (
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropPress: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  closeIcon: {
    fontSize: 20,
    color: '#666666',
    fontWeight: 'bold',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  navIcon: {
    fontSize: 20,
    color: '#146BF6',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayNameCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  dayCell: {
    width: '14.28%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  selectedDay: {
    backgroundColor: '#146BF6',
    borderRadius: 22.5,
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disabledDayText: {
    color: '#CCCCCC',
  },
});

export default CalendarioPersonalizado;