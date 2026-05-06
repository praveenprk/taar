# Taar

> Telegram-style prompt compression. Strip filler, cut tokens, keep signal.

Browser extension. No AI. No server. No API key.

## How it works

Click into any prompt box on Claude, ChatGPT, Gemini — an `optimize` button appears. Click it. Filler stripped, stop words dropped, signal preserved.

Before:
> I was wondering if you could please help me write a function that can be used to basically parse JSON data from an API response, and I would also like you to make sure that it handles errors properly as well.

After:
> Write function parse JSON data API response, handle errors.

## In Action
![In Action](taar-recording-chatgpt.gif)

> ⚠️ **When to not use Taar**
> - Code or technical prompts — stop words will mangle syntax
> - When exact phrasing matters — context, nuance, tone
> - Already concise prompts — it will over-strip

**Mistaken optimize?** `CtrlorCmd+Z` restores original.

## Install

1. Clone repo
2. `chrome://extensions` → Developer mode → Load unpacked → select folder
3. Click into any prompt box → hit `optimize`

## Why

Telegram operators paid per word. Every word earned its place. LLMs charge per token. Same constraint, same discipline.

## Screenshots

**ChatGPT**

![Raw](before-raw-prompt.png)
![Compressed](after-compressed-prompt.png)

**Claude**
![Raw](image.png)
![Compressed](image-1.png)

**Gemini**
![Raw](image-2.png)
![Compressed](image-3.png)

**Mistral**
![Raw](image-4.png)
![Compressed](image-5.png)

## License

MIT