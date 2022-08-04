# alfred-laravel-helper-docs

alfred-laravel-helper-docs offers you rapid access to documentation for Laravel's helper functions — including those for `Collection` and fluent strings. 

**[Click Here to Download the Latest Release](https://github.com/stephancasas/alfred-laravel-helper-docs/releases/latest)**

<p align="center"><img src="./public/preview.gif" width="100%"></p>

## Usage

The workflow is triggered by the keyword `larahelp` but you may, of course, modify this in the Alfred workflow editor. Once activated, begin typing to search for a helper method.

Each method is decorated by an icon representative of its taxonomy (e.g. methods on `Arr` use a square brackets icon, collections use a "stack" icon). A preview of the method's description is shown below the method name.

Use the arrow keys to highlight your desired method, and press the **SHIFT** key to open a screenshot of the documentation in QuickLook. When done, press **SHIFT** or **ESCAPE** to dismiss the preview.

## Build

Screenshots and indices for the helper methods are built using NodeJS to execute Puppeteer. If you'd like to build the assets yourself, download the source and run `npm run build:collections` and `npm run build:helpers`. The required assets will be rendered in the `./assets/preview` and `./assets/indices` directory.

## Contributing / Standards

I built this in an hour. There are no standards.

## License

MIT — "Hell yeah, free software!"