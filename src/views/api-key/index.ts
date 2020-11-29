import { onReady, $ } from "../../helpers";
import { dispatch } from "../../actions";

onReady(() => {
  const $container = $<HTMLDivElement>(".container")!;
  const $input = $<HTMLInputElement>(".input")!;
  const $button = $<HTMLDivElement>(".button")!;

  const emptyInput = () => {
    $input.value = "";
    $input.focus();
  };

  const saveKey = () => {
    const key = $input.value.trim();

    if (key === "") {
      emptyInput();
      return;
    }

    $container.style.visibility = "hidden";
    dispatch("save-api-key", key);
  };

  $input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveKey();
    }

    if (e.key === "Escape") {
      if ($input.value !== "") {
        emptyInput();
        return;
      }

      dispatch("hide-window");
    }
  });

  $button.addEventListener("click", saveKey);
  window.addEventListener("focus", () => $input.focus());

  $input.focus();
});
