
export const aboutDecimalPlaces = (value: number, places: number): string => {
    return "~" + value.toFixed(places);
};