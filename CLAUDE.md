# Project Structure

* Specifications go in the `specs` folder
* OpenAPI specs go in the `specs/Apis` folder
* If you do any research on a topic, it should go into the `research` folder
* Code will go in the `src` folder
* Scripts will go in the `scripts` folder
* Terraform should go in the `infrastructure` folder

# Style guidelines

Use markdown for writing any documentation.

If you are designing an API you should tend towards CQRS patterns. You should categorise API actions into one of the following:
* Commands - These change state. If it isn't a GET verb, it's very likely a command
* Queries - These fetch data from a data store and present it.

# Tech choices

## Backend 

The backend should be written in C# 10. It should make use of the latest language features, including:

* OpenAPI automatic generation of an API spec
* All default namespaces should be `MilkRound` followed by the assembly name.
* It should make use of "hexagonal architecture" and ports and adapters.

The solution file (and all these assemblies) should be in the `src` folder. The solution file should be `MilkRound.sln` and contain the following projects:
* Application - This should contain the business logic that ties ports to their respective adapters. It should contain a series of command & query handlers. One for each query and command.
* Abstractions - This is a library that should contain the interfaces implemented in Adapters, and used in Application
* DataContracts - This should contain the domain entities that are used by the Client and the API controllers
* Api.Service - This is the entry point executable that should run the asp.net core API. The docker file should be in this project, and the ASP.Net Controllers. The controllers should call command and query handler interfaces defined in the Application library. It should use the domain objects from the DataContracts library
* Api.Client - This should contain a strongly type .net client that is auto-generated from the OpenAPI spec. It should generate this using the Refit library
* Adapters - These are the abstractions that bridge between the business logic in Application and the underlying implementation. e.g. cosmos DB. If you need to create a library for this please use the assembly name `Data.XXX` where XXX is a representative name of an abstraction.

### Tests

Tests should all go at the same level. All libraries should have a `.UnitTests` project, that contains unit tests for the abstractions in the matching project. We do not need to unit test _everything_, it's more important to have coverage of logic paths that overall code coverage

There should also be a `Service.ComponentTests` library that runs the entry point in memory with mocks for all the adapters. This should test that the API surface responds as expected.

We should also have `Service.FunctionalTests`. This library should "black box" test the library using an API address that is read from configuration. The tests in here should make use of the API client, and the assertions should be that the command makes the data changes that are expected

## Frontend

We want to use React Native for the front end. It should be based on a modern version and make use of expo.

It should be possible to build the front end with a single command, using expo.

# Hard Rules

Below are some hard rules that you should always follow:

* If you don't understand an instruction, ask for clarification
* If the instruction comes from a specification, update the spec, when the user has answered you

