import { expect } from "chai";
import chai = require("chai");
import * as dom from "dts-dom";
import * as fs from "fs";
import * as path from "path";
import { JSDocTsdParser } from "../../src/core/jsdoc-tsd-parser";
chai.should();

describe("JSDocTsdParser.parse.parameterWithProperties", () => {
	const interfaceData: TDoclet[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, "data/propParams.json"), { encoding: "utf-8" }));
	expect(interfaceData.length).to.eq(4);

	it("should create a function with a parameter with properties", () => {
		const parser = new JSDocTsdParser();
		parser.parse(interfaceData);

		const result = parser.resolveMembership();
		result.should.include.keys("myTestInterface");
		result.should.include.keys("mySimpleFunction_propertyParameter");

		const parsedInterface: dom.InterfaceDeclaration = result.get("myTestInterface") as dom.InterfaceDeclaration;
		expect(parsedInterface.members.length).to.eq(2);

		const paramInterface: dom.InterfaceDeclaration = result.get("mySimpleFunction_propertyParameter") as dom.InterfaceDeclaration;

		const methodDeclaration: dom.MethodDeclaration = parsedInterface.members[0] as dom.MethodDeclaration;
		expect(methodDeclaration.jsDocComment).to.eq(`A simple function
@param propertyParameter My parameter with properties
@param propertyParameter.myProperty1 Description of myProperty1
@param propertyParameter.myProperty2 Description of myProperty2`);

		const parameters: dom.Parameter[] = methodDeclaration.parameters;
		expect(parameters.length).to.eq(1);

		const interfaceType = dom.create.typeParameter("mySimpleFunction_propertyParameter", paramInterface);
		expect(parameters[0].type).to.eql(interfaceType);
	});

	it("should create a function with an array of parameters with properties", () => {
		const parser = new JSDocTsdParser();
		parser.parse(interfaceData);

		const result = parser.resolveMembership();
		result.should.include.keys("myTestInterface");
		result.should.include.keys("myEmployeeFunction_employees");

		const parsedInterface: dom.InterfaceDeclaration = result.get("myTestInterface") as dom.InterfaceDeclaration;
		expect(parsedInterface.members.length).to.eq(2);

		const paramInterface: dom.InterfaceDeclaration = result.get("myEmployeeFunction_employees") as dom.InterfaceDeclaration;

		const methodDeclaration: dom.MethodDeclaration = parsedInterface.members[1] as dom.MethodDeclaration;
		expect(methodDeclaration.jsDocComment).to.eq(`Assign the project to a list of employees
@param employees - The employees who are responsible for the project
@param employees[].name - The name of an employee
@param employees[].department - The employee's department`);

		const parameters: dom.Parameter[] = methodDeclaration.parameters;
		expect(parameters.length).to.eq(1);

		const interfaceType = dom.create.array(paramInterface);
		expect(parameters[0].type).to.eql(interfaceType);
	});
});
