export interface RunTask {
	instance: Promise<any>
	commands: string[]
	resolve: (value: unknown) => void
	reject: (reason?: any) => void
}
