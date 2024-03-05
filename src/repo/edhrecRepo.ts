
/**
 * Type for card data that is fetched from EDHREC.
 */
export type EDHRecCardData = {
    // The name of the card
    name: string,

    // How annoying the card is
    salt?: number,

    // The price of the card
    price?: number,

    // How popular the card is (calculated as how many decks it is in vs. how many it could be in)
    popularity?: number
}

/**
 * Fetches specific card data from EDHREC and returns it.
 * 
 * @param cardName The name of the card.
 * @returns Data associated with the card.
 */
export const fetchCardData = async (cardName: string): Promise<EDHRecCardData> => {
    const formattedCardName = cardName.toLowerCase().replaceAll(" ", "-").replaceAll(",", "").replaceAll("'", "");
    const cardUrl = `https://json.edhrec.com/pages/cards/${formattedCardName}.json`

    const allData = await fetch(cardUrl).then((response) => response.json())
    const card = allData.container?.json_dict?.card;

    const prices = card?.prices;
    const filteredPrices = prices ? Object.keys(prices).map((key) => prices[key]?.price).filter((price) => isFinite(price)) : [];
    
    const averagePrice = filteredPrices.length > 0 ? filteredPrices.reduce((accum, next) => {
        return (accum + next) / 2.0;
    }) : undefined;

    const popularity = card ? card.num_decks / card.potential_decks : undefined;

    return {
        name: formattedCardName,
        salt: card?.salt,
        price: averagePrice,
        popularity: popularity,
    }
}
