
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Coin
 * 
 */
export type Coin = $Result.DefaultSelection<Prisma.$CoinPayload>
/**
 * Model Trade
 * 
 */
export type Trade = $Result.DefaultSelection<Prisma.$TradePayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Coins
 * const coins = await prisma.coin.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Coins
   * const coins = await prisma.coin.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.coin`: Exposes CRUD operations for the **Coin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Coins
    * const coins = await prisma.coin.findMany()
    * ```
    */
  get coin(): Prisma.CoinDelegate<ExtArgs>;

  /**
   * `prisma.trade`: Exposes CRUD operations for the **Trade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trades
    * const trades = await prisma.trade.findMany()
    * ```
    */
  get trade(): Prisma.TradeDelegate<ExtArgs>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.13.0
   * Query Engine version: b9a39a7ee606c28e3455d0fd60e78c3ba82b1a2b
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Coin: 'Coin',
    Trade: 'Trade',
    Post: 'Post'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'coin' | 'trade' | 'post'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      Coin: {
        payload: Prisma.$CoinPayload<ExtArgs>
        fields: Prisma.CoinFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CoinFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CoinFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>
          }
          findFirst: {
            args: Prisma.CoinFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CoinFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>
          }
          findMany: {
            args: Prisma.CoinFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>[]
          }
          create: {
            args: Prisma.CoinCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>
          }
          createMany: {
            args: Prisma.CoinCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.CoinDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>
          }
          update: {
            args: Prisma.CoinUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>
          }
          deleteMany: {
            args: Prisma.CoinDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CoinUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CoinUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$CoinPayload>
          }
          aggregate: {
            args: Prisma.CoinAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCoin>
          }
          groupBy: {
            args: Prisma.CoinGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CoinGroupByOutputType>[]
          }
          count: {
            args: Prisma.CoinCountArgs<ExtArgs>,
            result: $Utils.Optional<CoinCountAggregateOutputType> | number
          }
        }
      }
      Trade: {
        payload: Prisma.$TradePayload<ExtArgs>
        fields: Prisma.TradeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          findFirst: {
            args: Prisma.TradeFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          findMany: {
            args: Prisma.TradeFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>[]
          }
          create: {
            args: Prisma.TradeCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          createMany: {
            args: Prisma.TradeCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TradeDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          update: {
            args: Prisma.TradeUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          deleteMany: {
            args: Prisma.TradeDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TradeUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TradeUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TradePayload>
          }
          aggregate: {
            args: Prisma.TradeAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTrade>
          }
          groupBy: {
            args: Prisma.TradeGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TradeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeCountArgs<ExtArgs>,
            result: $Utils.Optional<TradeCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>,
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CoinCountOutputType
   */

  export type CoinCountOutputType = {
    trades: number
    posts: number
  }

  export type CoinCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | CoinCountOutputTypeCountTradesArgs
    posts?: boolean | CoinCountOutputTypeCountPostsArgs
  }

  // Custom InputTypes
  /**
   * CoinCountOutputType without action
   */
  export type CoinCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoinCountOutputType
     */
    select?: CoinCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CoinCountOutputType without action
   */
  export type CoinCountOutputTypeCountTradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
  }

  /**
   * CoinCountOutputType without action
   */
  export type CoinCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Coin
   */

  export type AggregateCoin = {
    _count: CoinCountAggregateOutputType | null
    _avg: CoinAvgAggregateOutputType | null
    _sum: CoinSumAggregateOutputType | null
    _min: CoinMinAggregateOutputType | null
    _max: CoinMaxAggregateOutputType | null
  }

  export type CoinAvgAggregateOutputType = {
    decimals: number | null
    likes: number | null
    target: number | null
    status: number | null
    suiReserve: number | null
  }

  export type CoinSumAggregateOutputType = {
    decimals: number | null
    likes: number | null
    target: bigint | null
    status: number | null
    suiReserve: bigint | null
  }

  export type CoinMinAggregateOutputType = {
    packageId: string | null
    module: string | null
    storeId: string | null
    creator: string | null
    decimals: number | null
    name: string | null
    symbol: string | null
    description: string | null
    iconUrl: string | null
    coinType: string | null
    website: string | null
    twitterUrl: string | null
    discordUrl: string | null
    telegramUrl: string | null
    whitepaperUrl: string | null
    likes: number | null
    target: bigint | null
    status: number | null
    suiReserve: bigint | null
    createdAt: Date | null
    updatedAt: Date | null
    signature: string | null
  }

  export type CoinMaxAggregateOutputType = {
    packageId: string | null
    module: string | null
    storeId: string | null
    creator: string | null
    decimals: number | null
    name: string | null
    symbol: string | null
    description: string | null
    iconUrl: string | null
    coinType: string | null
    website: string | null
    twitterUrl: string | null
    discordUrl: string | null
    telegramUrl: string | null
    whitepaperUrl: string | null
    likes: number | null
    target: bigint | null
    status: number | null
    suiReserve: bigint | null
    createdAt: Date | null
    updatedAt: Date | null
    signature: string | null
  }

  export type CoinCountAggregateOutputType = {
    packageId: number
    module: number
    storeId: number
    creator: number
    decimals: number
    name: number
    symbol: number
    description: number
    iconUrl: number
    coinType: number
    website: number
    twitterUrl: number
    discordUrl: number
    telegramUrl: number
    whitepaperUrl: number
    likes: number
    target: number
    status: number
    suiReserve: number
    createdAt: number
    updatedAt: number
    signature: number
    _all: number
  }


  export type CoinAvgAggregateInputType = {
    decimals?: true
    likes?: true
    target?: true
    status?: true
    suiReserve?: true
  }

  export type CoinSumAggregateInputType = {
    decimals?: true
    likes?: true
    target?: true
    status?: true
    suiReserve?: true
  }

  export type CoinMinAggregateInputType = {
    packageId?: true
    module?: true
    storeId?: true
    creator?: true
    decimals?: true
    name?: true
    symbol?: true
    description?: true
    iconUrl?: true
    coinType?: true
    website?: true
    twitterUrl?: true
    discordUrl?: true
    telegramUrl?: true
    whitepaperUrl?: true
    likes?: true
    target?: true
    status?: true
    suiReserve?: true
    createdAt?: true
    updatedAt?: true
    signature?: true
  }

  export type CoinMaxAggregateInputType = {
    packageId?: true
    module?: true
    storeId?: true
    creator?: true
    decimals?: true
    name?: true
    symbol?: true
    description?: true
    iconUrl?: true
    coinType?: true
    website?: true
    twitterUrl?: true
    discordUrl?: true
    telegramUrl?: true
    whitepaperUrl?: true
    likes?: true
    target?: true
    status?: true
    suiReserve?: true
    createdAt?: true
    updatedAt?: true
    signature?: true
  }

  export type CoinCountAggregateInputType = {
    packageId?: true
    module?: true
    storeId?: true
    creator?: true
    decimals?: true
    name?: true
    symbol?: true
    description?: true
    iconUrl?: true
    coinType?: true
    website?: true
    twitterUrl?: true
    discordUrl?: true
    telegramUrl?: true
    whitepaperUrl?: true
    likes?: true
    target?: true
    status?: true
    suiReserve?: true
    createdAt?: true
    updatedAt?: true
    signature?: true
    _all?: true
  }

  export type CoinAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coin to aggregate.
     */
    where?: CoinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coins to fetch.
     */
    orderBy?: CoinOrderByWithRelationInput | CoinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CoinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Coins
    **/
    _count?: true | CoinCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CoinAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CoinSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CoinMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CoinMaxAggregateInputType
  }

  export type GetCoinAggregateType<T extends CoinAggregateArgs> = {
        [P in keyof T & keyof AggregateCoin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCoin[P]>
      : GetScalarType<T[P], AggregateCoin[P]>
  }




  export type CoinGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CoinWhereInput
    orderBy?: CoinOrderByWithAggregationInput | CoinOrderByWithAggregationInput[]
    by: CoinScalarFieldEnum[] | CoinScalarFieldEnum
    having?: CoinScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CoinCountAggregateInputType | true
    _avg?: CoinAvgAggregateInputType
    _sum?: CoinSumAggregateInputType
    _min?: CoinMinAggregateInputType
    _max?: CoinMaxAggregateInputType
  }

  export type CoinGroupByOutputType = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description: string
    iconUrl: string
    coinType: string
    website: string
    twitterUrl: string
    discordUrl: string
    telegramUrl: string
    whitepaperUrl: string
    likes: number
    target: bigint
    status: number
    suiReserve: bigint
    createdAt: Date
    updatedAt: Date
    signature: string
    _count: CoinCountAggregateOutputType | null
    _avg: CoinAvgAggregateOutputType | null
    _sum: CoinSumAggregateOutputType | null
    _min: CoinMinAggregateOutputType | null
    _max: CoinMaxAggregateOutputType | null
  }

  type GetCoinGroupByPayload<T extends CoinGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CoinGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CoinGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CoinGroupByOutputType[P]>
            : GetScalarType<T[P], CoinGroupByOutputType[P]>
        }
      >
    >


  export type CoinSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    packageId?: boolean
    module?: boolean
    storeId?: boolean
    creator?: boolean
    decimals?: boolean
    name?: boolean
    symbol?: boolean
    description?: boolean
    iconUrl?: boolean
    coinType?: boolean
    website?: boolean
    twitterUrl?: boolean
    discordUrl?: boolean
    telegramUrl?: boolean
    whitepaperUrl?: boolean
    likes?: boolean
    target?: boolean
    status?: boolean
    suiReserve?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    signature?: boolean
    trades?: boolean | Coin$tradesArgs<ExtArgs>
    posts?: boolean | Coin$postsArgs<ExtArgs>
    _count?: boolean | CoinCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coin"]>

  export type CoinSelectScalar = {
    packageId?: boolean
    module?: boolean
    storeId?: boolean
    creator?: boolean
    decimals?: boolean
    name?: boolean
    symbol?: boolean
    description?: boolean
    iconUrl?: boolean
    coinType?: boolean
    website?: boolean
    twitterUrl?: boolean
    discordUrl?: boolean
    telegramUrl?: boolean
    whitepaperUrl?: boolean
    likes?: boolean
    target?: boolean
    status?: boolean
    suiReserve?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    signature?: boolean
  }


  export type CoinInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trades?: boolean | Coin$tradesArgs<ExtArgs>
    posts?: boolean | Coin$postsArgs<ExtArgs>
    _count?: boolean | CoinCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $CoinPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Coin"
    objects: {
      trades: Prisma.$TradePayload<ExtArgs>[]
      posts: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      packageId: string
      module: string
      storeId: string
      creator: string
      decimals: number
      name: string
      symbol: string
      description: string
      iconUrl: string
      coinType: string
      website: string
      twitterUrl: string
      discordUrl: string
      telegramUrl: string
      whitepaperUrl: string
      likes: number
      target: bigint
      status: number
      suiReserve: bigint
      createdAt: Date
      updatedAt: Date
      signature: string
    }, ExtArgs["result"]["coin"]>
    composites: {}
  }


  type CoinGetPayload<S extends boolean | null | undefined | CoinDefaultArgs> = $Result.GetResult<Prisma.$CoinPayload, S>

  type CoinCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CoinFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CoinCountAggregateInputType | true
    }

  export interface CoinDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Coin'], meta: { name: 'Coin' } }
    /**
     * Find zero or one Coin that matches the filter.
     * @param {CoinFindUniqueArgs} args - Arguments to find a Coin
     * @example
     * // Get one Coin
     * const coin = await prisma.coin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CoinFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, CoinFindUniqueArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Coin that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {CoinFindUniqueOrThrowArgs} args - Arguments to find a Coin
     * @example
     * // Get one Coin
     * const coin = await prisma.coin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CoinFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CoinFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Coin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinFindFirstArgs} args - Arguments to find a Coin
     * @example
     * // Get one Coin
     * const coin = await prisma.coin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CoinFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, CoinFindFirstArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Coin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinFindFirstOrThrowArgs} args - Arguments to find a Coin
     * @example
     * // Get one Coin
     * const coin = await prisma.coin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CoinFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CoinFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Coins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Coins
     * const coins = await prisma.coin.findMany()
     * 
     * // Get first 10 Coins
     * const coins = await prisma.coin.findMany({ take: 10 })
     * 
     * // Only select the `packageId`
     * const coinWithPackageIdOnly = await prisma.coin.findMany({ select: { packageId: true } })
     * 
    **/
    findMany<T extends CoinFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CoinFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Coin.
     * @param {CoinCreateArgs} args - Arguments to create a Coin.
     * @example
     * // Create one Coin
     * const Coin = await prisma.coin.create({
     *   data: {
     *     // ... data to create a Coin
     *   }
     * })
     * 
    **/
    create<T extends CoinCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CoinCreateArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Coins.
     *     @param {CoinCreateManyArgs} args - Arguments to create many Coins.
     *     @example
     *     // Create many Coins
     *     const coin = await prisma.coin.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CoinCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CoinCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Coin.
     * @param {CoinDeleteArgs} args - Arguments to delete one Coin.
     * @example
     * // Delete one Coin
     * const Coin = await prisma.coin.delete({
     *   where: {
     *     // ... filter to delete one Coin
     *   }
     * })
     * 
    **/
    delete<T extends CoinDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CoinDeleteArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Coin.
     * @param {CoinUpdateArgs} args - Arguments to update one Coin.
     * @example
     * // Update one Coin
     * const coin = await prisma.coin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CoinUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CoinUpdateArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Coins.
     * @param {CoinDeleteManyArgs} args - Arguments to filter Coins to delete.
     * @example
     * // Delete a few Coins
     * const { count } = await prisma.coin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CoinDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CoinDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Coins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Coins
     * const coin = await prisma.coin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CoinUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CoinUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Coin.
     * @param {CoinUpsertArgs} args - Arguments to update or create a Coin.
     * @example
     * // Update or create a Coin
     * const coin = await prisma.coin.upsert({
     *   create: {
     *     // ... data to create a Coin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Coin we want to update
     *   }
     * })
    **/
    upsert<T extends CoinUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CoinUpsertArgs<ExtArgs>>
    ): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Coins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinCountArgs} args - Arguments to filter Coins to count.
     * @example
     * // Count the number of Coins
     * const count = await prisma.coin.count({
     *   where: {
     *     // ... the filter for the Coins we want to count
     *   }
     * })
    **/
    count<T extends CoinCountArgs>(
      args?: Subset<T, CoinCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CoinCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Coin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CoinAggregateArgs>(args: Subset<T, CoinAggregateArgs>): Prisma.PrismaPromise<GetCoinAggregateType<T>>

    /**
     * Group by Coin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoinGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CoinGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CoinGroupByArgs['orderBy'] }
        : { orderBy?: CoinGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CoinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCoinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Coin model
   */
  readonly fields: CoinFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Coin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CoinClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    trades<T extends Coin$tradesArgs<ExtArgs> = {}>(args?: Subset<T, Coin$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findMany'> | Null>;

    posts<T extends Coin$postsArgs<ExtArgs> = {}>(args?: Subset<T, Coin$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Coin model
   */ 
  interface CoinFieldRefs {
    readonly packageId: FieldRef<"Coin", 'String'>
    readonly module: FieldRef<"Coin", 'String'>
    readonly storeId: FieldRef<"Coin", 'String'>
    readonly creator: FieldRef<"Coin", 'String'>
    readonly decimals: FieldRef<"Coin", 'Int'>
    readonly name: FieldRef<"Coin", 'String'>
    readonly symbol: FieldRef<"Coin", 'String'>
    readonly description: FieldRef<"Coin", 'String'>
    readonly iconUrl: FieldRef<"Coin", 'String'>
    readonly coinType: FieldRef<"Coin", 'String'>
    readonly website: FieldRef<"Coin", 'String'>
    readonly twitterUrl: FieldRef<"Coin", 'String'>
    readonly discordUrl: FieldRef<"Coin", 'String'>
    readonly telegramUrl: FieldRef<"Coin", 'String'>
    readonly whitepaperUrl: FieldRef<"Coin", 'String'>
    readonly likes: FieldRef<"Coin", 'Int'>
    readonly target: FieldRef<"Coin", 'BigInt'>
    readonly status: FieldRef<"Coin", 'Int'>
    readonly suiReserve: FieldRef<"Coin", 'BigInt'>
    readonly createdAt: FieldRef<"Coin", 'DateTime'>
    readonly updatedAt: FieldRef<"Coin", 'DateTime'>
    readonly signature: FieldRef<"Coin", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Coin findUnique
   */
  export type CoinFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * Filter, which Coin to fetch.
     */
    where: CoinWhereUniqueInput
  }

  /**
   * Coin findUniqueOrThrow
   */
  export type CoinFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * Filter, which Coin to fetch.
     */
    where: CoinWhereUniqueInput
  }

  /**
   * Coin findFirst
   */
  export type CoinFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * Filter, which Coin to fetch.
     */
    where?: CoinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coins to fetch.
     */
    orderBy?: CoinOrderByWithRelationInput | CoinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coins.
     */
    cursor?: CoinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coins.
     */
    distinct?: CoinScalarFieldEnum | CoinScalarFieldEnum[]
  }

  /**
   * Coin findFirstOrThrow
   */
  export type CoinFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * Filter, which Coin to fetch.
     */
    where?: CoinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coins to fetch.
     */
    orderBy?: CoinOrderByWithRelationInput | CoinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coins.
     */
    cursor?: CoinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coins.
     */
    distinct?: CoinScalarFieldEnum | CoinScalarFieldEnum[]
  }

  /**
   * Coin findMany
   */
  export type CoinFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * Filter, which Coins to fetch.
     */
    where?: CoinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coins to fetch.
     */
    orderBy?: CoinOrderByWithRelationInput | CoinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Coins.
     */
    cursor?: CoinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coins.
     */
    skip?: number
    distinct?: CoinScalarFieldEnum | CoinScalarFieldEnum[]
  }

  /**
   * Coin create
   */
  export type CoinCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * The data needed to create a Coin.
     */
    data: XOR<CoinCreateInput, CoinUncheckedCreateInput>
  }

  /**
   * Coin createMany
   */
  export type CoinCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Coins.
     */
    data: CoinCreateManyInput | CoinCreateManyInput[]
  }

  /**
   * Coin update
   */
  export type CoinUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * The data needed to update a Coin.
     */
    data: XOR<CoinUpdateInput, CoinUncheckedUpdateInput>
    /**
     * Choose, which Coin to update.
     */
    where: CoinWhereUniqueInput
  }

  /**
   * Coin updateMany
   */
  export type CoinUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Coins.
     */
    data: XOR<CoinUpdateManyMutationInput, CoinUncheckedUpdateManyInput>
    /**
     * Filter which Coins to update
     */
    where?: CoinWhereInput
  }

  /**
   * Coin upsert
   */
  export type CoinUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * The filter to search for the Coin to update in case it exists.
     */
    where: CoinWhereUniqueInput
    /**
     * In case the Coin found by the `where` argument doesn't exist, create a new Coin with this data.
     */
    create: XOR<CoinCreateInput, CoinUncheckedCreateInput>
    /**
     * In case the Coin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CoinUpdateInput, CoinUncheckedUpdateInput>
  }

  /**
   * Coin delete
   */
  export type CoinDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
    /**
     * Filter which Coin to delete.
     */
    where: CoinWhereUniqueInput
  }

  /**
   * Coin deleteMany
   */
  export type CoinDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coins to delete
     */
    where?: CoinWhereInput
  }

  /**
   * Coin.trades
   */
  export type Coin$tradesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    cursor?: TradeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Coin.posts
   */
  export type Coin$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Coin without action
   */
  export type CoinDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coin
     */
    select?: CoinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoinInclude<ExtArgs> | null
  }


  /**
   * Model Trade
   */

  export type AggregateTrade = {
    _count: TradeCountAggregateOutputType | null
    _avg: TradeAvgAggregateOutputType | null
    _sum: TradeSumAggregateOutputType | null
    _min: TradeMinAggregateOutputType | null
    _max: TradeMaxAggregateOutputType | null
  }

  export type TradeAvgAggregateOutputType = {
    id: number | null
    suiAmount: number | null
    coinAmount: number | null
    coinPrice: number | null
  }

  export type TradeSumAggregateOutputType = {
    id: number | null
    suiAmount: bigint | null
    coinAmount: bigint | null
    coinPrice: bigint | null
  }

  export type TradeMinAggregateOutputType = {
    id: number | null
    suiAmount: bigint | null
    coinAmount: bigint | null
    isBuy: boolean | null
    account: string | null
    coinId: string | null
    coinPrice: bigint | null
    transactionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradeMaxAggregateOutputType = {
    id: number | null
    suiAmount: bigint | null
    coinAmount: bigint | null
    isBuy: boolean | null
    account: string | null
    coinId: string | null
    coinPrice: bigint | null
    transactionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradeCountAggregateOutputType = {
    id: number
    suiAmount: number
    coinAmount: number
    isBuy: number
    account: number
    coinId: number
    coinPrice: number
    transactionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradeAvgAggregateInputType = {
    id?: true
    suiAmount?: true
    coinAmount?: true
    coinPrice?: true
  }

  export type TradeSumAggregateInputType = {
    id?: true
    suiAmount?: true
    coinAmount?: true
    coinPrice?: true
  }

  export type TradeMinAggregateInputType = {
    id?: true
    suiAmount?: true
    coinAmount?: true
    isBuy?: true
    account?: true
    coinId?: true
    coinPrice?: true
    transactionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradeMaxAggregateInputType = {
    id?: true
    suiAmount?: true
    coinAmount?: true
    isBuy?: true
    account?: true
    coinId?: true
    coinPrice?: true
    transactionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradeCountAggregateInputType = {
    id?: true
    suiAmount?: true
    coinAmount?: true
    isBuy?: true
    account?: true
    coinId?: true
    coinPrice?: true
    transactionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trade to aggregate.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trades
    **/
    _count?: true | TradeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeMaxAggregateInputType
  }

  export type GetTradeAggregateType<T extends TradeAggregateArgs> = {
        [P in keyof T & keyof AggregateTrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrade[P]>
      : GetScalarType<T[P], AggregateTrade[P]>
  }




  export type TradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeWhereInput
    orderBy?: TradeOrderByWithAggregationInput | TradeOrderByWithAggregationInput[]
    by: TradeScalarFieldEnum[] | TradeScalarFieldEnum
    having?: TradeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeCountAggregateInputType | true
    _avg?: TradeAvgAggregateInputType
    _sum?: TradeSumAggregateInputType
    _min?: TradeMinAggregateInputType
    _max?: TradeMaxAggregateInputType
  }

  export type TradeGroupByOutputType = {
    id: number
    suiAmount: bigint
    coinAmount: bigint
    isBuy: boolean
    account: string
    coinId: string
    coinPrice: bigint
    transactionId: string
    createdAt: Date
    updatedAt: Date
    _count: TradeCountAggregateOutputType | null
    _avg: TradeAvgAggregateOutputType | null
    _sum: TradeSumAggregateOutputType | null
    _min: TradeMinAggregateOutputType | null
    _max: TradeMaxAggregateOutputType | null
  }

  type GetTradeGroupByPayload<T extends TradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeGroupByOutputType[P]>
            : GetScalarType<T[P], TradeGroupByOutputType[P]>
        }
      >
    >


  export type TradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    suiAmount?: boolean
    coinAmount?: boolean
    isBuy?: boolean
    account?: boolean
    coinId?: boolean
    coinPrice?: boolean
    transactionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    coin?: boolean | CoinDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trade"]>

  export type TradeSelectScalar = {
    id?: boolean
    suiAmount?: boolean
    coinAmount?: boolean
    isBuy?: boolean
    account?: boolean
    coinId?: boolean
    coinPrice?: boolean
    transactionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type TradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coin?: boolean | CoinDefaultArgs<ExtArgs>
  }


  export type $TradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trade"
    objects: {
      coin: Prisma.$CoinPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      suiAmount: bigint
      coinAmount: bigint
      isBuy: boolean
      account: string
      coinId: string
      coinPrice: bigint
      transactionId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trade"]>
    composites: {}
  }


  type TradeGetPayload<S extends boolean | null | undefined | TradeDefaultArgs> = $Result.GetResult<Prisma.$TradePayload, S>

  type TradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TradeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TradeCountAggregateInputType | true
    }

  export interface TradeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trade'], meta: { name: 'Trade' } }
    /**
     * Find zero or one Trade that matches the filter.
     * @param {TradeFindUniqueArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TradeFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TradeFindUniqueArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Trade that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TradeFindUniqueOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TradeFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TradeFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Trade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TradeFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TradeFindFirstArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Trade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindFirstOrThrowArgs} args - Arguments to find a Trade
     * @example
     * // Get one Trade
     * const trade = await prisma.trade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TradeFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TradeFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Trades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trades
     * const trades = await prisma.trade.findMany()
     * 
     * // Get first 10 Trades
     * const trades = await prisma.trade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeWithIdOnly = await prisma.trade.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TradeFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TradeFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Trade.
     * @param {TradeCreateArgs} args - Arguments to create a Trade.
     * @example
     * // Create one Trade
     * const Trade = await prisma.trade.create({
     *   data: {
     *     // ... data to create a Trade
     *   }
     * })
     * 
    **/
    create<T extends TradeCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TradeCreateArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Trades.
     *     @param {TradeCreateManyArgs} args - Arguments to create many Trades.
     *     @example
     *     // Create many Trades
     *     const trade = await prisma.trade.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TradeCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TradeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Trade.
     * @param {TradeDeleteArgs} args - Arguments to delete one Trade.
     * @example
     * // Delete one Trade
     * const Trade = await prisma.trade.delete({
     *   where: {
     *     // ... filter to delete one Trade
     *   }
     * })
     * 
    **/
    delete<T extends TradeDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TradeDeleteArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Trade.
     * @param {TradeUpdateArgs} args - Arguments to update one Trade.
     * @example
     * // Update one Trade
     * const trade = await prisma.trade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TradeUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TradeUpdateArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Trades.
     * @param {TradeDeleteManyArgs} args - Arguments to filter Trades to delete.
     * @example
     * // Delete a few Trades
     * const { count } = await prisma.trade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TradeDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TradeDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trades
     * const trade = await prisma.trade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TradeUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TradeUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Trade.
     * @param {TradeUpsertArgs} args - Arguments to update or create a Trade.
     * @example
     * // Update or create a Trade
     * const trade = await prisma.trade.upsert({
     *   create: {
     *     // ... data to create a Trade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trade we want to update
     *   }
     * })
    **/
    upsert<T extends TradeUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TradeUpsertArgs<ExtArgs>>
    ): Prisma__TradeClient<$Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Trades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeCountArgs} args - Arguments to filter Trades to count.
     * @example
     * // Count the number of Trades
     * const count = await prisma.trade.count({
     *   where: {
     *     // ... the filter for the Trades we want to count
     *   }
     * })
    **/
    count<T extends TradeCountArgs>(
      args?: Subset<T, TradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradeAggregateArgs>(args: Subset<T, TradeAggregateArgs>): Prisma.PrismaPromise<GetTradeAggregateType<T>>

    /**
     * Group by Trade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeGroupByArgs['orderBy'] }
        : { orderBy?: TradeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trade model
   */
  readonly fields: TradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    coin<T extends CoinDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CoinDefaultArgs<ExtArgs>>): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Trade model
   */ 
  interface TradeFieldRefs {
    readonly id: FieldRef<"Trade", 'Int'>
    readonly suiAmount: FieldRef<"Trade", 'BigInt'>
    readonly coinAmount: FieldRef<"Trade", 'BigInt'>
    readonly isBuy: FieldRef<"Trade", 'Boolean'>
    readonly account: FieldRef<"Trade", 'String'>
    readonly coinId: FieldRef<"Trade", 'String'>
    readonly coinPrice: FieldRef<"Trade", 'BigInt'>
    readonly transactionId: FieldRef<"Trade", 'String'>
    readonly createdAt: FieldRef<"Trade", 'DateTime'>
    readonly updatedAt: FieldRef<"Trade", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Trade findUnique
   */
  export type TradeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade findUniqueOrThrow
   */
  export type TradeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade findFirst
   */
  export type TradeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade findFirstOrThrow
   */
  export type TradeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trade to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trades.
     */
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade findMany
   */
  export type TradeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter, which Trades to fetch.
     */
    where?: TradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trades to fetch.
     */
    orderBy?: TradeOrderByWithRelationInput | TradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trades.
     */
    cursor?: TradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trades.
     */
    skip?: number
    distinct?: TradeScalarFieldEnum | TradeScalarFieldEnum[]
  }

  /**
   * Trade create
   */
  export type TradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The data needed to create a Trade.
     */
    data: XOR<TradeCreateInput, TradeUncheckedCreateInput>
  }

  /**
   * Trade createMany
   */
  export type TradeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trades.
     */
    data: TradeCreateManyInput | TradeCreateManyInput[]
  }

  /**
   * Trade update
   */
  export type TradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The data needed to update a Trade.
     */
    data: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>
    /**
     * Choose, which Trade to update.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade updateMany
   */
  export type TradeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trades.
     */
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyInput>
    /**
     * Filter which Trades to update
     */
    where?: TradeWhereInput
  }

  /**
   * Trade upsert
   */
  export type TradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * The filter to search for the Trade to update in case it exists.
     */
    where: TradeWhereUniqueInput
    /**
     * In case the Trade found by the `where` argument doesn't exist, create a new Trade with this data.
     */
    create: XOR<TradeCreateInput, TradeUncheckedCreateInput>
    /**
     * In case the Trade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeUpdateInput, TradeUncheckedUpdateInput>
  }

  /**
   * Trade delete
   */
  export type TradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
    /**
     * Filter which Trade to delete.
     */
    where: TradeWhereUniqueInput
  }

  /**
   * Trade deleteMany
   */
  export type TradeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trades to delete
     */
    where?: TradeWhereInput
  }

  /**
   * Trade without action
   */
  export type TradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: TradeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
    likes: number | null
  }

  export type PostSumAggregateOutputType = {
    id: number | null
    likes: number | null
  }

  export type PostMinAggregateOutputType = {
    id: number | null
    coinId: string | null
    authorId: string | null
    text: string | null
    likes: number | null
    createdAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    coinId: string | null
    authorId: string | null
    text: string | null
    likes: number | null
    createdAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    coinId: number
    authorId: number
    text: number
    likes: number
    createdAt: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
    likes?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
    likes?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    coinId?: true
    authorId?: true
    text?: true
    likes?: true
    createdAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    coinId?: true
    authorId?: true
    text?: true
    likes?: true
    createdAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    coinId?: true
    authorId?: true
    text?: true
    likes?: true
    createdAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: number
    coinId: string
    authorId: string
    text: string
    likes: number
    createdAt: Date
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    coinId?: boolean
    authorId?: boolean
    text?: boolean
    likes?: boolean
    createdAt?: boolean
    coin?: boolean | CoinDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    coinId?: boolean
    authorId?: boolean
    text?: boolean
    likes?: boolean
    createdAt?: boolean
  }


  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coin?: boolean | CoinDefaultArgs<ExtArgs>
  }


  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      coin: Prisma.$CoinPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      coinId: string
      authorId: string
      text: string
      likes: number
      createdAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }


  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PostFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Post that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PostFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PostFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
    **/
    create<T extends PostCreateArgs<ExtArgs>>(
      args: SelectSubset<T, PostCreateArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Posts.
     *     @param {PostCreateManyArgs} args - Arguments to create many Posts.
     *     @example
     *     // Create many Posts
     *     const post = await prisma.post.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends PostCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
    **/
    delete<T extends PostDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, PostDeleteArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PostUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, PostUpdateArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PostDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PostUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
    **/
    upsert<T extends PostUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, PostUpsertArgs<ExtArgs>>
    ): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    coin<T extends CoinDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CoinDefaultArgs<ExtArgs>>): Prisma__CoinClient<$Result.GetResult<Prisma.$CoinPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Post model
   */ 
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'Int'>
    readonly coinId: FieldRef<"Post", 'String'>
    readonly authorId: FieldRef<"Post", 'String'>
    readonly text: FieldRef<"Post", 'String'>
    readonly likes: FieldRef<"Post", 'Int'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CoinScalarFieldEnum: {
    packageId: 'packageId',
    module: 'module',
    storeId: 'storeId',
    creator: 'creator',
    decimals: 'decimals',
    name: 'name',
    symbol: 'symbol',
    description: 'description',
    iconUrl: 'iconUrl',
    coinType: 'coinType',
    website: 'website',
    twitterUrl: 'twitterUrl',
    discordUrl: 'discordUrl',
    telegramUrl: 'telegramUrl',
    whitepaperUrl: 'whitepaperUrl',
    likes: 'likes',
    target: 'target',
    status: 'status',
    suiReserve: 'suiReserve',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    signature: 'signature'
  };

  export type CoinScalarFieldEnum = (typeof CoinScalarFieldEnum)[keyof typeof CoinScalarFieldEnum]


  export const TradeScalarFieldEnum: {
    id: 'id',
    suiAmount: 'suiAmount',
    coinAmount: 'coinAmount',
    isBuy: 'isBuy',
    account: 'account',
    coinId: 'coinId',
    coinPrice: 'coinPrice',
    transactionId: 'transactionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradeScalarFieldEnum = (typeof TradeScalarFieldEnum)[keyof typeof TradeScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    coinId: 'coinId',
    authorId: 'authorId',
    text: 'text',
    likes: 'likes',
    createdAt: 'createdAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type CoinWhereInput = {
    AND?: CoinWhereInput | CoinWhereInput[]
    OR?: CoinWhereInput[]
    NOT?: CoinWhereInput | CoinWhereInput[]
    packageId?: StringFilter<"Coin"> | string
    module?: StringFilter<"Coin"> | string
    storeId?: StringFilter<"Coin"> | string
    creator?: StringFilter<"Coin"> | string
    decimals?: IntFilter<"Coin"> | number
    name?: StringFilter<"Coin"> | string
    symbol?: StringFilter<"Coin"> | string
    description?: StringFilter<"Coin"> | string
    iconUrl?: StringFilter<"Coin"> | string
    coinType?: StringFilter<"Coin"> | string
    website?: StringFilter<"Coin"> | string
    twitterUrl?: StringFilter<"Coin"> | string
    discordUrl?: StringFilter<"Coin"> | string
    telegramUrl?: StringFilter<"Coin"> | string
    whitepaperUrl?: StringFilter<"Coin"> | string
    likes?: IntFilter<"Coin"> | number
    target?: BigIntFilter<"Coin"> | bigint | number
    status?: IntFilter<"Coin"> | number
    suiReserve?: BigIntFilter<"Coin"> | bigint | number
    createdAt?: DateTimeFilter<"Coin"> | Date | string
    updatedAt?: DateTimeFilter<"Coin"> | Date | string
    signature?: StringFilter<"Coin"> | string
    trades?: TradeListRelationFilter
    posts?: PostListRelationFilter
  }

  export type CoinOrderByWithRelationInput = {
    packageId?: SortOrder
    module?: SortOrder
    storeId?: SortOrder
    creator?: SortOrder
    decimals?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    description?: SortOrder
    iconUrl?: SortOrder
    coinType?: SortOrder
    website?: SortOrder
    twitterUrl?: SortOrder
    discordUrl?: SortOrder
    telegramUrl?: SortOrder
    whitepaperUrl?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    signature?: SortOrder
    trades?: TradeOrderByRelationAggregateInput
    posts?: PostOrderByRelationAggregateInput
  }

  export type CoinWhereUniqueInput = Prisma.AtLeast<{
    packageId?: string
    AND?: CoinWhereInput | CoinWhereInput[]
    OR?: CoinWhereInput[]
    NOT?: CoinWhereInput | CoinWhereInput[]
    module?: StringFilter<"Coin"> | string
    storeId?: StringFilter<"Coin"> | string
    creator?: StringFilter<"Coin"> | string
    decimals?: IntFilter<"Coin"> | number
    name?: StringFilter<"Coin"> | string
    symbol?: StringFilter<"Coin"> | string
    description?: StringFilter<"Coin"> | string
    iconUrl?: StringFilter<"Coin"> | string
    coinType?: StringFilter<"Coin"> | string
    website?: StringFilter<"Coin"> | string
    twitterUrl?: StringFilter<"Coin"> | string
    discordUrl?: StringFilter<"Coin"> | string
    telegramUrl?: StringFilter<"Coin"> | string
    whitepaperUrl?: StringFilter<"Coin"> | string
    likes?: IntFilter<"Coin"> | number
    target?: BigIntFilter<"Coin"> | bigint | number
    status?: IntFilter<"Coin"> | number
    suiReserve?: BigIntFilter<"Coin"> | bigint | number
    createdAt?: DateTimeFilter<"Coin"> | Date | string
    updatedAt?: DateTimeFilter<"Coin"> | Date | string
    signature?: StringFilter<"Coin"> | string
    trades?: TradeListRelationFilter
    posts?: PostListRelationFilter
  }, "packageId">

  export type CoinOrderByWithAggregationInput = {
    packageId?: SortOrder
    module?: SortOrder
    storeId?: SortOrder
    creator?: SortOrder
    decimals?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    description?: SortOrder
    iconUrl?: SortOrder
    coinType?: SortOrder
    website?: SortOrder
    twitterUrl?: SortOrder
    discordUrl?: SortOrder
    telegramUrl?: SortOrder
    whitepaperUrl?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    signature?: SortOrder
    _count?: CoinCountOrderByAggregateInput
    _avg?: CoinAvgOrderByAggregateInput
    _max?: CoinMaxOrderByAggregateInput
    _min?: CoinMinOrderByAggregateInput
    _sum?: CoinSumOrderByAggregateInput
  }

  export type CoinScalarWhereWithAggregatesInput = {
    AND?: CoinScalarWhereWithAggregatesInput | CoinScalarWhereWithAggregatesInput[]
    OR?: CoinScalarWhereWithAggregatesInput[]
    NOT?: CoinScalarWhereWithAggregatesInput | CoinScalarWhereWithAggregatesInput[]
    packageId?: StringWithAggregatesFilter<"Coin"> | string
    module?: StringWithAggregatesFilter<"Coin"> | string
    storeId?: StringWithAggregatesFilter<"Coin"> | string
    creator?: StringWithAggregatesFilter<"Coin"> | string
    decimals?: IntWithAggregatesFilter<"Coin"> | number
    name?: StringWithAggregatesFilter<"Coin"> | string
    symbol?: StringWithAggregatesFilter<"Coin"> | string
    description?: StringWithAggregatesFilter<"Coin"> | string
    iconUrl?: StringWithAggregatesFilter<"Coin"> | string
    coinType?: StringWithAggregatesFilter<"Coin"> | string
    website?: StringWithAggregatesFilter<"Coin"> | string
    twitterUrl?: StringWithAggregatesFilter<"Coin"> | string
    discordUrl?: StringWithAggregatesFilter<"Coin"> | string
    telegramUrl?: StringWithAggregatesFilter<"Coin"> | string
    whitepaperUrl?: StringWithAggregatesFilter<"Coin"> | string
    likes?: IntWithAggregatesFilter<"Coin"> | number
    target?: BigIntWithAggregatesFilter<"Coin"> | bigint | number
    status?: IntWithAggregatesFilter<"Coin"> | number
    suiReserve?: BigIntWithAggregatesFilter<"Coin"> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<"Coin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Coin"> | Date | string
    signature?: StringWithAggregatesFilter<"Coin"> | string
  }

  export type TradeWhereInput = {
    AND?: TradeWhereInput | TradeWhereInput[]
    OR?: TradeWhereInput[]
    NOT?: TradeWhereInput | TradeWhereInput[]
    id?: IntFilter<"Trade"> | number
    suiAmount?: BigIntFilter<"Trade"> | bigint | number
    coinAmount?: BigIntFilter<"Trade"> | bigint | number
    isBuy?: BoolFilter<"Trade"> | boolean
    account?: StringFilter<"Trade"> | string
    coinId?: StringFilter<"Trade"> | string
    coinPrice?: BigIntFilter<"Trade"> | bigint | number
    transactionId?: StringFilter<"Trade"> | string
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    updatedAt?: DateTimeFilter<"Trade"> | Date | string
    coin?: XOR<CoinRelationFilter, CoinWhereInput>
  }

  export type TradeOrderByWithRelationInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    isBuy?: SortOrder
    account?: SortOrder
    coinId?: SortOrder
    coinPrice?: SortOrder
    transactionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coin?: CoinOrderByWithRelationInput
  }

  export type TradeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TradeWhereInput | TradeWhereInput[]
    OR?: TradeWhereInput[]
    NOT?: TradeWhereInput | TradeWhereInput[]
    suiAmount?: BigIntFilter<"Trade"> | bigint | number
    coinAmount?: BigIntFilter<"Trade"> | bigint | number
    isBuy?: BoolFilter<"Trade"> | boolean
    account?: StringFilter<"Trade"> | string
    coinId?: StringFilter<"Trade"> | string
    coinPrice?: BigIntFilter<"Trade"> | bigint | number
    transactionId?: StringFilter<"Trade"> | string
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    updatedAt?: DateTimeFilter<"Trade"> | Date | string
    coin?: XOR<CoinRelationFilter, CoinWhereInput>
  }, "id">

  export type TradeOrderByWithAggregationInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    isBuy?: SortOrder
    account?: SortOrder
    coinId?: SortOrder
    coinPrice?: SortOrder
    transactionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradeCountOrderByAggregateInput
    _avg?: TradeAvgOrderByAggregateInput
    _max?: TradeMaxOrderByAggregateInput
    _min?: TradeMinOrderByAggregateInput
    _sum?: TradeSumOrderByAggregateInput
  }

  export type TradeScalarWhereWithAggregatesInput = {
    AND?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[]
    OR?: TradeScalarWhereWithAggregatesInput[]
    NOT?: TradeScalarWhereWithAggregatesInput | TradeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Trade"> | number
    suiAmount?: BigIntWithAggregatesFilter<"Trade"> | bigint | number
    coinAmount?: BigIntWithAggregatesFilter<"Trade"> | bigint | number
    isBuy?: BoolWithAggregatesFilter<"Trade"> | boolean
    account?: StringWithAggregatesFilter<"Trade"> | string
    coinId?: StringWithAggregatesFilter<"Trade"> | string
    coinPrice?: BigIntWithAggregatesFilter<"Trade"> | bigint | number
    transactionId?: StringWithAggregatesFilter<"Trade"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Trade"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Trade"> | Date | string
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: IntFilter<"Post"> | number
    coinId?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    text?: StringFilter<"Post"> | string
    likes?: IntFilter<"Post"> | number
    createdAt?: DateTimeFilter<"Post"> | Date | string
    coin?: XOR<CoinRelationFilter, CoinWhereInput>
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    coinId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    likes?: SortOrder
    createdAt?: SortOrder
    coin?: CoinOrderByWithRelationInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    coinId?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    text?: StringFilter<"Post"> | string
    likes?: IntFilter<"Post"> | number
    createdAt?: DateTimeFilter<"Post"> | Date | string
    coin?: XOR<CoinRelationFilter, CoinWhereInput>
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    coinId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    likes?: SortOrder
    createdAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Post"> | number
    coinId?: StringWithAggregatesFilter<"Post"> | string
    authorId?: StringWithAggregatesFilter<"Post"> | string
    text?: StringWithAggregatesFilter<"Post"> | string
    likes?: IntWithAggregatesFilter<"Post"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type CoinCreateInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
    trades?: TradeCreateNestedManyWithoutCoinInput
    posts?: PostCreateNestedManyWithoutCoinInput
  }

  export type CoinUncheckedCreateInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
    trades?: TradeUncheckedCreateNestedManyWithoutCoinInput
    posts?: PostUncheckedCreateNestedManyWithoutCoinInput
  }

  export type CoinUpdateInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    trades?: TradeUpdateManyWithoutCoinNestedInput
    posts?: PostUpdateManyWithoutCoinNestedInput
  }

  export type CoinUncheckedUpdateInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    trades?: TradeUncheckedUpdateManyWithoutCoinNestedInput
    posts?: PostUncheckedUpdateManyWithoutCoinNestedInput
  }

  export type CoinCreateManyInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
  }

  export type CoinUpdateManyMutationInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
  }

  export type CoinUncheckedUpdateManyInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
  }

  export type TradeCreateInput = {
    suiAmount: bigint | number
    coinAmount: bigint | number
    isBuy: boolean
    account: string
    coinPrice: bigint | number
    transactionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coin: CoinCreateNestedOneWithoutTradesInput
  }

  export type TradeUncheckedCreateInput = {
    id?: number
    suiAmount: bigint | number
    coinAmount: bigint | number
    isBuy: boolean
    account: string
    coinId: string
    coinPrice: bigint | number
    transactionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeUpdateInput = {
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coin?: CoinUpdateOneRequiredWithoutTradesNestedInput
  }

  export type TradeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinId?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeCreateManyInput = {
    id?: number
    suiAmount: bigint | number
    coinAmount: bigint | number
    isBuy: boolean
    account: string
    coinId: string
    coinPrice: bigint | number
    transactionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeUpdateManyMutationInput = {
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinId?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateInput = {
    authorId?: string
    text: string
    likes?: number
    createdAt?: Date | string
    coin: CoinCreateNestedOneWithoutPostsInput
  }

  export type PostUncheckedCreateInput = {
    id?: number
    coinId: string
    authorId?: string
    text: string
    likes?: number
    createdAt?: Date | string
  }

  export type PostUpdateInput = {
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coin?: CoinUpdateOneRequiredWithoutPostsNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    coinId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyInput = {
    id?: number
    coinId: string
    authorId?: string
    text: string
    likes?: number
    createdAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    coinId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TradeListRelationFilter = {
    every?: TradeWhereInput
    some?: TradeWhereInput
    none?: TradeWhereInput
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type TradeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CoinCountOrderByAggregateInput = {
    packageId?: SortOrder
    module?: SortOrder
    storeId?: SortOrder
    creator?: SortOrder
    decimals?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    description?: SortOrder
    iconUrl?: SortOrder
    coinType?: SortOrder
    website?: SortOrder
    twitterUrl?: SortOrder
    discordUrl?: SortOrder
    telegramUrl?: SortOrder
    whitepaperUrl?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    signature?: SortOrder
  }

  export type CoinAvgOrderByAggregateInput = {
    decimals?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
  }

  export type CoinMaxOrderByAggregateInput = {
    packageId?: SortOrder
    module?: SortOrder
    storeId?: SortOrder
    creator?: SortOrder
    decimals?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    description?: SortOrder
    iconUrl?: SortOrder
    coinType?: SortOrder
    website?: SortOrder
    twitterUrl?: SortOrder
    discordUrl?: SortOrder
    telegramUrl?: SortOrder
    whitepaperUrl?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    signature?: SortOrder
  }

  export type CoinMinOrderByAggregateInput = {
    packageId?: SortOrder
    module?: SortOrder
    storeId?: SortOrder
    creator?: SortOrder
    decimals?: SortOrder
    name?: SortOrder
    symbol?: SortOrder
    description?: SortOrder
    iconUrl?: SortOrder
    coinType?: SortOrder
    website?: SortOrder
    twitterUrl?: SortOrder
    discordUrl?: SortOrder
    telegramUrl?: SortOrder
    whitepaperUrl?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    signature?: SortOrder
  }

  export type CoinSumOrderByAggregateInput = {
    decimals?: SortOrder
    likes?: SortOrder
    target?: SortOrder
    status?: SortOrder
    suiReserve?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CoinRelationFilter = {
    is?: CoinWhereInput
    isNot?: CoinWhereInput
  }

  export type TradeCountOrderByAggregateInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    isBuy?: SortOrder
    account?: SortOrder
    coinId?: SortOrder
    coinPrice?: SortOrder
    transactionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeAvgOrderByAggregateInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    coinPrice?: SortOrder
  }

  export type TradeMaxOrderByAggregateInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    isBuy?: SortOrder
    account?: SortOrder
    coinId?: SortOrder
    coinPrice?: SortOrder
    transactionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeMinOrderByAggregateInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    isBuy?: SortOrder
    account?: SortOrder
    coinId?: SortOrder
    coinPrice?: SortOrder
    transactionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeSumOrderByAggregateInput = {
    id?: SortOrder
    suiAmount?: SortOrder
    coinAmount?: SortOrder
    coinPrice?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    coinId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    likes?: SortOrder
    createdAt?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    id?: SortOrder
    likes?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    coinId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    likes?: SortOrder
    createdAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    coinId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    likes?: SortOrder
    createdAt?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    id?: SortOrder
    likes?: SortOrder
  }

  export type TradeCreateNestedManyWithoutCoinInput = {
    create?: XOR<TradeCreateWithoutCoinInput, TradeUncheckedCreateWithoutCoinInput> | TradeCreateWithoutCoinInput[] | TradeUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutCoinInput | TradeCreateOrConnectWithoutCoinInput[]
    createMany?: TradeCreateManyCoinInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutCoinInput = {
    create?: XOR<PostCreateWithoutCoinInput, PostUncheckedCreateWithoutCoinInput> | PostCreateWithoutCoinInput[] | PostUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCoinInput | PostCreateOrConnectWithoutCoinInput[]
    createMany?: PostCreateManyCoinInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type TradeUncheckedCreateNestedManyWithoutCoinInput = {
    create?: XOR<TradeCreateWithoutCoinInput, TradeUncheckedCreateWithoutCoinInput> | TradeCreateWithoutCoinInput[] | TradeUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutCoinInput | TradeCreateOrConnectWithoutCoinInput[]
    createMany?: TradeCreateManyCoinInputEnvelope
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutCoinInput = {
    create?: XOR<PostCreateWithoutCoinInput, PostUncheckedCreateWithoutCoinInput> | PostCreateWithoutCoinInput[] | PostUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCoinInput | PostCreateOrConnectWithoutCoinInput[]
    createMany?: PostCreateManyCoinInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TradeUpdateManyWithoutCoinNestedInput = {
    create?: XOR<TradeCreateWithoutCoinInput, TradeUncheckedCreateWithoutCoinInput> | TradeCreateWithoutCoinInput[] | TradeUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutCoinInput | TradeCreateOrConnectWithoutCoinInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutCoinInput | TradeUpsertWithWhereUniqueWithoutCoinInput[]
    createMany?: TradeCreateManyCoinInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutCoinInput | TradeUpdateWithWhereUniqueWithoutCoinInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutCoinInput | TradeUpdateManyWithWhereWithoutCoinInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type PostUpdateManyWithoutCoinNestedInput = {
    create?: XOR<PostCreateWithoutCoinInput, PostUncheckedCreateWithoutCoinInput> | PostCreateWithoutCoinInput[] | PostUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCoinInput | PostCreateOrConnectWithoutCoinInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutCoinInput | PostUpsertWithWhereUniqueWithoutCoinInput[]
    createMany?: PostCreateManyCoinInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutCoinInput | PostUpdateWithWhereUniqueWithoutCoinInput[]
    updateMany?: PostUpdateManyWithWhereWithoutCoinInput | PostUpdateManyWithWhereWithoutCoinInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type TradeUncheckedUpdateManyWithoutCoinNestedInput = {
    create?: XOR<TradeCreateWithoutCoinInput, TradeUncheckedCreateWithoutCoinInput> | TradeCreateWithoutCoinInput[] | TradeUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: TradeCreateOrConnectWithoutCoinInput | TradeCreateOrConnectWithoutCoinInput[]
    upsert?: TradeUpsertWithWhereUniqueWithoutCoinInput | TradeUpsertWithWhereUniqueWithoutCoinInput[]
    createMany?: TradeCreateManyCoinInputEnvelope
    set?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    disconnect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    delete?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    connect?: TradeWhereUniqueInput | TradeWhereUniqueInput[]
    update?: TradeUpdateWithWhereUniqueWithoutCoinInput | TradeUpdateWithWhereUniqueWithoutCoinInput[]
    updateMany?: TradeUpdateManyWithWhereWithoutCoinInput | TradeUpdateManyWithWhereWithoutCoinInput[]
    deleteMany?: TradeScalarWhereInput | TradeScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutCoinNestedInput = {
    create?: XOR<PostCreateWithoutCoinInput, PostUncheckedCreateWithoutCoinInput> | PostCreateWithoutCoinInput[] | PostUncheckedCreateWithoutCoinInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCoinInput | PostCreateOrConnectWithoutCoinInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutCoinInput | PostUpsertWithWhereUniqueWithoutCoinInput[]
    createMany?: PostCreateManyCoinInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutCoinInput | PostUpdateWithWhereUniqueWithoutCoinInput[]
    updateMany?: PostUpdateManyWithWhereWithoutCoinInput | PostUpdateManyWithWhereWithoutCoinInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type CoinCreateNestedOneWithoutTradesInput = {
    create?: XOR<CoinCreateWithoutTradesInput, CoinUncheckedCreateWithoutTradesInput>
    connectOrCreate?: CoinCreateOrConnectWithoutTradesInput
    connect?: CoinWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CoinUpdateOneRequiredWithoutTradesNestedInput = {
    create?: XOR<CoinCreateWithoutTradesInput, CoinUncheckedCreateWithoutTradesInput>
    connectOrCreate?: CoinCreateOrConnectWithoutTradesInput
    upsert?: CoinUpsertWithoutTradesInput
    connect?: CoinWhereUniqueInput
    update?: XOR<XOR<CoinUpdateToOneWithWhereWithoutTradesInput, CoinUpdateWithoutTradesInput>, CoinUncheckedUpdateWithoutTradesInput>
  }

  export type CoinCreateNestedOneWithoutPostsInput = {
    create?: XOR<CoinCreateWithoutPostsInput, CoinUncheckedCreateWithoutPostsInput>
    connectOrCreate?: CoinCreateOrConnectWithoutPostsInput
    connect?: CoinWhereUniqueInput
  }

  export type CoinUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<CoinCreateWithoutPostsInput, CoinUncheckedCreateWithoutPostsInput>
    connectOrCreate?: CoinCreateOrConnectWithoutPostsInput
    upsert?: CoinUpsertWithoutPostsInput
    connect?: CoinWhereUniqueInput
    update?: XOR<XOR<CoinUpdateToOneWithWhereWithoutPostsInput, CoinUpdateWithoutPostsInput>, CoinUncheckedUpdateWithoutPostsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TradeCreateWithoutCoinInput = {
    suiAmount: bigint | number
    coinAmount: bigint | number
    isBuy: boolean
    account: string
    coinPrice: bigint | number
    transactionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeUncheckedCreateWithoutCoinInput = {
    id?: number
    suiAmount: bigint | number
    coinAmount: bigint | number
    isBuy: boolean
    account: string
    coinPrice: bigint | number
    transactionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeCreateOrConnectWithoutCoinInput = {
    where: TradeWhereUniqueInput
    create: XOR<TradeCreateWithoutCoinInput, TradeUncheckedCreateWithoutCoinInput>
  }

  export type TradeCreateManyCoinInputEnvelope = {
    data: TradeCreateManyCoinInput | TradeCreateManyCoinInput[]
  }

  export type PostCreateWithoutCoinInput = {
    authorId?: string
    text: string
    likes?: number
    createdAt?: Date | string
  }

  export type PostUncheckedCreateWithoutCoinInput = {
    id?: number
    authorId?: string
    text: string
    likes?: number
    createdAt?: Date | string
  }

  export type PostCreateOrConnectWithoutCoinInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutCoinInput, PostUncheckedCreateWithoutCoinInput>
  }

  export type PostCreateManyCoinInputEnvelope = {
    data: PostCreateManyCoinInput | PostCreateManyCoinInput[]
  }

  export type TradeUpsertWithWhereUniqueWithoutCoinInput = {
    where: TradeWhereUniqueInput
    update: XOR<TradeUpdateWithoutCoinInput, TradeUncheckedUpdateWithoutCoinInput>
    create: XOR<TradeCreateWithoutCoinInput, TradeUncheckedCreateWithoutCoinInput>
  }

  export type TradeUpdateWithWhereUniqueWithoutCoinInput = {
    where: TradeWhereUniqueInput
    data: XOR<TradeUpdateWithoutCoinInput, TradeUncheckedUpdateWithoutCoinInput>
  }

  export type TradeUpdateManyWithWhereWithoutCoinInput = {
    where: TradeScalarWhereInput
    data: XOR<TradeUpdateManyMutationInput, TradeUncheckedUpdateManyWithoutCoinInput>
  }

  export type TradeScalarWhereInput = {
    AND?: TradeScalarWhereInput | TradeScalarWhereInput[]
    OR?: TradeScalarWhereInput[]
    NOT?: TradeScalarWhereInput | TradeScalarWhereInput[]
    id?: IntFilter<"Trade"> | number
    suiAmount?: BigIntFilter<"Trade"> | bigint | number
    coinAmount?: BigIntFilter<"Trade"> | bigint | number
    isBuy?: BoolFilter<"Trade"> | boolean
    account?: StringFilter<"Trade"> | string
    coinId?: StringFilter<"Trade"> | string
    coinPrice?: BigIntFilter<"Trade"> | bigint | number
    transactionId?: StringFilter<"Trade"> | string
    createdAt?: DateTimeFilter<"Trade"> | Date | string
    updatedAt?: DateTimeFilter<"Trade"> | Date | string
  }

  export type PostUpsertWithWhereUniqueWithoutCoinInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutCoinInput, PostUncheckedUpdateWithoutCoinInput>
    create: XOR<PostCreateWithoutCoinInput, PostUncheckedCreateWithoutCoinInput>
  }

  export type PostUpdateWithWhereUniqueWithoutCoinInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutCoinInput, PostUncheckedUpdateWithoutCoinInput>
  }

  export type PostUpdateManyWithWhereWithoutCoinInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutCoinInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: IntFilter<"Post"> | number
    coinId?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    text?: StringFilter<"Post"> | string
    likes?: IntFilter<"Post"> | number
    createdAt?: DateTimeFilter<"Post"> | Date | string
  }

  export type CoinCreateWithoutTradesInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
    posts?: PostCreateNestedManyWithoutCoinInput
  }

  export type CoinUncheckedCreateWithoutTradesInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
    posts?: PostUncheckedCreateNestedManyWithoutCoinInput
  }

  export type CoinCreateOrConnectWithoutTradesInput = {
    where: CoinWhereUniqueInput
    create: XOR<CoinCreateWithoutTradesInput, CoinUncheckedCreateWithoutTradesInput>
  }

  export type CoinUpsertWithoutTradesInput = {
    update: XOR<CoinUpdateWithoutTradesInput, CoinUncheckedUpdateWithoutTradesInput>
    create: XOR<CoinCreateWithoutTradesInput, CoinUncheckedCreateWithoutTradesInput>
    where?: CoinWhereInput
  }

  export type CoinUpdateToOneWithWhereWithoutTradesInput = {
    where?: CoinWhereInput
    data: XOR<CoinUpdateWithoutTradesInput, CoinUncheckedUpdateWithoutTradesInput>
  }

  export type CoinUpdateWithoutTradesInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    posts?: PostUpdateManyWithoutCoinNestedInput
  }

  export type CoinUncheckedUpdateWithoutTradesInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    posts?: PostUncheckedUpdateManyWithoutCoinNestedInput
  }

  export type CoinCreateWithoutPostsInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
    trades?: TradeCreateNestedManyWithoutCoinInput
  }

  export type CoinUncheckedCreateWithoutPostsInput = {
    packageId: string
    module: string
    storeId: string
    creator: string
    decimals: number
    name: string
    symbol: string
    description?: string
    iconUrl?: string
    coinType: string
    website?: string
    twitterUrl?: string
    discordUrl?: string
    telegramUrl?: string
    whitepaperUrl?: string
    likes?: number
    target?: bigint | number
    status?: number
    suiReserve?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    signature?: string
    trades?: TradeUncheckedCreateNestedManyWithoutCoinInput
  }

  export type CoinCreateOrConnectWithoutPostsInput = {
    where: CoinWhereUniqueInput
    create: XOR<CoinCreateWithoutPostsInput, CoinUncheckedCreateWithoutPostsInput>
  }

  export type CoinUpsertWithoutPostsInput = {
    update: XOR<CoinUpdateWithoutPostsInput, CoinUncheckedUpdateWithoutPostsInput>
    create: XOR<CoinCreateWithoutPostsInput, CoinUncheckedCreateWithoutPostsInput>
    where?: CoinWhereInput
  }

  export type CoinUpdateToOneWithWhereWithoutPostsInput = {
    where?: CoinWhereInput
    data: XOR<CoinUpdateWithoutPostsInput, CoinUncheckedUpdateWithoutPostsInput>
  }

  export type CoinUpdateWithoutPostsInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    trades?: TradeUpdateManyWithoutCoinNestedInput
  }

  export type CoinUncheckedUpdateWithoutPostsInput = {
    packageId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    decimals?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    iconUrl?: StringFieldUpdateOperationsInput | string
    coinType?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    twitterUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: StringFieldUpdateOperationsInput | string
    telegramUrl?: StringFieldUpdateOperationsInput | string
    whitepaperUrl?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    target?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: IntFieldUpdateOperationsInput | number
    suiReserve?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signature?: StringFieldUpdateOperationsInput | string
    trades?: TradeUncheckedUpdateManyWithoutCoinNestedInput
  }

  export type TradeCreateManyCoinInput = {
    id?: number
    suiAmount: bigint | number
    coinAmount: bigint | number
    isBuy: boolean
    account: string
    coinPrice: bigint | number
    transactionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostCreateManyCoinInput = {
    id?: number
    authorId?: string
    text: string
    likes?: number
    createdAt?: Date | string
  }

  export type TradeUpdateWithoutCoinInput = {
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeUncheckedUpdateWithoutCoinInput = {
    id?: IntFieldUpdateOperationsInput | number
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeUncheckedUpdateManyWithoutCoinInput = {
    id?: IntFieldUpdateOperationsInput | number
    suiAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    coinAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    isBuy?: BoolFieldUpdateOperationsInput | boolean
    account?: StringFieldUpdateOperationsInput | string
    coinPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    transactionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpdateWithoutCoinInput = {
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateWithoutCoinInput = {
    id?: IntFieldUpdateOperationsInput | number
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyWithoutCoinInput = {
    id?: IntFieldUpdateOperationsInput | number
    authorId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    likes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CoinCountOutputTypeDefaultArgs instead
     */
    export type CoinCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CoinCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CoinDefaultArgs instead
     */
    export type CoinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CoinDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TradeDefaultArgs instead
     */
    export type TradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostDefaultArgs instead
     */
    export type PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}