import { KeyboardAvoidingView, Pressable, Text, View, StyleSheet, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

const CreateExerciseModal = ({ visible, closeModal }: Props) => {
  let exerciseName: string = '';
  const [nameIsValid, setNameIsValid] = useState<boolean>(false);

  /**
   * Todo: Actually do stuff in database
   * - Check if exercise with same name exists
   * - Run insert statement
   * - Check if this works with my existing drawer
   * - Rerun query in drawer if needed
   */

  return (
    <Modal visible={visible} transparent={true} animationType={'fade'} onRequestClose={closeModal}>
      {/* This makes it so the modal gets closed whenever you click on the background */}
      <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} className="bg-gray-500 opacity-30" />

      {/* One transparent view as container, one view that scales relative to its container */}
      {/* flex-1 sadly does not work on modal directly */}
      <View className="flex-1 items-center justify-center">
        <View className="h-fit w-10/12 gap-4 rounded-md bg-white p-4">
          <Text className="text-xl font-bold">Create New Exercise</Text>

          <ExerciseNameInput
            NewNameHook={(newName, newNameValid) => {
              // Do this without useState, because we don't want to rerender here
              exerciseName = newName;
              // Absolutely use useState here, because we might need to disable button
              setNameIsValid(newNameValid);
            }}
          />

          <View className="flex-row items-center justify-center gap-5">
            <Pressable
              className="flex flex-row items-center justify-center gap-2 rounded-md bg-blue-500 p-2 pr-3 transition-colors hover:bg-blue-600"
              disabled={!nameIsValid}
              onPress={() => {
                console.log(`New Name would have been: "${exerciseName}"`);
              }}>
              <Feather name="check" size={24} color="black" />
              <Text> Submit</Text>
            </Pressable>
            <Pressable
              className="flex flex-row items-center justify-center gap-2 rounded-md bg-gray-300 p-2 pr-3 transition-colors hover:bg-gray-500"
              onPress={closeModal}>
              <Feather name="x" size={24} color="black" />
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface NameInputProps {
  NewNameHook?: (newName: string, newNameValid: boolean) => void;
}

/**
 * All possible Errors will be defined here<br/>
 * Object Key ist the Error ID, string-value is the error Message
 */
interface NameInputErrors {
  TooLong?: string;
  InvalidCharacters?: string;
}

/**
 * This is a custom input field with validation and error display<br/>
 * @param NewNameHook A Function that gets called every time the value changes
 * @constructor
 */
const ExerciseNameInput = ({ NewNameHook }: NameInputProps) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<NameInputErrors>({});
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  useEffect(() => setHasErrors(Object.keys(errors).length !== 0), [errors]);

  function onChangeName(newName: string) {
    newName = newName.trimStart();
    setName(newName);
    newName = newName.trimEnd(); // TrimEnd after setting the state, or else everytime you typed a space for to begin the second word, it would be trimmed instantly

    const nameIsOkay = validateName(newName);

    if (NewNameHook) {
      NewNameHook(newName, nameIsOkay);
    }
  }

  /**
   * Validates the name and renders validation errors
   * @param name The name to be validated
   * @returns A bool indicating if the name is valid. True means valid
   */
  function validateName(name: string): boolean {
    if (name.length === 0) {
      // Don't throw errors yet, the user has not even put anything in
      setErrors({});
      // But still return invalid, because we should not be able to save this
      return false;
    }

    let errors: NameInputErrors = {};

    if (name.length > 26) errors.TooLong = 'Should be shorter than 25 characters';
    if (!/^[A-Za-z\s]+$/.test(name)) errors.InvalidCharacters = 'Only characters from a-Z are allowed';

    setErrors(errors);

    // If we did not attach any errors we are good :)
    return Object.keys(errors).length === 0;
  }

  return (
    <KeyboardAvoidingView>
      <Text className="text-sm text-gray-500">Name</Text>
      <TextInput
        className="w-full rounded-md border-2"
        style={{
          borderColor: hasErrors ? '#dc2626' : '#000',
          backgroundColor: hasErrors ? '#fee2e2' : 'transparent',
        }}
        autoCorrect={false}
        autoFocus={true}
        autoCapitalize={'words'}
        inputMode={'text'}
        placeholder={'e.g. Squats'}
        value={name}
        onChangeText={onChangeName}
      />

      {/* Maybe show a nice error icon or style this some more */}
      {Object.keys(errors).map((key, index) => (
        <Text className="text-xs" style={{ color: '#dc2626' }} key={`exercise-creator-name-error-${index}`}>
          - {(errors as any)[key]}
        </Text>
      ))}
    </KeyboardAvoidingView>
  );
};

export default CreateExerciseModal;
