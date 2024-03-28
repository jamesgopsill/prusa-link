import { putFile } from "./api.js"
import { keysToCamel } from "./format-keys.js"
import { md5 } from "./md5.js"
import {
	Camera,
	Env,
	HTTPResponse,
	Info,
	Job,
	Status,
	Transfer,
	Version,
} from "./types.js"

export interface PrusaLinkConfig {
	ip: string
	username: string
	password: string
	debug?: boolean
}

export class PrusaLink {
	protected _ip: string = ""
	protected _username: string = ""
	protected _password: string = ""
	protected _debug: boolean = false

	constructor(config: PrusaLinkConfig) {
		this._ip = config.ip
		this._username = config.username
		this._password = config.password
		if (config.debug) {
			this._debug = config.debug
		}
	}

	public hello = () => "world"

	protected _fetch = _fetch
	protected _digest = _digest

	public version = {
		get: () => this._fetch<Version>("GET", `/api/version`),
	}

	public info = {
		get: () => this._fetch<Info>("GET", `/api/v1/info`),
	}

	public status = {
		get: () => this._fetch<Status>("GET", `/api/v1/status`),
	}

	public storage = {
		get: () => this._fetch<Storage>("GET", `/api/v1/storage`),
	}

	public transfer = {
		get: () => this._fetch<Transfer>("GET", "/api/v1/transfer"),
		delete: (id: string) => this._fetch("DELETE", `/api/v1/transfer/${id}`),
	}

	public job = {
		get: (id?: string) => {
			if (id) return this._fetch<Job>("GET", `/api/v1/job/${id}`)
			return this._fetch<Job>("GET", `/api/v1/job`)
		},
		delete: (id: string) => this._fetch("DELETE", `/api/v1/job/${id}`),
		pause: (id: string) => this._fetch("PUT", `/api/v1/job/${id}/pause`),
		resume: (id: string) => this._fetch("PUT", `/api/v1/job/${id}/resume`),
		continue: (id: string) => this._fetch("PUT", `/api/v1/job/${id}/continue`),
	}

	public files = {
		file: (storage: string, path: string) =>
			this._fetch<File>("GET", `/api/v1/files/${storage}/${path}`),
		put: (
			gcode: string,
			storage: string,
			path: string,
			printAfterUpload: number = 0,
			overwrite: number = 0,
		) => {
			return putFile.call(
				this,
				gcode,
				storage,
				path,
				printAfterUpload,
				overwrite,
			)
		},
		post: (storage: string, path: string) =>
			this._fetch("POST", `/api/v1/files/${storage}/${path}`),
		head: (storage: string, path: string) =>
			this._fetch("HEAD", `/api/v1/files/${storage}/${path}`),
		delete: (storage: string, path: string) =>
			this._fetch("DELETE", `/api/v1/files/${storage}/${path}`),
	}

	public cameras = {
		get: (id?: string) => {
			if (id) {
				return this._fetch<Camera>("GET", `/api/v1/cameras/${id}`)
			}
			return this._fetch<Camera[]>("GET", "/api/v1/cameras")
		},
		put: () => {
			console.log("TODO")
		},
		post: () => {
			console.log("TODO")
		},
		getSnap: (id?: string) => {
			if (id) {
				return this._fetch<Camera>("GET", `/api/v1/cameras/${id}/snap`)
			}
			return this._fetch("GET", "/api/v1/cameras/snap")
		},
		postSnap: (id: string) => {
			console.log("TODO", id)
		},
		patch: (id: string) => {
			console.log("TODO", id)
		},
		delete: (id: string) => {
			return this._fetch("DELETE", `/api/v1/cameras/${id}/config`)
		},
		postToConnect: () => {},
		deleteFromConnect: () => {},
	}

	public update = {
		get: (env: "prusalink" | "system") => {
			return this._fetch<Env>("GET", `/api/v1/update/${env}`)
		},
		post: (env: "prusalink" | "system") => {
			return this._fetch("POST", `/api/v1/update/${env}`)
		},
	}
}

async function _fetch<T = any>(
	this: PrusaLink,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD",
	uri: string,
): Promise<HTTPResponse<T>> {
	const url = `http://${this._ip}${uri}`

	if (this._debug) {
		console.log(`PrusaLink._fetch: ${url}`)
	}

	let request: Request = new Request(url, {
		method,
		mode: "cors",
		headers: {
			Connection: "keep-alive",
		},
	})

	const auth = await this._digest(request, uri)

	if (auth instanceof Response) {
		return auth as HTTPResponse<T>
	}

	// create the new authed request
	request = new Request(url, {
		method,
		mode: "cors",
		headers: {
			Connection: "keep-alive",
			Authorization: auth,
		},
	})

	// Wrap a try and catch to catch ECONNRESET
	try {
		const r = (await fetch(request)) as HTTPResponse<T>

		if (r.ok && r.status === 200) {
			if (r.headers.get("Content-Type")?.includes("application/json")) {
				let content = await r.json()
				content = keysToCamel(content)
				r.content = content
			}
		}
		return r
	} catch (e) {
		return new Response(undefined, { status: 500 }) as HTTPResponse<T>
	}
}

async function _digest(
	this: PrusaLink,
	request: Request,
	uri: string,
): Promise<string | Response> {
	let r: Response

	// Wrap a try and catch to catch ECONNRESET
	try {
		r = await fetch(request)
	} catch (e) {
		return new Response(undefined, { status: 500 })
	}

	// Should get an auth error first time round
	if (r.status !== 401) {
		console.log("Warning: Expected Auth Error")
		return r
	}

	// Create the HTTP Digest and repeat the request

	const digest = r.headers.get("WWW-Authenticate")
	if (!digest) {
		console.log("Warning: Expected Digest")
		return r
	}
	const matches = digest?.match(/"[\w\s]+"/g)
	if (!matches || matches.length < 2) {
		console.log("Expected Matches")
		return r
	}
	let realm = matches[0]
	let nonce = matches[1]
	if (!(realm && nonce)) {
		console.log("Expected Realm and Nonce")
		return r
	}
	realm = realm.replaceAll('"', "")
	nonce = nonce.replaceAll('"', "")

	const HA1String = `${this._username}:${realm}:${this._password}`
	const HA1Hash = md5(HA1String)

	const HA2String = `${request.method}:${uri}`
	const HA2Hash = md5(HA2String)

	const responseString = `${HA1Hash}:${nonce}:${HA2Hash}`
	const responseHash = md5(responseString)

	const authorization = `Digest username="${this._username}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${responseHash}"`

	return authorization
}
