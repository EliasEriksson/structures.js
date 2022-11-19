import { Blob, File } from "web-file-polyfill"
import { types } from "../../index"
globalThis.Blob = Blob
globalThis.File = File

describe("Json", () => {
	it("42", () => {
		expect(42).toEqual(42)
	})
	class Cls {
		foo = 123
		bar() {
			return 456
		}
	}
	it("Value.is", () => {
		expect(types.Object.Json.Basic.is(1)).toEqual(true)
		expect(types.Object.Json.Basic.is("hello")).toEqual(true)
		expect(types.Object.Json.Basic.is(true)).toEqual(true)
		expect(types.Object.Json.Basic.is(null)).toEqual(true)
		expect(types.Object.Json.Basic.is({})).toEqual(false)
		expect(types.Object.Json.Basic.is([])).toEqual(false)
		expect(types.Object.Json.Basic.is(undefined)).toEqual(false)
		expect(types.Object.Json.Basic.is(() => true)).toEqual(false)
		expect(types.Object.Json.Basic.is(new Cls())).toEqual(false)
	})
	it("Array.is", () => {
		expect(types.Object.Json.Array.is(1)).toEqual(false)
		expect(types.Object.Json.Array.is("hello")).toEqual(false)
		expect(types.Object.Json.Array.is(true)).toEqual(false)
		expect(types.Object.Json.Array.is(null)).toEqual(false)
		expect(types.Object.Json.Array.is({})).toEqual(false)
		expect(types.Object.Json.Array.is([])).toEqual(true)
		expect(types.Object.Json.Array.is(undefined)).toEqual(false)
		expect(types.Object.Json.Array.is(() => true)).toEqual(false)
		expect(types.Object.Json.Array.is(new Cls())).toEqual(false)
	})
	it("Object.is", () => {
		expect(types.Object.Json.Object.is(1)).toEqual(false)
		expect(types.Object.Json.Object.is("hello")).toEqual(false)
		expect(types.Object.Json.Object.is(true)).toEqual(false)
		expect(types.Object.Json.Object.is(null)).toEqual(false)
		expect(types.Object.Json.Object.is({})).toEqual(true)
		expect(types.Object.Json.Object.is([])).toEqual(false)
		expect(types.Object.Json.Object.is(undefined)).toEqual(false)
		expect(types.Object.Json.Object.is(() => true)).toEqual(false)
		expect(types.Object.Json.Object.is(new Cls())).toEqual(true)
	})
	it("is", () => {
		expect(types.Object.Json.is(1)).toEqual(true)
		expect(types.Object.Json.is("hello")).toEqual(true)
		expect(types.Object.Json.is(true)).toEqual(true)
		expect(types.Object.Json.is(null)).toEqual(true)
		expect(types.Object.Json.is({})).toEqual(true)
		expect(types.Object.Json.is([])).toEqual(true)
		expect(types.Object.Json.is(undefined)).toEqual(false)
		expect(types.Object.Json.is(new Cls())).toEqual(true)
		expect(types.Object.Json.is(() => true)).toEqual(false)
		expect(types.Object.Json.is([{ foo: 123 }, "hello world", 123, true])).toEqual(true)
		expect(
			types.Object.Json.is({ array: [123, "123", { bar: 123 }], number: 123, string: "asd", boolean: false })
		).toEqual(true)
	})
	it("jsonify", async () => {
		const data = {
			foo: [123, "123", false],
			bar: { bar: 123 },
			baz: null,
		}
		expect(await types.Object.Json.jsonify(data)).toEqual(data)
		expect(await types.Object.Json.jsonify({ set: new Set([1, 2, 3]) })).toEqual({
			set: { "": { type: "set", value: [1, 2, 3] } },
		})
	})
	it("objectify", async () => {
		expect(
			await types.Object.Json.objectify({
				"": {
					type: "set",
					value: [1, 2, 3],
				},
			})
		).toEqual(new Set([1, 2, 3]))
		expect(
			await types.Object.Json.objectify({
				name: "jessie",
				emails: {
					"": {
						type: "set",
						value: ["jessie@gmail.com", "jessie@company.com"],
					},
				},
			})
		).toEqual({
			name: "jessie",
			emails: new Set(["jessie@gmail.com", "jessie@company.com"]),
		})
	})
	it("stringified", async () => {
		const data = {
			name: {
				first: "jessie",
				last: "doe",
			},
			age: 31,
			emails: new Set(["jessie@gmail.com", "jessie@company.com", "jessie@gmail.com"]),
			photos: [
				types.File.fromText("some fake file"),
				types.File.fromText("some other fake file"),
				new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])]),
				new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])]),
			],
		}
		expect(JSON.parse(JSON.stringify(data))).not.toEqual(data)
		const result = await types.Object.Json.objectify(JSON.parse(JSON.stringify(await types.Object.Json.jsonify(data))))
		expect(result).toEqual(data)
		expect(result).not.toBe(data)
	})
})
