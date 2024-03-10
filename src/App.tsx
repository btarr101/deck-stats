import { Show, createSignal, type Component } from "solid-js";

import { EDHRecCardData } from "./repo/edhrecRepo";
import InputSlide from "./components/slides/InputSlide";
import ChartSlide from "./components/slides/ChartSlide";
import TableSlide from "./components/slides/TableSlide";

const App: Component = () => {
  const [cardData, setCardData] = createSignal<EDHRecCardData[] | null>(null);

  const onCardDataFetchedHandler = (cardData: EDHRecCardData[]) => {
    setCardData(cardData);
  };

  return (
    <div
      id="app"
      class="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
    >
      <InputSlide
        onCardDataFetched={onCardDataFetchedHandler}
        onCardDataCleared={() => setCardData(null)}
      />

      <Show when={cardData()}>
        <ChartSlide cardData={cardData() as EDHRecCardData[]} />
      </Show>

      <Show when={cardData()}>
        <TableSlide cardData={cardData() as EDHRecCardData[]} />
      </Show>
    </div>
  );
};

export default App;
