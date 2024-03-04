import { PrusaLink, PrusaLinkConfig } from "../src/index.js"

const config: PrusaLinkConfig = {
	ip: "",
	username: "",
	password: "",
	debug: true,
}

const link = new PrusaLink(config)

{
	const r = await link.version.get()
	if (r.content) console.log(r.content)
}

{
	const r = await link.info.get()
	if (r.content) console.log(r.content)
}

{
	const r = await link.status.get()
	if (r.content) console.log(r.content)
}

{
	const r = await link.storage.get()
	if (r.content) console.log(r.content)
}

{
	const r = await link.job.get()
	console.log(r.status)
	if (r.content) console.log(r.content)
}

{
	const r = await link.transfer.get()
	console.log(r.status)
	if (r.content) console.log(r.content)
}

{
	const r = await link.update.get("prusalink")
	console.log(r.status)
	if (r.content) console.log(r.content)
}

{
	const gcode = `
G28 ; home all without mesh bed level
G29 ; mesh bed leveling
`
	const r = await link.files.put(gcode, "usb", "test.gcode", 1, 1)
	console.log(r.status, r.statusText)
	if (r.content) console.log(r.content)
}

let interval = setInterval(async () => {
	const r = await link.status.get()
	if (r.content) {
		switch (r.content.printer.state) {
			case "IDLE": {
				console.log("\uf11e")
				clearInterval(interval)
				const gcode = `
G28 ; home all without mesh bed level
`
				const r = await link.files.put(gcode, "usb", "test.gcode", 1, 1)
				console.log(r.status, r.statusText)
				if (r.content) console.log(r.content)
				break
			}
			case "FINISHED": {
				console.log("\uf11e")
				clearInterval(interval)
				const gcode = `
G28 ; home all without mesh bed level
`
				const r = await link.files.put(gcode, "usb", "test.gcode", 1, 1)
				console.log(r.status, r.statusText)
				if (r.content) console.log(r.content)
				break
			}
			default:
				console.log(`\udb83\ude5b`)
				break
		}
	}
}, 1000)
