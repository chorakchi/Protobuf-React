# Protobuf-React
Protocol Buffers are a method of serializing structured data. It is useful in developing programs to communicate with each other over a wire or for storing data


Protocol Buffers are a language-neutral, platform-neutral, extensible way of serializing structured data for use in communications protocols, data storage, and more, originally designed at Google (see).

this project work with protobuf.js is a pure JavaScript implementation with for node.js and the browser. It's easy to use, blazingly fast and works out of the box with .proto files!

For reference, the following diagram aims to display relationships between the different methods and the concept of a valid message:

<p align="center"><img alt="Toolset Diagram" src="http://dcode.io/protobuf.js/toolset.svg" /></p>

> In other words: `verify` indicates that calling `create` or `encode` directly on the plain object will [result in a valid message respectively] succeed. `fromObject`, on the other hand, does conversion from a broader range of plain objects to create valid messages. ([ref](https://github.com/dcodeIO/protobuf.js/issues/748#issuecomment-291925749))

### Usage with ES6/ TypeScript

The library ships with its own [type definitions](https://github.com/dcodeIO/protobuf.js/blob/master/index.d.ts) and modern editors like [Visual Studio Code](https://code.visualstudio.com/) will automatically detect and use them for code completion.

The npm package depends on [@types/node](https://www.npmjs.com/package/@types/node) because of `Buffer` and [@types/long](https://www.npmjs.com/package/@types/long) because of `Long`. If you are not building for node and/or not using long.js, it should be safe to exclude them manually.

#### Using the JS API

The API shown above works pretty much the same with TypeScript. However, because everything is typed, accessing fields on instances of dynamically generated message classes requires either using bracket-notation (i.e. `message["awesomeField"]`) or explicit casts. Alternatively, it is possible to use a [typings file generated for its static counterpart](#pbts-for-typescript).

```ts
import { load } from "protobufjs"; // respectively "./node_modules/protobufjs"

load("awesome.proto", function(err, root) {
  if (err)
    throw err;

  // example code
  const AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");

  let message = AwesomeMessage.create({ awesomeField: "hello" });
  console.log(`message = ${JSON.stringify(message)}`);

  let buffer = AwesomeMessage.encode(message).finish();
  console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

  let decoded = AwesomeMessage.decode(buffer);
  console.log(`decoded = ${JSON.stringify(decoded)}`);
});
```

#### Using generated static code

If you generated static code to `bundle.js` using the CLI and its type definitions to `bundle.d.ts`, then you can just do:

```ts
import { AwesomeMessage } from "./bundle.js";

// example code
let message = AwesomeMessage.create({ awesomeField: "hello" });
let buffer  = AwesomeMessage.encode(message).finish();
let decoded = AwesomeMessage.decode(buffer);
```

#### Using decorators

The library also includes an early implementation of [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

**Note** that decorators are an experimental feature in TypeScript and that declaration order is important depending on the JS target. For example, `@Field.d(2, AwesomeArrayMessage)` requires that `AwesomeArrayMessage` has been defined earlier when targeting `ES5`.

```ts
import { Message, Type, Field, OneOf } from "protobufjs/light"; // respectively "./node_modules/protobufjs/light.js"

export class AwesomeSubMessage extends Message<AwesomeSubMessage> {

  @Field.d(1, "string")
  public awesomeString: string;

}

export enum AwesomeEnum {
  ONE = 1,
  TWO = 2
}

@Type.d("SuperAwesomeMessage")
export class AwesomeMessage extends Message<AwesomeMessage> {

  @Field.d(1, "string", "optional", "awesome default string")
  public awesomeField: string;

  @Field.d(2, AwesomeSubMessage)
  public awesomeSubMessage: AwesomeSubMessage;

  @Field.d(3, AwesomeEnum, "optional", AwesomeEnum.ONE)
  public awesomeEnum: AwesomeEnum;

  @OneOf.d("awesomeSubMessage", "awesomeEnum")
  public which: string;

}

// example code
let message = new AwesomeMessage({ awesomeField: "hello" });
let buffer  = AwesomeMessage.encode(message).finish();
let decoded = AwesomeMessage.decode(buffer);
```

Supported decorators are:

* **Type.d(typeName?: `string`)** &nbsp; *(optional)*<br />
  annotates a class as a protobuf message type. If `typeName` is not specified, the constructor's runtime function name is used for the reflected type.

* **Field.d&lt;T>(fieldId: `number`, fieldType: `string | Constructor<T>`, fieldRule?: `"optional" | "required" | "repeated"`, defaultValue?: `T`)**<br />
  annotates a property as a protobuf field with the specified id and protobuf type.

* **MapField.d&lt;T extends { [key: string]: any }>(fieldId: `number`, fieldKeyType: `string`, fieldValueType. `string | Constructor<{}>`)**<br />
  annotates a property as a protobuf map field with the specified id, protobuf key and value type.

* **OneOf.d&lt;T extends string>(...fieldNames: `string[]`)**<br />
  annotates a property as a protobuf oneof covering the specified fields.

Other notes:

* Decorated types reside in `protobuf.roots["decorated"]` using a flat structure, so no duplicate names.
* Enums are copied to a reflected enum with a generic name on decorator evaluation because referenced enum objects have no runtime name the decorator could use.
* Default values must be specified as arguments to the decorator instead of using a property initializer for proper prototype behavior.
* Property names on decorated classes must not be renamed on compile time (i.e. by a minifier) because decorators just receive the original field name as a string.

<h1><p>
  <img alt="protobuf.js" src="https://github.com/dcodeIO/protobuf.js/raw/master/pbjs.png" width="120" height="104" />
  <img alt="React.js" src="http://www.anamuser.com/wp-content/uploads/2017/03/logo-578x270.png" width="120" height="104" />
</p></h1>
