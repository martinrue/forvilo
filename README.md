# Forvilo

Forvilo is a Mac menu bar application for quickly fetching audio pronunciations from [Forvo](https://forvo.com).

## Usage

### Setup

Forvilo uses the [Forvo API](https://api.forvo.com), which is a paid service. If you don't have an API key in `~/.forvilo`, you'll be shown a window to input your API key.

### Search

Open the search window via `ctrl + shift + p`.

Enter a word and hit enter. Forvilo will bring back up to 10 pronunciations.

Use the keys `0-9` to play the audio pronunciation for the respective result shown (use `0` to play the 10th result).

### Filter

To find more specific results, specify a language code, voice, or country immediately after the search word:

`hola es` fetches pronunciations in Spanish

`hallo de` fetches pronunciations in German

`hola es mexico` fetches pronunciations in Mexican Spanish

`hola f es mexico` fetches female pronunciations in Mexican Spanish

`hello kingdom en m` fetches male pronunciations in British English

## Building

1: Install dependencies: `npm install`.

2: To run a development build: `npm run dev`.

3: To create a full build: `npm run build`.
