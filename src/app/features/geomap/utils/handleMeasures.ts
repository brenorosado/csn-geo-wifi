import {
    GOOD_COST_DEFAULT_PARAMETER,
    GOOD_RSSI_DEFAULT_PARAMETER,
    REGULAR_COST_DEFAULT_PARAMETER,
    REGULAR_RSSI_DEFAULT_PARAMETER
} from "../../configs/pages/config/config.page";
import { Measure } from "./generateMockedMeasures";

export type GatheredMockedMeasures = {
    id: number;
    averageLatitude: number;
    averageLongitude: number;
    averageCost: number;
    averageRssi: number;
    measures: Measure[]
}

export type ClassifiedGatheredMeasures = {
    goodCoordinates: number[][][],
    regularCoordinates: number[][][],
    badCoordinates: number[][][]
}

const calculateAverageCoordinatesAndConnection = (
    measures: Measure[]
): {
    averageLatitude: number;
    averageLongitude: number;
    averageCost: number;
    averageRssi: number;
} => {
    let accumulatedLatitude = 0;
    let accumulatedLongitude = 0;
    let accumulatedCost = 0;
    let accumulatedRssi = 0;

    measures.forEach(({ latitude, longitude, cost, rssi }) => {
        accumulatedLatitude += latitude;
        accumulatedLongitude += longitude;
        accumulatedCost += cost;
        accumulatedRssi += rssi;
    });

    return {
        averageLatitude: accumulatedLatitude / measures.length,
        averageLongitude: accumulatedLongitude / measures.length,
        averageCost: accumulatedCost / measures.length,
        averageRssi: accumulatedRssi / measures.length
    }
}

export const gatherCloseMeasures = (
    measures: Measure[],
    precision: number,
    dataType: "custo" | "rssi"
): ClassifiedGatheredMeasures => {
    const gatheredMeasures: GatheredMockedMeasures[] = [];

    measures.forEach((measure) => {
        const { latitude, longitude } = measure;
        let gathered = false;

        for (let i = 0; i < gatheredMeasures.length; i++) {
            const { averageLatitude, averageLongitude } = gatheredMeasures[i];

            const distance = Math.sqrt(
                Math.pow(latitude - averageLatitude, 2) +
                Math.pow(longitude - averageLongitude, 2)
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

    return classifyGatheredMeasures(gatheredMeasures, precision, dataType);
}

export const getPoligonsPointsCoordinates = (
    longitude: number,
    latitude: number,
    precision: number
): number[][] => {
    return [
        [longitude - (precision / 2), latitude + (precision / 2), 0],
        [longitude - (precision / 2), latitude - (precision / 2), 0],
        [longitude + (precision / 2), latitude - (precision / 2), 0],
        [longitude + (precision / 2), latitude + (precision / 2), 0]
    ];
}

export const classifyGatheredMeasures = (
    gatheredMeasures: GatheredMockedMeasures[],
    precision: number,
    dataType: "custo" | "rssi"
): ClassifiedGatheredMeasures => {
    const goodCoordinates: number[][][] = [];
    const regularCoordinates: number[][][] = [];
    const badCoordinates: number[][][] = [];

    gatheredMeasures.forEach(({
        averageLatitude,
        averageLongitude,
        averageCost,
        averageRssi
    }) => {
        const poligonsPointsCoodinates = getPoligonsPointsCoordinates(
            averageLongitude,
            averageLatitude,
            precision
        );

        const costProps = {
            averageValue: averageCost,
            goodParameter: Number(
                localStorage.getItem("config-cost-good") ??
                GOOD_COST_DEFAULT_PARAMETER
            ),
            regularParameter: Number(
                localStorage.getItem("config-cost-regular") ??
                REGULAR_COST_DEFAULT_PARAMETER
            )
        }

        const classifyCost = () => {
            // menor = melhor
            if (costProps.averageValue < costProps.goodParameter) {
                goodCoordinates.push(poligonsPointsCoodinates);
                return;
            }

            if (costProps.averageValue < costProps.regularParameter) {
                regularCoordinates.push(poligonsPointsCoodinates);
                return;
            }

            badCoordinates.push(poligonsPointsCoodinates);
        }

        const rssiProps = {
            averageValue: averageRssi,
            goodParameter: Number(
                localStorage.getItem("config-rssi-good") ??
                GOOD_RSSI_DEFAULT_PARAMETER
            ),
            regularParameter: Number(
                localStorage.getItem("config-rssi-regular") ??
                REGULAR_RSSI_DEFAULT_PARAMETER
            )
        }

        const classifyRssi = () => {
            // maior = melhor
            if (rssiProps.averageValue > rssiProps.goodParameter) {
                goodCoordinates.push(poligonsPointsCoodinates);
                return;
            }

            if (rssiProps.averageValue > rssiProps.regularParameter) {
                regularCoordinates.push(poligonsPointsCoodinates);
                return;
            }

            badCoordinates.push(poligonsPointsCoodinates);
        }

        (dataType === "custo" ? classifyCost : classifyRssi)()
    });

    return {
        goodCoordinates,
        regularCoordinates,
        badCoordinates
    }
}