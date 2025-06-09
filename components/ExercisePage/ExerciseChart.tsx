import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import { Text, View } from 'react-native';
import { ExerciseId } from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';

export interface Props {
  exerciseID: ExerciseId;
  ChartType: ChartType;
}

export type ChartType = 'this week' | 'all data' | 'no chart';

export const ExerciseChart = ({ exerciseID, ChartType }: Props) => {
  switch (ChartType) {
    case 'this week':
      return <Text>This Weeks chart is to be created here</Text>;
    case 'all data':
      return <AllDataChart exerciseID={exerciseID} />;
    case 'no chart':
      return <Text>No Chart this is debug</Text>;
  }
};

function AllDataChart({ exerciseID }: { exerciseID: ExerciseId }) {
  const db = drizzle(useSQLiteContext(), { schema });

  const { data: chartData } = useLiveQuery(
    db.query.exercising_history.findMany({
      columns: {
        date: true,
        maxWeight: true,
        repetitions: true,
      },
      where: (exercising_history, { eq }) => eq(exercising_history.exerciseId, exerciseID),
      orderBy: (exercising_history, { asc }) => asc(exercising_history.date),
    })
  );

  const weightLine = chartData.map(data => ({ value: data.maxWeight }) satisfies lineDataItem);
  const repetitionsLine = chartData.map(data => ({ value: data.repetitions }) satisfies lineDataItem);

  return (
    <View>
      <LineChart
        data={weightLine}
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
}
