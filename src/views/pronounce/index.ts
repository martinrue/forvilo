import { onReady, $ } from "../../helpers";
import { dispatch, registerEvents } from "../../actions";

interface Pronunciation {
  index: number;
  code: string;
  voice: string;
  country: string;
  pathmp3: string;
}

let pronunciations: Pronunciation[] = [];

const createPlayer = (id: string, onStart: (index: number) => void, onEnd: () => void) => {
  const $audio = $<HTMLAudioElement>(id)!;
  const $source = $<HTMLSourceElement>(`${id} source`)!;

  let current = 0;

  $audio.addEventListener("play", () => onStart(current + 1));
  $audio.addEventListener("ended", onEnd);
  $source.addEventListener("error", onEnd);

  const play = (index: number, url: string) => {
    onEnd();
    current = index;
    $audio.pause();
    $source.src = url;
    $audio.load();
    $audio.play();
  };

  const stop = () => {
    $audio.pause();
  };

  return {
    play,
    stop,
  };
};

onReady(() => {
  const $loader = $<HTMLElement>(".loader")!;
  const $input = $<HTMLInputElement>(".input")!;
  const $pronunciations = $<HTMLDivElement>(".pronunciations")!;

  const player = createPlayer(
    "#player",
    (id) => highlightPronunciation(id),
    () => highlightPronunciation(-1)
  );

  const updateHeight = () => {
    requestAnimationFrame(() => {
      dispatch("set-input-window-height", document.body.scrollHeight);
      requestAnimationFrame(() => window.scroll(0, 0));
    });
  };

  const emptyPronunciations = () => {
    $pronunciations.style.display = "none";
    $pronunciations.innerHTML = "";
  };

  const emptyInput = () => {
    $input.value = "";
    $input.focus();
  };

  const setLoading = (loading: boolean) => {
    $loader.style.display = loading ? "block" : "none";
    $input.disabled = loading;

    if (!loading) {
      $input.focus();
    }
  };

  const renderPronunciation = ({ index, code, voice, country }: Pronunciation) => {
    const voices: any = {
      m: "♂",
      f: "♀",
    };

    return `
      <div class="pronunciation p-${index}">
        <div class="index">${index}</div>
        <div class="code">${code}</div>
        <div class="voice">${voices[voice]}</div>
        <div class="country">${country}</div>
      </div>`;
  };

  const renderPronunciations = (pronunciations: Pronunciation[]) => {
    return pronunciations.map(renderPronunciation).join("");
  };

  const handleEscapeKeyPress = () => {
    player.stop();

    const wasEmpty = $input.value === "";

    emptyInput();
    emptyPronunciations();
    updateHeight();

    if (wasEmpty) {
      dispatch("hide-window");
    }
  };

  const highlightPronunciation = (index: number) => {
    const current = $<HTMLDivElement>(".current");

    if (current) {
      current.classList.remove("current");
    }

    if (index === -1) {
      return;
    }

    const target = $<HTMLDivElement>(`.p-${index}`);

    if (target) {
      target.classList.add("current");
    }
  };

  const playPronunciation = (key: number) => {
    const index = (key === 0 ? 10 : key) - 1;
    const pronunciation = pronunciations[index];

    if (!pronunciation) {
      return;
    }

    player.play(index, pronunciation.pathmp3);
  };

  const fetchPronunciations = (search: string) => {
    setLoading(true);
    dispatch("fetch-pronunciations", search);
  };

  registerEvents({
    event: "fetched-pronunciations",
    fn: (_, data: Pronunciation[]) => {
      pronunciations = data;

      if (pronunciations.length === 0) {
        $pronunciations.innerHTML = "";
        $pronunciations.style.display = "none";
      }

      if (pronunciations.length > 0) {
        $pronunciations.innerHTML = renderPronunciations(pronunciations);
        $pronunciations.style.display = "block";

        requestAnimationFrame(() => {
          $pronunciations.focus();
        });
      }

      updateHeight();
      setLoading(false);
    },
  });

  $input.addEventListener("keydown", (e: KeyboardEvent) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();

      const search = $input.value.trim();

      if (search === "") {
        emptyInput();
        return;
      }

      fetchPronunciations(search);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleEscapeKeyPress();
    }
  });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleEscapeKeyPress();
      return;
    }

    if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
      $input.focus();
      return;
    }

    const number = parseInt(e.key, 10);

    if (number >= 0 && number <= 9) {
      playPronunciation(number);
    }
  });

  updateHeight();
  $input.focus();
});
