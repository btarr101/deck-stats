import { Show, createSignal, type Component } from "solid-js";

import styles from "./App.module.css";
import { Box, Button, Stack, TextField } from "@suid/material";
import { EDHRecCardData, fetchCardData } from "./repo/edhrecRepo";
import EDHRecCardDataTable from "./components/EDHRecCardDataTable";
import StatReport from "./components/StatReport";

/**
 * Given a raw list of cards where each card has a number and is seperated
 * by newlines, return a list of all the card names.
 *
 * @param deckList
 * @returns List of the card names.
 */
const getCardNameList = (deckList: string): Array<string> => {
  const lineRegex = /([A-Za-z].*)/;

  const lines = deckList.split("\n");
  return lines
    .map((line) => {
      const matches = line.match(lineRegex);
      return matches ? matches[0] : null;
    })
    .filter((cardName) => cardName) as string[];
};

const App: Component = () => {
  const [options] = createSignal({
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  });
  const [series] = createSignal([
    {
      name: "series-1",
      data: [30, 40, 35, 50, 49, 60, 70, 91],
    },
  ]);

  const [deckList, setDeckList] = createSignal("");
  const [fetchedCardData, setFetchedCardData] = createSignal<
    EDHRecCardData[] | null
  >(null);

  const onClickHandler = async () => {
    const cardNames = getCardNameList(deckList());
    console.log(cardNames);
    const cardData = await Promise.all(
      cardNames.map((cardName) => fetchCardData(cardName))
    );
    console.log(cardData);
    setFetchedCardData(cardData);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          "text-align": "center",
        }}
      >
        DeckStats
      </h1>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          minHeight: 0,
          height: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <Stack
          spacing={2}
          paddingX={2}
          sx={{
            width: "100%",
            overflowY: "scroll",
          }}
        >
          <TextField
            class={styles.deckInput}
            label="Deck"
            value={deckList()}
            onChange={(event) => setDeckList(event.target.value)}
            placeholder="Paste your deck here"
            variant="filled"
            minRows={10}
            maxRows={10}
            multiline
          />
          <Button onClick={onClickHandler}>Show me the stats</Button>
          <Show when={fetchedCardData()}>
            <h2>Card List</h2>
            <EDHRecCardDataTable data={fetchedCardData() as EDHRecCardData[]} />
          </Show>
        </Stack>

        <Stack
          padding={2}
          spacing={2}
          sx={{ width: "100%", overflowY: "scroll" }}
        >
          <Show when={fetchedCardData()}>
            <StatReport
              statName="Saltiness"
              description="Ranges from 0 to 4. Has a direct negative correlation with the number of friends you have."
              data={(fetchedCardData() as EDHRecCardData[]).map(
                (cardData) => cardData.salt as number
              )}
            />
            <StatReport
              statName="Cost"
              description={
                'In USD. Ranges from "they are just pieces of cardboard" to you reaching into your mom' +
                "'s " +
                "purse."
              }
              data={(fetchedCardData() as EDHRecCardData[]).map(
                (cardData) => cardData.price as number
              )}
            />
            <StatReport
              statName="Popularity"
              description="% of decks including this card vs. how many decks the card could be included in. Think of that one Buzz Lightyear meme."
              data={(fetchedCardData() as EDHRecCardData[]).map(
                (cardData) => cardData.popularity as number
              )}
            />
          </Show>
        </Stack>
      </Box>
    </Box>
  );
};

export default App;
