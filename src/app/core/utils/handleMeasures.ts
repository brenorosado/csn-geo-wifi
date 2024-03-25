import { MockedMeasuresType } from "./generateMockedMeasures";

const GOOD_CONNECTION_INFERIOR_LIMIT = 0.8;
const REGULAR_CONNECTION_INFERIOR_LIMIT = 0.5;

export type GatheredMockedMeasures = {
    id: number;
    averageCoordinates: [number, number],
    averageConnection: number,
    measures: MockedMeasuresType[]
}

export type ClassifiedGatheredMeasures = {
    goodConnectionsCoordinates: number[][][],
    regularConnectionsCoordinates: number[][][],
    badConnectionsCoordinates: number[][][]
}

const calculateAverageCoordinatesAndConnection = (
    measures: MockedMeasuresType[]
): {
    averageCoordinates: [number, number],
    averageConnection: number
} => {
    let accumulatedLatitude = 0;
    let accumulatedLongitude = 0;
    let accumulatedConnection = 0;

    measures.forEach(({ coordinates, connection }) => {
        accumulatedLatitude += coordinates[0];
        accumulatedLongitude += coordinates[1];
        accumulatedConnection += connection;
    });

    return {
        averageCoordinates: [
            accumulatedLatitude / measures.length,
            accumulatedLongitude / measures.length
        ],
        averageConnection: accumulatedConnection / measures.length
    }
}

export const gatherCloseMeasures = (
    measures: MockedMeasuresType[],
    precision: number
): ClassifiedGatheredMeasures => {
    const gatheredMeasures: GatheredMockedMeasures[] = [];

    measures.forEach((measure) => {
        const { coordinates } = measure;
        let gathered = false;

        for (let i = 0; i < gatheredMeasures.length; i++) {
            const { averageCoordinates } = gatheredMeasures[i];

            const distance = Math.sqrt(
                Math.pow(coordinates[0] - averageCoordinates[0], 2) +
                Math.pow(coordinates[1] - averageCoordinates[1], 2)
            );

            if (distance <= (2 * precision / Math.sqrt(2))) {
                const newMeasures = [...gatheredMeasures[i].measures, measure];
                gatheredMeasures[i] = {
                    ...gatheredMeasures[i],
                    measures: newMeasures,
                    ...calculateAverageCoordinatesAndConnection(newMeasures)
                }
                gathered = true;
                break;
            }
        }

        if (!gathered) {
            gatheredMeasures.push({
                id: gatheredMeasures.length + 1,
                measures: [measure],
                ...calculateAverageCoordinatesAndConnection([measure])
            });
        }
    });

    return classifyGatheredMeasures(gatheredMeasures, precision);
}

export const getPoligonsPointsCoordinates = (
    coordinates: [number, number],
    precision: number
): number[][] => {
    return [
        [coordinates[0] - (precision / 2), coordinates[1] + (precision / 2)],
        [coordinates[0] - (precision / 2), coordinates[1] - (precision / 2)],
        [coordinates[0] + (precision / 2), coordinates[1] - (precision / 2)],
        [coordinates[0] + (precision / 2), coordinates[1] + (precision / 2)]
    ];
}

export const classifyGatheredMeasures = (
    gatheredMeasures: GatheredMockedMeasures[],
    precision: number
): ClassifiedGatheredMeasures => {
    const goodConnectionsCoordinates: number[][][] = [];
    const regularConnectionsCoordinates: number[][][] = [];
    const badConnectionsCoordinates: number[][][] = [];

    gatheredMeasures.forEach(({ averageConnection, averageCoordinates }) => {
        const poligonsPointsCoodinates = getPoligonsPointsCoordinates(
            averageCoordinates,
            precision
        );

        if (averageConnection >= GOOD_CONNECTION_INFERIOR_LIMIT) {
            goodConnectionsCoordinates.push(poligonsPointsCoodinates);
            return;
        }
        
        if (averageConnection >= REGULAR_CONNECTION_INFERIOR_LIMIT) {
            regularConnectionsCoordinates.push(poligonsPointsCoodinates);
            return;
        }

        badConnectionsCoordinates.push(poligonsPointsCoodinates);
    });

    return {
        goodConnectionsCoordinates,
        regularConnectionsCoordinates,
        badConnectionsCoordinates
    }
}