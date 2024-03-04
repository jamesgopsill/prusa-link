export type HTTPResponse<T = any> =
	| ({
			ok: true
			content: T
	  } & Response)
	| ({
			ok: false
			content: undefined
	  } & Response)

export interface Version {
	api: string
	server: string
	nozzleDiameter: number
	text: string
	hostname: string
	firmware?: string
	sdk?: string
	capabilities: {
		uploadByPut: boolean
	}
}

export interface Info {
	nozzleDiameter: number
	mmu: boolean
	serial: string
	hostname: string
	minExtrusionTemp: number
	location?: string
	farmMode?: boolean
	sdReady?: boolean
	activeCamera?: boolean
	port?: string
	networkErrorChime?: boolean
}

export interface Status {
	storage: {
		path: string
		name: string
		readOnly: boolean
		freeSpace?: number
	}
	printer: {
		state: string | "PRINTING" | "IDLE" | "FINISHED."
		tempBed: number
		targetBed: number
		tempNozzle: number
		targetNozzle: number
		axisZ: number
		axisX: number
		axisY: number
		flow: number
		speed: number
		fanHotend: number
		fanPrint: number
		statusPrinter?: {
			ok: boolean
			message: string
		}
		statusConnect?: {
			ok: boolean
			message: string
		}
	}
	camera?: {
		id: string
	}
	transfer?: {
		id: number
		timeTransferring: number
		progress: number
		dataTransferred: number
	}
	job?: {
		id: number
		progress: number
		timeRemaining: number
		timePrinting: number
	}
}

export interface Storage {
	storageList: Store[]
}

export interface Store {
	name: string
	type: string
	path: string
	printFiles?: number
	systemFiles?: number
	freeSpace?: number
	totalSpace?: number
	available: boolean
	readOnly: boolean
}

export interface Transfer {
	type: string
	displayName: string
	path: string
	url: string
	size: string
	progress: number
	transfered: number
	timeRemaining: number
	timeTransferred: number
	toPrint: boolean
}

export interface File {
	name: string
	readOnly: boolean
	size: number
	type: string
	mTimestamp: number
	displayName: string
	refs: {
		download: string
		icon: string
		thumbnail: string
	}
}

export interface Camera {
	cameraId: string
	config: {
		path: string
		name: string
		driver: string
		resolution: string
	}
	connected: boolean
	detected: boolean
	stored: boolean
	linked: boolean
}

export interface Env {
	newVersion: string
}

export interface Job {
	id: number
	state: string
	progress: number
	timePrinting: number
	file: File
}
