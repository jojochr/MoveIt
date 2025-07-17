import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  displayPrecision: number;
  numberChangedCallback?: (newValue: number, isValid: boolean) => void;
  unitText?: string;
  showIncrementDecrementButtons?: boolean;
}

export const ExercisePageInput = ({
  displayPrecision = 2,
  numberChangedCallback,
  unitText,
  showIncrementDecrementButtons = true,
}: Props) => {
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
  function onSubmit(input: string) {
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
        onBlur={() => onSubmit(input)}
        submitBehavior={'blurAndSubmit'}
      />

      {unitText && <Text>{unitText}</Text>}

      {showIncrementDecrementButtons && (
        <IncrementDecrementButtons
          className="flex flex-1 items-end"
          onIncrement={() => {
            onSubmit(OperateIfNumber(input, { type: 'Increment' }));
          }}
          onDecrement={() => {
            onSubmit(OperateIfNumber(input, { type: 'Decrement' }));
          }}
        />
      )}
    </View>
  );
};

type Operations = { type: 'Increment' } | { type: 'Decrement' };

function OperateIfNumber(inputStr: string, operation: Operations): string {
  const asNumber = parseFloat(inputStr.trim());
  if (Number.isNaN(asNumber)) return inputStr;

  switch (operation.type) {
    case 'Increment':
      return (asNumber + 1).toString();
    case 'Decrement':
      return (asNumber - 1).toString();
  }
}

export const IncrementDecrementButtons = ({
  onIncrement,
  onDecrement,
  className = '',
}: {
  className?: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) => {
  return (
    <View className={className}>
      <View className="w-fit">
        <Pressable onPress={onIncrement} className="rounded-t-full border-2 px-2" style={{ borderBottomWidth: 1 }}>
          <Text className="text-center text-2xl font-black">+</Text>
        </Pressable>
        <Pressable onPress={onDecrement} className="rounded-b-full border-2" style={{ borderTopWidth: 1 }}>
          <Text className="text-center text-2xl font-black">—</Text>
        </Pressable>
      </View>
    </View>
  );
};
