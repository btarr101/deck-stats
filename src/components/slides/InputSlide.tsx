import { Component, For, Show, createSignal } from "solid-js";
import { EDHRecCardData, fetchCardData } from "../../repo/edhrecRepo";
import { VsClose } from "solid-icons/vs";

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

type CardDataFetchResult = {
  cardName: string;
  cardData: EDHRecCardData | null;
};

const InputSlide: Component<{
  onCardDataFetched: (cardData: EDHRecCardData[]) => void;
  onCardDataCleared?: () => void;
}> = (props) => {
  const [deckList, setDeckList] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Element | null>(null);

  const onShowMeTheStats = async () => {
    setLoading(true);
    setError(null);
    if (props.onCardDataCleared) {
      props.onCardDataCleared();
    }
    const cardNames = getCardNameList(deckList());
    Promise.all(
      cardNames.map((cardName) =>
        fetchCardData(cardName)
          .then(
            (cardData): CardDataFetchResult => ({
              cardName,
              cardData,
            })
          )
          .catch(
            (reason): CardDataFetchResult => ({
              cardName,
              cardData: null,
            })
          )
      )
    )
      .then((cardDataResults) => {
        const erroredCardDatas = cardDataResults.filter(
          (result) => result.cardData == null
        );

        if (erroredCardDatas.length > 0) {
          const cardNames = erroredCardDatas.map((data) => data.cardName);
          setError(
            (
              <div>
                <span>Unable to fetch the following cards: </span>
                <For each={cardNames}>
                  {(cardName) => <div class="font-bold">{`${cardName}`}</div>}
                </For>
              </div>
            ) as HTMLDivElement
          );
        } else {
          const cardData = cardDataResults.map(
            (result) => result.cardData as EDHRecCardData
          );
          props.onCardDataFetched(cardData);
          const chartSlide = document.getElementById("chart-slide");
          const app = document.getElementById("app") as HTMLDivElement;
          app.scroll({
            top: (chartSlide as HTMLElement).offsetTop,
          });
        }
      })
      .finally(async () => {
        setLoading(false);
      });
  };

  return (
    <div class="snap-center bg-base-100">
      <Show when={error()}>
        <div class="fixed right-0 bottom-0 px-4">
          <div class="relative alert alert-error text-error-content pt-6 mr-6">
            <button
              onClick={() => setError(null)}
              class="btn btn-circle btn-sm btn-neutral btn-ghost absolute right-0 top-0 z-10 m-2"
            >
              <VsClose size={16} />
            </button>
            {error()}
          </div>
        </div>
      </Show>
      <div class="container flex flex-col min-h-screen w-full items-center justify-evenly space-y-8 py-16">
        <div class="text-center space-y-2">
          <h1 class="text-6xl">
            Deck<span class="text-primary">Stats</span>.net
          </h1>
          <p>Find out what kind of player you truly are.</p>
        </div>
        <div class="w-full space-y-2 flex-1 flex flex-col">
          <label class="block">Deck List (MTGO format)</label>
          <textarea
            class="textarea flex-1 h-full w-full bg-base-200 overscroll-contain"
            placeholder="1 Sol Ring
1 Command Tower
..."
            value={deckList()}
            onInput={(event) => setDeckList(event.target.value)}
          />
        </div>
        <button
          class="btn btn-primary"
          onClick={onShowMeTheStats}
          disabled={loading() || !deckList()}
          aria-busy={loading()}
        >
          Show me the stats
        </button>
      </div>
    </div>
  );
};

export default InputSlide;
