const DEFAULT_MIN_LATITUDE = -20.510904917;
const DEFAULT_MAX_LATITUDE = -20.410643808;
const DEFAULT_MIN_LONGITUDE = -43.976368616;
const DEFAULT_MAX_LONGITUDE = -43.824099190;
const DEFAULT_START_DATE = new Date('2019-01-01');
const DEFAULT_END_DATE = new Date('2023-01-01');

export type MockedMeasuresType = {
    id: number;
    coordinates: number[];
    dataType: string;
    measuredAt: string;
    connection: number;
}

const getRandomCoordinate = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}
  
const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const generateMockedMeasures = ({
    minLatitude = DEFAULT_MIN_LATITUDE,
    maxLatitude = DEFAULT_MAX_LATITUDE,
    minLongitude = DEFAULT_MIN_LONGITUDE,
    maxLongitude = DEFAULT_MAX_LONGITUDE,
    startDate = DEFAULT_START_DATE,
    endDate = DEFAULT_END_DATE
}: {
    minLatitude?: number,
    maxLatitude?: number,
    minLongitude?: number,
    maxLongitude?: number,
    startDate?: Date,
    endDate?: Date
}) => {
    const data: MockedMeasuresType[] = [];

    for (let i = 1; i <= 2000; i++) {
        const id = i;
        const coordinates = [getRandomCoordinate(minLongitude, maxLongitude), getRandomCoordinate(minLatitude, maxLatitude)];
        const dataType = Math.random() < 0.5 ? "RSSI" : "Custo";
        const measuredAt = getRandomDate(startDate, endDate).toISOString();
        const connection = Math.random();

        data.push({
            id,
            coordinates,
            dataType,
            measuredAt,
            connection
        });
    }

    return data;
}
  