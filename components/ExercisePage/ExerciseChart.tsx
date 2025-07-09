import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import { View } from 'react-native';

export interface Props {
  className?: string;
  historyData: HistoryData[];
}

export interface HistoryData {
  timeOfRecord?: Date;
  weightData: number;
  repetitionData: number;
}

export const ExerciseChart = ({ className, historyData }: Props) => {
  const maxWeightLine = historyData.map(histEntry => {
    return {
      value: histEntry.weightData,
      dataPointText: histEntry.weightData.toString(),
      label: histEntry.timeOfRecord?.toString(),
    } satisfies lineDataItem;
  });

  const repetitionsLine = historyData.map(histEntry => {
    return {
      value: histEntry.repetitionData,
      dataPointText: histEntry.repetitionData.toString(),
    } satisfies lineDataItem;
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
