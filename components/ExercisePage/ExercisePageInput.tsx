import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
  displayPrecision: number;
  numberChangedCallback?: (newValue: number, isValid: boolean) => void;
  unitText?: string;
}

export const ExercisePageInput = ({ displayPrecision = 2, numberChangedCallback, unitText }: Props) => {
  const [input, setInput] = useState<string>((0).toFixed(displayPrecision));
  const [isValid, setIsValid] = useState(true);

  /**
   * Parses input and triggers numberChangedCallback when user is done editing
   * @param newText Text to be parsed
   */
  function onChange(newText: string) {
    const asNumber = parseFloat(newText.trim());

    const isValid: boolean = !Number.isNaN(asNumber) && /^[0-9,.]+$/.test(newText);

    setInput(newText);
    setIsValid(isValid);
    if (numberChangedCallback) numberChangedCallback(asNumber, isValid);
  }

  /**
   * This method just makes it look a little nicer on submit, if the number is actually valid
   */
  function prettify() {
    const asNumber = parseFloat(input.trim());

    if (Number.isNaN(asNumber)) return;
    setInput(asNumber.toFixed(displayPrecision));
    setIsValid(true);
    if (numberChangedCallback) numberChangedCallback(asNumber, true);
  }

  return (
    <View
      className={`w-full flex-row items-center rounded-md border-2 px-4 py-1 ${isValid ? 'border-gray-400' : 'border-red-600 bg-red-100'}`}>
      <TextInput
        inputMode={'decimal'}
        keyboardType={'decimal-pad'}
        underlineColorAndroid={'transparent'}
        autoCorrect={false}
        value={input}
        onChangeText={onChange}
        onBlur={() => prettify()}
        submitBehavior={'blurAndSubmit'}
      />

      {unitText && <Text>{unitText}</Text>}
    </View>
  );
};
