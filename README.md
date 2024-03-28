# A Typescript Client for Prusa Link

Start building your own 3D printing workflows.

The package has been built from the [Prusa-Web-Link OpenAPI](https://github.com/prusa3d/Prusa-Link-Web/blob/master/spec/openapi.yaml) specification and tested using our Prusa minis using 5.x firmware. The typings are mostly there but any issues then please raise them and we can correct them. There are a few endpoints (mainly cameras) that need completing but we need some of those devices to test against (Prusa, if you come across this, like it and have some spare devices then I am more than happy to finish off the client and test it 😊).

##

To install the package, use the following code (switch out `pnpm` for your chosen package manager `npm`, `yarn` or `bun`).

```
pnpm install @jamesgopsill/prusa-link
```

## Example

```typescript
import { PrusaLink, PrusaLinkConfig } from "@jamesgopsill/prusa-link"

const config: PrusaLinkConfig = {
	// You can find these in your printer settings.
	ip: "",
	username: "",
	password: "",
	debug: false,
}

const link = new PrusaLink(config)

const r = await link.version.get()
if (r.content) console.log(r.content)
```

## Documentation

The docs have been produced using [TypeDoc](https://typedoc.org/) and can be accessed [here](https://jamesgopsill.github.io/prusa-link).

## Running the tests

To run the test suite, you will need to create a `setup.ts` file in the `__tests__` folder and paste in the following lines of code with your config. And, have a prusa printer on your network 😊.

```typescript
import { beforeAll } from "bun:test"
import { PrusaLink, PrusaLinkConfig } from "../src/index.ts"

export let link: PrusaLink

beforeAll(() => {
	const config: PrusaLinkConfig = {
		ip: "",
		username: "",
		password: "",
		debug: true,
	}
	link = new PrusaLink(config)
})
```

## References

- [Brokering Additive Manufacturing](https://dmf-lab.co.uk/brokering-additive-manufacturing/)
