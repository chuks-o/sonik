# Landing page voice samples

These six clips power the demo player in the hero (`DemoStudio`).

## ⚠️ These are placeholders, not Sonic output

They were generated on a Mac with the built-in `say` command so the landing
page would have real, playable speech during development. **They are not
produced by Sonic's model, and the landing page presents them as if they were.**
Replace them with genuine Sonic generations before the site goes live.

## Replacing them

Generate each script in the app, download the audio, and save it here using the
same filenames. The player resolves `/samples/<voice id>.m4a`, where the ids and
their scripts live in `src/features/marketing/data/site.ts`:

| File        | Voice | Category         |
| ----------- | ----- | ---------------- |
| `aria.m4a`  | Aria  | Advertising      |
| `orion.m4a` | Orion | Audiobook        |
| `juno.m4a`  | Juno  | Customer service |
| `vale.m4a`  | Vale  | Meditation       |

Keep them as AAC in an MP4 container (`.m4a`) — it is the most broadly supported
format across Safari, Chrome and Firefox. To convert:

```sh
afconvert -f mp4f -d aac -b 64000 input.wav public/samples/aria.m4a
```

Aim for well under 100KB each. The waveform is decoded in the browser with the
Web Audio API, so no peaks file needs regenerating — but do update the `script`
text in `site.ts` if the spoken line changes, since it is shown as a transcript.
