import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ClassBookingProvider, useClassBookingContext } from './context/ClassBookingContext';
import { getRemainingCapacity, getUserReservations } from './utils/classBooking';

const getDayLabel = (diaOffset: number): string => {
  if (diaOffset === 0) return 'Hoy';
  if (diaOffset === 1) return 'Mañana';
  if (diaOffset === 2) return 'Pasado mañana';
  return `En ${diaOffset} días`;
};

function BookingScreen() {
  const { classes, bookings, message, profile, bookClassForUser, cancelClassForUser, clearMessage } =
    useClassBookingContext();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'reservations'>('upcoming');
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const upcomingClasses = classes.filter((item) => item.diaOffset <= 2);

  const myReservations = useMemo(
    () => getUserReservations({ bookings, classes, userId: profile.id }),
    [bookings, classes, profile.id],
  );

  const selectedClass = selectedReservation
    ? classes.find((item) => item.id === selectedReservation) ?? null
    : null;

  const openCancellationModal = (classId: string) => {
    setSelectedReservation(classId);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmCancellation = () => {
    if (!selectedClass) {
      setIsConfirmModalVisible(false);
      return;
    }

    cancelClassForUser(selectedClass);
    setIsConfirmModalVisible(false);
    setSelectedReservation(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>ClaseFit</Text>
        <Text style={styles.subtitle}>{profile.nombre}</Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabButton, activeTab === 'upcoming' && styles.tabButtonActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Próximas clases
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'reservations' && styles.tabButtonActive]}
          onPress={() => setActiveTab('reservations')}
        >
          <Text style={[styles.tabText, activeTab === 'reservations' && styles.tabTextActive]}>
            Mis reservas
          </Text>
        </Pressable>
      </View>

      {message ? (
        <View style={[styles.messageBox, message.type === 'error' ? styles.messageBoxError : styles.messageBoxSuccess]}>
          <Text style={[styles.messageText, message.type === 'error' ? styles.messageTextError : styles.messageTextSuccess]}>
            {message.text}
          </Text>
          <Pressable onPress={clearMessage} style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      ) : null}

      {activeTab === 'upcoming' ? (
        <ScrollView contentContainerStyle={styles.list}>
          {upcomingClasses.map((classItem) => {
            const remainingCapacity = getRemainingCapacity(classItem, bookings);
            const isSoldOut = remainingCapacity <= 0;

            return (
              <View key={classItem.id} style={styles.classCard}>
                <View style={styles.classMetaRow}>
                  <Text style={styles.className}>{classItem.nombre}</Text>
                  <Text style={styles.dayLabel}>{getDayLabel(classItem.diaOffset)}</Text>
                </View>

                <Text style={styles.classInfo}>{classItem.instructor}</Text>
                <Text style={styles.classInfo}>{classItem.hora}</Text>
                <Text style={styles.capacityText}>
                  {isSoldOut ? 'Llena' : `${remainingCapacity} de ${classItem.cupoTotal} cupos`}
                </Text>

                <Pressable
                  onPress={() => bookClassForUser(classItem)}
                  style={[styles.reserveButton, isSoldOut && styles.reserveButtonDisabled]}
                  disabled={isSoldOut}
                >
                  <Text style={styles.reserveButtonText}>{isSoldOut ? 'Llena' : 'Reservar'}</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {myReservations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aún no tienes reservas</Text>
            </View>
          ) : (
            myReservations.map((classItem) => (
              <View key={classItem.id} style={styles.classCard}>
                <View style={styles.classMetaRow}>
                  <Text style={styles.className}>{classItem.nombre}</Text>
                  <Text style={styles.dayLabel}>{getDayLabel(classItem.diaOffset)}</Text>
                </View>

                <Text style={styles.classInfo}>{classItem.instructor}</Text>
                <Text style={styles.classInfo}>{classItem.hora}</Text>
                <Text style={styles.classInfo}>{classItem.duracionMin} min</Text>

                <Pressable onPress={() => openCancellationModal(classItem.id)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal transparent visible={isConfirmModalVisible} animationType="slide" onRequestClose={() => setIsConfirmModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar cancelación</Text>
            <Text style={styles.modalText}>
              {selectedClass ? `¿Deseas cancelar la reserva de ${selectedClass.nombre}?` : '¿Deseas cancelar esta reserva?'}
            </Text>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setIsConfirmModalVisible(false)} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Volver</Text>
              </Pressable>
              <Pressable onPress={handleConfirmCancellation} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ClassBookingProvider>
      <BookingScreen />
    </ClassBookingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c2230',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#556072',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#e8edf8',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#d9e6ff',
  },
  tabText: {
    color: '#3d4c62',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1f4d78',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  classMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c2230',
  },
  dayLabel: {
    fontSize: 14,
    color: '#4462b3',
    fontWeight: '600',
  },
  classInfo: {
    marginTop: 8,
    fontSize: 15,
    color: '#3d4c62',
  },
  capacityText: {
    marginTop: 10,
    fontSize: 15,
    color: '#0d8f5c',
    fontWeight: '600',
  },
  reserveButton: {
    marginTop: 14,
    backgroundColor: '#2f6fed',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reserveButtonDisabled: {
    backgroundColor: '#bec7d9',
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelButton: {
    marginTop: 14,
    backgroundColor: '#d64b4b',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyState: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#3d4c62',
    fontSize: 18,
    fontWeight: '600',
  },
  messageBox: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  messageBoxSuccess: {
    backgroundColor: '#eaf5ee',
    borderColor: '#bfdcc9',
  },
  messageBoxError: {
    backgroundColor: '#fdecec',
    borderColor: '#f4c2c2',
  },
  messageText: {
    fontWeight: '600',
    marginBottom: 8,
  },
  messageTextSuccess: {
    color: '#1d5f3b',
  },
  messageTextError: {
    color: '#b42318',
  },
  messageButton: {
    alignSelf: 'flex-end',
  },
  messageButtonText: {
    color: '#1f4d78',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c2230',
    marginBottom: 8,
  },
  modalText: {
    color: '#3d4c62',
    fontSize: 16,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#d64b4b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#edf2f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#1f4d78',
    fontWeight: '700',
  },
});
