import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Checkbox } from 'expo-checkbox';
import { ExerciseId, exercises, exercising_history } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Props {
  /**
   * This describes if the modal is visible or not and gets set from parent
   */
  visible: boolean;
  /**
   * The Exercise to be deleted
   */
  exercise: DeletableExercise;
  /**
   * This is a callback that needs to be passed by the parent<br/>
   * The callback is expected set the "visible"-boolean to false in the parent, because this is the only way this modal can "close itself"
   * @see Props.visible
   */
  closeModal: (result: ModalResult) => void;
}

export interface DeletableExercise {
  id: ExerciseId;
  name: string;
}

export type ModalResult = 'Exercise Deleted' | 'Deletion Cancelled';

type DeleteState = 'not tried' | 'show first warning' | 'make them tick the box';

export const DeleteExerciseModal = ({ visible, exercise, closeModal }: Props) => {
  const expo_db = useSQLiteContext();
  const drizzle_db = drizzle(expo_db, { schema });

  // Cleanup in every time the modal gets closed
  useEffect(() => {
    if (!visible) {
      // Reset the modals State, when we close it
      setDeleteState('not tried');
      setIsTheBoxChecked(false);
    }
  }, [visible]);

  const [deleteState, setDeleteState] = useState<DeleteState>('not tried');
  const [isTheBoxChecked, setIsTheBoxChecked] = useState<boolean>(false);

  /**
   * Handles a click to the delete button<br/>
   * Meaning it either progresses the UI-Flow or actually deletes the provided exercise
   */
  const handleDelete = async () => {
    if (deleteState === 'not tried') {
      setDeleteState('show first warning');
      return;
    }

    if (deleteState === 'show first warning') {
      setDeleteState('make them tick the box');
      return;
    }

    if (deleteState === 'make them tick the box' && !isTheBoxChecked) {
      /* If we end up here and the box is not ticked, there was an error
       * -> The Pressable should be disabled when the box is not checked
       * (This should never run, its just safety)
       */
      return;
    }

    if (deleteState === 'make them tick the box' && isTheBoxChecked) {
      await drizzle_db.delete(exercising_history).where(eq(exercising_history.exerciseId, exercise.id));
      await drizzle_db.delete(exercises).where(eq(exercises.id, exercise.id));

      // Close modal after deleting
      closeModal('Exercise Deleted');
      return;
    }

    // If we end up here we have some invalid state...
    // Reset and continue
    setDeleteState('not tried');
    setIsTheBoxChecked(false);
  };

  /**
   * Maps the current delete state to a fitting text for the button
   */
  const GetDeleteButtonText = (): string => {
    switch (deleteState) {
      default:
      case 'not tried':
        return 'Yes';

      case 'show first warning':
        return 'I am sure';

      case 'make them tick the box':
        return 'Delete it';
    }
  };
  return (
    <Modal visible={visible} transparent={true} animationType={'fade'} onRequestClose={() => closeModal('Deletion Cancelled')}>
      {/* This makes it so the modal gets closed whenever you click on the background */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => closeModal('Deletion Cancelled')} className="bg-gray-500 opacity-30" />

      {/* One transparent view as container, one view that scales relative to its container */}
      {/* flex-1 sadly does not work on modal directly */}
      <View className="flex-1 items-center justify-center">
        <View className="h-fit w-fit gap-4 rounded-3xl bg-white p-6">
          <View>
            <Text className="text-2xl font-black">Are you Sure?</Text>
            <Text>Do you really want to delete this precious exercise?</Text>
            <Text>You cant undo this.</Text>
          </View>

          <View
            className={`items-center self-center rounded-xl border-2 border-red-600 bg-red-100 p-4 ${deleteState === 'not tried' && 'hidden'}`}>
            <Text>
              <Text>You really </Text>
              <Text className="font-bold">really</Text>
              <Text> can never undo this Action</Text>
            </Text>
            <Text>Do you still want to continue?</Text>
          </View>

          <View className={`flex-row gap-2 self-center ${deleteState !== 'make them tick the box' && 'hidden'}`}>
            <Checkbox color={'#dc2626'} value={isTheBoxChecked} onValueChange={() => setIsTheBoxChecked(!isTheBoxChecked)} />
            <Text>I understand and I will not miss it</Text>
          </View>

          <View className="flex w-max flex-row justify-around gap-4 px-4">
            <Pressable
              className={`flex-1 items-center rounded-full bg-red-600 p-2 ${deleteState === 'make them tick the box' && !isTheBoxChecked && 'opacity-60'}`}
              disabled={deleteState === 'make them tick the box' && !isTheBoxChecked}
              onPress={handleDelete}>
              <Text className="font-semibold text-white">{GetDeleteButtonText()}</Text>
            </Pressable>
            <Pressable className="flex-1 items-center rounded-full bg-gray-100 p-2" onPress={() => closeModal('Deletion Cancelled')}>
              <Text className="font-semibold text-black">No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
