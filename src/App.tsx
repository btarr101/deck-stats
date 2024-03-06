import { Show, createSignal, type Component } from "solid-js";

import styles from "./App.module.css";
import { Box, Button, Paper, Stack, TextField } from "@suid/material";
import { EDHRecCardData, fetchCardData } from "./repo/edhrecRepo";
import EDHRecCardDataTable from "./components/EDHRecCardDataTable";
import StatReport from "./components/StatReport";
import { Cost, Popularity, Salt } from "./model/stat";

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
      <Paper sx={{ zIndex: 10 }}>
        <h1
          style={{
            "text-align": "center",
          }}
        >
          DeckStats
        </h1>
      </Paper>
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
            paddingBottom: 2,
          }}
        >
          <TextField
            label="Deck"
            sx={{ marginTop: 2 }}
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
              stat={Salt}
              data={(fetchedCardData() as EDHRecCardData[]).map(
                (cardData) => cardData.salt as number
              )}
            />
            <StatReport
              stat={Cost}
              data={(fetchedCardData() as EDHRecCardData[]).map(
                (cardData) => cardData.price as number
              )}
            />
            <StatReport
              stat={Popularity}
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
