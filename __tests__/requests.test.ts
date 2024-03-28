import { expect, test } from "bun:test"
import { link } from "./setup.ts"

test(`version`, async () => {
	const r = await link.version.get()
	expect(r.ok).toBe(true)
	if (r.content) console.log(r.content)
})

test(`info`, async () => {
	const r = await link.info.get()
	expect(r.ok).toBe(true)
	if (r.content) console.log(r.content)
})

test(`status`, async () => {
	const r = await link.status.get()
	expect(r.ok).toBe(true)
	if (r.content) console.log(r.content)
})

test(`storage`, async () => {
	const r = await link.storage.get()
	expect(r.ok).toBe(true)
	if (r.content) console.log(r.content)
})

test(`job`, async () => {
	const r = await link.job.get()
	expect(r.ok).toBe(true)
	if (r.content) console.log(r.content)
})

test(`transfer`, async () => {
	const r = await link.transfer.get()
	expect(r.ok).toBe(true)
	if (r.content) console.log(r.content)
})

// Can occasionally socket error.
// TODO: possible retries
test(`put file`, async () => {
	await Bun.sleep(1000)
	const gcode = `
G28 ; home all without mesh bed level
G29 ; mesh bed leveling
`
	const r = await link.files.put(gcode, "usb", "test.gcode", 1, 1)
	expect(r.ok).toBe(true)
})
