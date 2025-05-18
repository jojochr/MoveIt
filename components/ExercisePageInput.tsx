import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';

interface Props {
  displayPrecision: number;
  numberChangedCallback?: (newValue: number) => void;
}

export const ExercisePageInput = ({ displayPrecision = 2, numberChangedCallback }: Props) => {
  const [input, setInput] = useState<string>((0).toFixed(displayPrecision));

  function onEnterText(newText: string) {
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
      onChangeText={newText => setInput(newText)}
      onBlur={() => onEnterText(input)}
    />
  );
};
