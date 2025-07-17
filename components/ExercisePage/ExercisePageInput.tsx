import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import { Pressable, Text, TextStyle, View } from 'react-native';

interface Props {
  displayPrecision: number;
  numberChangedCallback?: (newValue: number, isValid: boolean) => void;
  unitText?: string;
  showIncrementDecrementButtons?: boolean;
  textStyle?: TextStyle;
}

export const ExercisePageInput = ({
  displayPrecision = 2,
  numberChangedCallback,
  unitText,
  textStyle = { fontSize: 24, lineHeight: 32 } satisfies TextStyle,
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
      className={`w-full flex-row items-center rounded-md border-2 py-1 pl-1 pr-2 ${isValid ? 'border-gray-400' : 'border-red-600 bg-red-100'}`}>
      <TextInput
        className="flex-1"
        style={textStyle}
        textAlign={'right'}
        inputMode={'decimal'}
        keyboardType={'decimal-pad'}
        underlineColorAndroid={'transparent'}
        autoCorrect={false}
        selectTextOnFocus={true}
        value={input}
        onChangeText={onChange}
        onBlur={() => onSubmit(input)}
        submitBehavior={'blurAndSubmit'}
      />

      {unitText && (
        <Text className="mr-1" style={textStyle}>
          {unitText}
        </Text>
      )}

      {showIncrementDecrementButtons && (
        <IncrementDecrementButtons
          className="flex items-end"
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
      <View className="min-w-fit max-w-fit">
        <Pressable className="w-7 rounded-t-full border-2 active:opacity-60" style={{ borderBottomWidth: 1 }} onPress={onIncrement}>
          <Text className="text-center text-xl font-black">+</Text>
        </Pressable>
        <Pressable className="w-7 rounded-b-full border-2 active:opacity-60" style={{ borderTopWidth: 1 }} onPress={onDecrement}>
          <Text className="text-center text-xl font-black">—</Text>
        </Pressable>
      </View>
    </View>
  );
};
