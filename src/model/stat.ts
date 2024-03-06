
export type Stat = {
    name: string,
    description?: string,
    display: (arg0: number) => string,
    range: [number, number]
}

export const Salt: Stat = {
    name: "Salt",
    description: "Scale from 0 to 4 on how fraustrating the card is to play against.",
    display: (salt) => salt.toFixed(2),
    range: [0.0, 2.0]
}

export const Cost: Stat = {
    name: "Cost",
    display: (cost) => `$${cost.toFixed(2)}`,
    range: [0.0, 100.0],
}

export const Popularity: Stat = {
    name: "Popularity",
    description: "Percentage of decks a card is in over how many decks it could be in.",
    display: (popularity) => `${(popularity * 100.0).toFixed(2)}%`,
    range: [0.0, 0.5],
}