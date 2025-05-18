import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';

interface Props {
  displayPrecision: number;
  numberChangedCallback?: (newValue: number) => void;
}

export const ExercisePageInput = ({ displayPrecision = 2, numberChangedCallback }: Props) => {
  const [input, setInput] = useState<string>((0).toFixed(displayPrecision));

  /**
   * Partially validate input, so the user can not put letters or other stuff in there.
   * But don't trigger numberChangedCallback yet
   * @param newValue New string Value
   */
  function onInputChanged(newValue: string) {
    if (Number.isNaN(parseFloat(newValue))) {
      // Don't update input if its invalid
      return;
    }

    setInput(newValue);
  }

  /**
   * Parses input and triggers numberChangedCallback when user is done editing
   * @param newText Text to be parsed
   */
  function onSubmit(newText: string) {
    const asNumber = parseFloat(newText.trim());
    if (Number.isNaN(asNumber)) {
      // Don't update input if its invalid
      return;
    }

    if (numberChangedCallback) {
      numberChangedCallback(asNumber);
    }

    setInput(asNumber.toFixed(displayPrecision));
  }
  return (
    <TextInput
      className="w-full rounded-md border-2 border-gray-400 p-4 text-base"
      keyboardType={'decimal-pad'}
      underlineColorAndroid={'transparent'}
      autoCorrect={false}
      value={input}
      onChangeText={onInputChanged}
      onBlur={() => onSubmit(input)}
      submitBehavior={'blurAndSubmit'}
    />
  );
};
