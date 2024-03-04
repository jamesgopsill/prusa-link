# A Typescript Client for Prusa Link

Start building your own 3D printing workflows.

The package has been built from the [Prusa-Web-Link OpenAPI](https://github.com/prusa3d/Prusa-Link-Web/blob/master/spec/openapi.yaml) specification and tested using our Prusa minis using 5.x firmware. The typings are mostly there but any issues then please raise them and we can correct them. There are a few endpoints (mainly cameras) that need completing but we need some of those devices to test against (Prusa, if you come across this, like it and have some spare devices then I am more than happy to finish off the client and test it 😊).

##

To install the package, use the following code (switch our `pnpm` for `npm`, `yarn` or `bun`).

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

## References

- [Brokering Additive Manufacturing](https://dmf-lab.co.uk/brokering-additive-manufacturing/)
