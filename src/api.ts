import { keysToCamel } from "./format-keys.js"
import { PrusaLink } from "./index.js"
import { HTTPResponse } from "./types.js"

export async function putFile(
	this: PrusaLink,
	gcode: string,
	storage: string,
	path: string,
	printAfterUpload: number = 0,
	overwrite: number = 0,
) {
	const uri = `/api/v1/files/${storage}/${path}`
	const url = `http://${this._ip}${uri}`

	if (this._debug) {
		console.log(`PrusaLink._fetch: ${url}`)
	}

	// #######################
	// Digest auth

	let auth: string | HTTPResponse = ""

	{
		const config: any = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Print-After-Upload": `?${printAfterUpload}`,
				Overwrite: `?${overwrite}`,
				"Content-Type": "text/x.gcode",
				"Content-Length": gcode.length,
			},
			body: gcode,
		}

		const request = new Request(url, config)
		auth = (await this._digest(request, uri)) as HTTPResponse
	}

	if (typeof auth === "object") {
		return auth
	}

	// #############
	// PUT request with auth

	{
		const config: any = {
			method: "PUT",
			mode: "cors",
			headers: {
				"Print-After-Upload": `?${printAfterUpload}`,
				Overwrite: `?${overwrite}`,
				"Content-Type": "text/x.gcode",
				"Content-Length": gcode.length,
				Authorization: auth,
			},
			body: gcode,
		}

		const request = new Request(url, config)
		const r = (await fetch(request)) as HTTPResponse
		if (r.ok && r.status === 200) {
			if (r.headers.get("Content-Type")?.includes("application/json")) {
				let content = await r.json()
				content = keysToCamel(content)
				r.content = content
			}
		}
		return r
	}
}
