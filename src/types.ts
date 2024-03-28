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
	version: string
	printer: string
	text: string
	hostname?: string
	firmware: string
	sdk?: string
	capabilities?: {
		uploadByPut: boolean
	}
}

export interface Storage {
	storageList: Store[]
}

export enum StorageType {
	LOCAL = "LOCAL",
	SDCARD = "SDCARD",
	USB = "USB",
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

export enum PrinterStatus {
	IDLE = "IDLE",
	BUSY = "BUSY",
	PRINTING = "PRINTING",
	PAUSED = "PAUSED",
	FINISHED = "FINISHED",
	STOPPED = "STOPPED",
	ERROR = "ERROR",
	ATTENTION = "ATTENTION",
	READY = "READY",
}

export interface StatusPrinter {
	state: PrinterStatus
	tempBed?: number
	targetBed?: number
	tempNozzle?: number
	targetNozzle?: number
	axisZ?: number
	axisX?: number
	axisY?: number
	flow?: number
	speed?: number
	fanHotend?: number
	fanPrint?: number
	statusPrinter?: {
		ok: boolean
		message: string
	}
	statusConnect?: {
		ok: boolean
		message: string
	}
}

export interface StatusJob {
	id: number
	progress: number
	timeRemaining: number
	timePrinting: number
}

export interface StatusTransfer {
	id?: number
	timeTransferring?: number
	progress: number
	dataTransferred: number
}

export interface StatusStorage {
	path: string
	name: string
	readOnly: boolean
	freeSpace?: number
}

export interface StatusCamera {
	id: string
}

export interface Status {
	storage: StatusStorage
	printer: StatusPrinter
	camera?: StatusCamera
	transfer?: StatusTransfer
	job?: StatusJob
}

export enum TransferType {
	NO_TRANSFER = "NO_TRANSFER",
	FROM_WEB = "FROM_WEB",
	FROM_CONNECT = "FROM_CONNECT",
	FROM_PRINTER = "FROM_PRINTER",
	FROM_SLICER = "FROM_SLICER",
	FROM_CLIENT = "FROM_CLIENT",
	TO_CONNECT = "TO_CONNECT",
	TO_CLIENT = "TO_CLIENT",
}

export interface Transfer {
	type: TransferType
	displayName: string
	path: string
	url?: string
	size?: string
	progress: number
	transfered: number
	timeRemaining?: number
	timeTransferred: number
	toPrint: boolean
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

export enum TriggerScheme {
	TEN_SEC = "TEN_SEC",
	THIRTY_SEC = "THIRTY_SEC",
	SIXTY_SEC = "SIXTY_SEC",
	EACH_LAYER = "EACH_LAYER",
	FIFTH_LAYER = "FIFTH_LAYER",
	MANUAL = "MANUAL",
}

export interface Resolution {
	width: number
	height: number
}

export enum CameraCapabilities {
	TRIGGER_SCHEME = "TRIGGER_SCHEME",
	IMAGING = "IMAGING",
	RESOLUTION = "RESOLUTION",
	ROTATION = "ROTATION",
	EXPOSURE = "EXPOSURE",
	FOCUS = "FOCUS",
}

export interface CameraConfig {
	name: string
	triggerScheme: TriggerScheme
	availableResolutions: Resolution[]
	resolution: Resolution
	focus: number
	capabilities: CameraCapabilities
}

export interface CameraConfigSet {
	name: string
	triggerScheme: TriggerScheme
	resolution: Resolution
	rotation: number
	focus: number
	exposure: number
	sendToConnect: boolean
}

export enum FileType {
	PRINT_FILE = "PRINT_FILE",
	FIRMWARE = "FIRMWARE",
	FILE = "FILE",
	FOLDER = "FOLDER",
}

export interface GenericFileInfo {
	name: string
	readOnly: boolean
	size?: number
	type: FileType
	mTimestamp: number
	displayName?: string
}

export interface FileInfo extends GenericFileInfo {
	download: string
}

export interface PrintFileInfoBasic extends GenericFileInfo {
	refs: PrintFileRefs
}

export interface Env {
	newVersion: string
}

export enum PrinterModel {
	MK3 = "MK3",
	MK3S = "MK3S",
	MINI = "MINI",
}

// TODO: check and finish
export interface PrintFileMetadata {
	bedTemperature?: number
	bedTemperaturePerTool?: number[]
	temperature?: number
	temperaturePerTool?: number[]
}

export interface PrintFileRefs {
	download: string
	icon: string
	thumbnail: string
}

export interface JobFilePrint {
	name: string
	readOnly?: boolean
	size?: number
	type?: string
	mTimestamp: number
	displayName?: string
	meta?: PrintFileMetadata
	refs: PrintFileRefs
}

export interface JobSerialPrint {
	serialPrint: boolean
}

export enum JobState {
	PRINTING = "PRINTING",
	PAUSED = "PAUSED",
	FINISHED = "FINISHED",
	STOPPED = "STOPPED",
	ERROR = "ERROR",
}

export interface Job {
	id: number
	state: JobState
	progress: number
	timePrinting: number
	timeRemaining?: number
	inaccurateEstimates?: boolean
	file?: JobFilePrint
	serialPrint?: boolean
}

export interface PrusaLinkPackage {
	newVersion: string
}

export interface PrinterError {
	code?: string
	title: string
	text: string
	url?: string
}
