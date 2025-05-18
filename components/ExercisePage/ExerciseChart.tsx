import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import { View } from 'react-native';

interface Props {
  className?: string;
  maxWeightDataPoints: number[];
  repetitionDataPoints: number[];
}

export const ExerciseChart = ({ className, maxWeightDataPoints, repetitionDataPoints }: Props) => {
  const maxWeightLine = maxWeightDataPoints.map(number => {
    return { value: number, dataPointText: number.toString() } satisfies lineDataItem;
  });

  const repetitionsLine = repetitionDataPoints.map(number => {
    return { value: number, dataPointText: number.toString() } satisfies lineDataItem;
  });

  return (
    <View className={(className ?? '') + ''}>
      <LineChart
        data={maxWeightLine}
        color1="pink"
        textColor1="black"
        data2={repetitionsLine}
        color2="darkblue"
        textColor2="black"
        dataPointsWidth={6}
        dataPointsHeight={6}
        dataPointsColor1="red"
        dataPointsColor2="lightblue"
        textShiftY={-2}
        textShiftX={-5}
        textFontSize={13}
      />
    </View>
  );
};
