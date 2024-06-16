export const DEFAULT_MIN_LATITUDE = -20.510904917;
export const DEFAULT_MAX_LATITUDE = -20.410643808;
export const DEFAULT_MIN_LONGITUDE = -43.976368616;
export const DEFAULT_MAX_LONGITUDE = -43.824099190;
export const DEFAULT_END_DATE = new Date('2023-12-31');
export const DEFAULT_START_DATE = new Date('2019-01-01');
export const MAX_COST = 200;
export const MIN_COST = 0;
export const MAX_RSSI = 0;
export const MIN_RSSI = -110;

export type Measure = {
    idpeer: number;
    timestamp: string;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    macsource: string;
    macdestination: string;
    action: number;
    enabled: number;
    cost: number;
    rate: number;
    rssi: number;
    signal_ok: number;
    age: number;
    stats: number;
    encapId: number;
    ipv4Address: string;
    ip: string;
    txpower: number;
    version: number;
    linkLocalAddress: string;
}

const mockedMeasuresDefaultValues: Measure = {
    idpeer: 0,
    timestamp: "2022-03-27T15:30:00.000Z",
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 50,
    macsource: "",
    macdestination: "",
    action: 0,
    enabled: 0,
    cost: 0,
    rate: 0,
    rssi: 0,
    signal_ok: 0,
    age: 0,
    stats: 0,
    encapId: 0,
    ipv4Address: "192.168.0.1",
    ip: "192.168.0.2",
    txpower: 0,
    version: 0,
    linkLocalAddress: ""
}

const getRandomNumberInRange = (min: number, max: number) => {
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
    minCost = MIN_COST,
    maxCost = MAX_COST,
    minRssi = MIN_RSSI,
    maxRssi = MAX_RSSI,
    startDate = DEFAULT_START_DATE,
    endDate = DEFAULT_END_DATE
}: {
    minLatitude?: number,
    maxLatitude?: number,
    minLongitude?: number,
    maxLongitude?: number,
    minCost?: number,
    maxCost?: number,
    minRssi?: number,
    maxRssi?: number,
    startDate?: Date,
    endDate?: Date
}) => {
    const data: Measure[] = [];

    for (let i = 1; i <= 500; i++) {
        const timestamp = getRandomDate(startDate, endDate).toISOString();
        const longitude = getRandomNumberInRange(minLongitude, maxLongitude);
        const latitude = getRandomNumberInRange(minLatitude, maxLatitude);
        const cost = getRandomNumberInRange(minCost, maxCost);
        const rssi = getRandomNumberInRange(minRssi, maxRssi);

        data.push({
            ...mockedMeasuresDefaultValues,
            idpeer: i,
            latitude,
            longitude,
            timestamp,
            cost,
            rssi
        });
    }

    return data;
}
  