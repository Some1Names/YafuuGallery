
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model Manga
 * 
 */
export type Manga = $Result.DefaultSelection<Prisma.$MangaPayload>
/**
 * Model Arc
 * 
 */
export type Arc = $Result.DefaultSelection<Prisma.$ArcPayload>
/**
 * Model Chapter
 * 
 */
export type Chapter = $Result.DefaultSelection<Prisma.$ChapterPayload>
/**
 * Model Translation
 * 
 */
export type Translation = $Result.DefaultSelection<Prisma.$TranslationPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Bookmark
 * 
 */
export type Bookmark = $Result.DefaultSelection<Prisma.$BookmarkPayload>
/**
 * Model ChapterBookmark
 * 
 */
export type ChapterBookmark = $Result.DefaultSelection<Prisma.$ChapterBookmarkPayload>
/**
 * Model ReadingProgress
 * 
 */
export type ReadingProgress = $Result.DefaultSelection<Prisma.$ReadingProgressPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  reader: 'reader',
  author: 'author',
  admin: 'admin'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Language: {
  th: 'th',
  en: 'en',
  ja: 'ja'
};

export type Language = (typeof Language)[keyof typeof Language]


export const ArcStatus: {
  ongoing: 'ongoing',
  completed: 'completed'
};

export type ArcStatus = (typeof ArcStatus)[keyof typeof ArcStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Language = $Enums.Language

export const Language: typeof $Enums.Language

export type ArcStatus = $Enums.ArcStatus

export const ArcStatus: typeof $Enums.ArcStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.manga`: Exposes CRUD operations for the **Manga** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Manga
    * const manga = await prisma.manga.findMany()
    * ```
    */
  get manga(): Prisma.MangaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.arc`: Exposes CRUD operations for the **Arc** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Arcs
    * const arcs = await prisma.arc.findMany()
    * ```
    */
  get arc(): Prisma.ArcDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chapter`: Exposes CRUD operations for the **Chapter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chapters
    * const chapters = await prisma.chapter.findMany()
    * ```
    */
  get chapter(): Prisma.ChapterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.translation`: Exposes CRUD operations for the **Translation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Translations
    * const translations = await prisma.translation.findMany()
    * ```
    */
  get translation(): Prisma.TranslationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookmark`: Exposes CRUD operations for the **Bookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookmarks
    * const bookmarks = await prisma.bookmark.findMany()
    * ```
    */
  get bookmark(): Prisma.BookmarkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chapterBookmark`: Exposes CRUD operations for the **ChapterBookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChapterBookmarks
    * const chapterBookmarks = await prisma.chapterBookmark.findMany()
    * ```
    */
  get chapterBookmark(): Prisma.ChapterBookmarkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.readingProgress`: Exposes CRUD operations for the **ReadingProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReadingProgresses
    * const readingProgresses = await prisma.readingProgress.findMany()
    * ```
    */
  get readingProgress(): Prisma.ReadingProgressDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

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
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    Verification: 'Verification',
    Manga: 'Manga',
    Arc: 'Arc',
    Chapter: 'Chapter',
    Translation: 'Translation',
    Comment: 'Comment',
    Bookmark: 'Bookmark',
    ChapterBookmark: 'ChapterBookmark',
    ReadingProgress: 'ReadingProgress'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "session" | "verification" | "manga" | "arc" | "chapter" | "translation" | "comment" | "bookmark" | "chapterBookmark" | "readingProgress"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      Manga: {
        payload: Prisma.$MangaPayload<ExtArgs>
        fields: Prisma.MangaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MangaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MangaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>
          }
          findFirst: {
            args: Prisma.MangaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MangaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>
          }
          findMany: {
            args: Prisma.MangaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>[]
          }
          create: {
            args: Prisma.MangaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>
          }
          createMany: {
            args: Prisma.MangaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MangaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>[]
          }
          delete: {
            args: Prisma.MangaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>
          }
          update: {
            args: Prisma.MangaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>
          }
          deleteMany: {
            args: Prisma.MangaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MangaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MangaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>[]
          }
          upsert: {
            args: Prisma.MangaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MangaPayload>
          }
          aggregate: {
            args: Prisma.MangaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManga>
          }
          groupBy: {
            args: Prisma.MangaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MangaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MangaCountArgs<ExtArgs>
            result: $Utils.Optional<MangaCountAggregateOutputType> | number
          }
        }
      }
      Arc: {
        payload: Prisma.$ArcPayload<ExtArgs>
        fields: Prisma.ArcFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArcFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArcFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>
          }
          findFirst: {
            args: Prisma.ArcFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArcFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>
          }
          findMany: {
            args: Prisma.ArcFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>[]
          }
          create: {
            args: Prisma.ArcCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>
          }
          createMany: {
            args: Prisma.ArcCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArcCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>[]
          }
          delete: {
            args: Prisma.ArcDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>
          }
          update: {
            args: Prisma.ArcUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>
          }
          deleteMany: {
            args: Prisma.ArcDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArcUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArcUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>[]
          }
          upsert: {
            args: Prisma.ArcUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArcPayload>
          }
          aggregate: {
            args: Prisma.ArcAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArc>
          }
          groupBy: {
            args: Prisma.ArcGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArcGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArcCountArgs<ExtArgs>
            result: $Utils.Optional<ArcCountAggregateOutputType> | number
          }
        }
      }
      Chapter: {
        payload: Prisma.$ChapterPayload<ExtArgs>
        fields: Prisma.ChapterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChapterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChapterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          findFirst: {
            args: Prisma.ChapterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChapterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          findMany: {
            args: Prisma.ChapterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>[]
          }
          create: {
            args: Prisma.ChapterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          createMany: {
            args: Prisma.ChapterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChapterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>[]
          }
          delete: {
            args: Prisma.ChapterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          update: {
            args: Prisma.ChapterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          deleteMany: {
            args: Prisma.ChapterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChapterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChapterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>[]
          }
          upsert: {
            args: Prisma.ChapterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          aggregate: {
            args: Prisma.ChapterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChapter>
          }
          groupBy: {
            args: Prisma.ChapterGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChapterGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChapterCountArgs<ExtArgs>
            result: $Utils.Optional<ChapterCountAggregateOutputType> | number
          }
        }
      }
      Translation: {
        payload: Prisma.$TranslationPayload<ExtArgs>
        fields: Prisma.TranslationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranslationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranslationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          findFirst: {
            args: Prisma.TranslationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranslationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          findMany: {
            args: Prisma.TranslationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>[]
          }
          create: {
            args: Prisma.TranslationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          createMany: {
            args: Prisma.TranslationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranslationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>[]
          }
          delete: {
            args: Prisma.TranslationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          update: {
            args: Prisma.TranslationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          deleteMany: {
            args: Prisma.TranslationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranslationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranslationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>[]
          }
          upsert: {
            args: Prisma.TranslationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          aggregate: {
            args: Prisma.TranslationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranslation>
          }
          groupBy: {
            args: Prisma.TranslationGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranslationGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranslationCountArgs<ExtArgs>
            result: $Utils.Optional<TranslationCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Bookmark: {
        payload: Prisma.$BookmarkPayload<ExtArgs>
        fields: Prisma.BookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findFirst: {
            args: Prisma.BookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findMany: {
            args: Prisma.BookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          create: {
            args: Prisma.BookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          createMany: {
            args: Prisma.BookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          delete: {
            args: Prisma.BookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          update: {
            args: Prisma.BookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          deleteMany: {
            args: Prisma.BookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          upsert: {
            args: Prisma.BookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          aggregate: {
            args: Prisma.BookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookmark>
          }
          groupBy: {
            args: Prisma.BookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<BookmarkCountAggregateOutputType> | number
          }
        }
      }
      ChapterBookmark: {
        payload: Prisma.$ChapterBookmarkPayload<ExtArgs>
        fields: Prisma.ChapterBookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChapterBookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChapterBookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>
          }
          findFirst: {
            args: Prisma.ChapterBookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChapterBookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>
          }
          findMany: {
            args: Prisma.ChapterBookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>[]
          }
          create: {
            args: Prisma.ChapterBookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>
          }
          createMany: {
            args: Prisma.ChapterBookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChapterBookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>[]
          }
          delete: {
            args: Prisma.ChapterBookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>
          }
          update: {
            args: Prisma.ChapterBookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>
          }
          deleteMany: {
            args: Prisma.ChapterBookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChapterBookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChapterBookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>[]
          }
          upsert: {
            args: Prisma.ChapterBookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterBookmarkPayload>
          }
          aggregate: {
            args: Prisma.ChapterBookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChapterBookmark>
          }
          groupBy: {
            args: Prisma.ChapterBookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChapterBookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChapterBookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<ChapterBookmarkCountAggregateOutputType> | number
          }
        }
      }
      ReadingProgress: {
        payload: Prisma.$ReadingProgressPayload<ExtArgs>
        fields: Prisma.ReadingProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReadingProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReadingProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          findFirst: {
            args: Prisma.ReadingProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReadingProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          findMany: {
            args: Prisma.ReadingProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>[]
          }
          create: {
            args: Prisma.ReadingProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          createMany: {
            args: Prisma.ReadingProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReadingProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>[]
          }
          delete: {
            args: Prisma.ReadingProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          update: {
            args: Prisma.ReadingProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          deleteMany: {
            args: Prisma.ReadingProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReadingProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReadingProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>[]
          }
          upsert: {
            args: Prisma.ReadingProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingProgressPayload>
          }
          aggregate: {
            args: Prisma.ReadingProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReadingProgress>
          }
          groupBy: {
            args: Prisma.ReadingProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReadingProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReadingProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ReadingProgressCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    verification?: VerificationOmit
    manga?: MangaOmit
    arc?: ArcOmit
    chapter?: ChapterOmit
    translation?: TranslationOmit
    comment?: CommentOmit
    bookmark?: BookmarkOmit
    chapterBookmark?: ChapterBookmarkOmit
    readingProgress?: ReadingProgressOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    manga: number
    translations: number
    comments: number
    bookmarks: number
    chapter_bookmarks: number
    reading_progress: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    manga?: boolean | UserCountOutputTypeCountMangaArgs
    translations?: boolean | UserCountOutputTypeCountTranslationsArgs
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
    bookmarks?: boolean | UserCountOutputTypeCountBookmarksArgs
    chapter_bookmarks?: boolean | UserCountOutputTypeCountChapter_bookmarksArgs
    reading_progress?: boolean | UserCountOutputTypeCountReading_progressArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMangaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MangaWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTranslationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChapter_bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterBookmarkWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReading_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingProgressWhereInput
  }


  /**
   * Count Type MangaCountOutputType
   */

  export type MangaCountOutputType = {
    arcs: number
    chapters: number
    bookmarks: number
  }

  export type MangaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    arcs?: boolean | MangaCountOutputTypeCountArcsArgs
    chapters?: boolean | MangaCountOutputTypeCountChaptersArgs
    bookmarks?: boolean | MangaCountOutputTypeCountBookmarksArgs
  }

  // Custom InputTypes
  /**
   * MangaCountOutputType without action
   */
  export type MangaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MangaCountOutputType
     */
    select?: MangaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MangaCountOutputType without action
   */
  export type MangaCountOutputTypeCountArcsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArcWhereInput
  }

  /**
   * MangaCountOutputType without action
   */
  export type MangaCountOutputTypeCountChaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterWhereInput
  }

  /**
   * MangaCountOutputType without action
   */
  export type MangaCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }


  /**
   * Count Type ArcCountOutputType
   */

  export type ArcCountOutputType = {
    chapters: number
  }

  export type ArcCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapters?: boolean | ArcCountOutputTypeCountChaptersArgs
  }

  // Custom InputTypes
  /**
   * ArcCountOutputType without action
   */
  export type ArcCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArcCountOutputType
     */
    select?: ArcCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArcCountOutputType without action
   */
  export type ArcCountOutputTypeCountChaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterWhereInput
  }


  /**
   * Count Type ChapterCountOutputType
   */

  export type ChapterCountOutputType = {
    translations: number
    comments: number
    reading_progress: number
    chapter_bookmarks: number
  }

  export type ChapterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translations?: boolean | ChapterCountOutputTypeCountTranslationsArgs
    comments?: boolean | ChapterCountOutputTypeCountCommentsArgs
    reading_progress?: boolean | ChapterCountOutputTypeCountReading_progressArgs
    chapter_bookmarks?: boolean | ChapterCountOutputTypeCountChapter_bookmarksArgs
  }

  // Custom InputTypes
  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterCountOutputType
     */
    select?: ChapterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeCountTranslationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslationWhereInput
  }

  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeCountReading_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingProgressWhereInput
  }

  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeCountChapter_bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterBookmarkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: boolean | null
    name: string | null
    image: string | null
    role: $Enums.Role | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: boolean | null
    name: string | null
    image: string | null
    role: $Enums.Role | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    emailVerified: number
    name: number
    image: number
    role: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    image?: true
    role?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    image?: true
    role?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    image?: true
    role?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    emailVerified: boolean
    name: string | null
    image: string | null
    role: $Enums.Role
    created_at: Date
    updated_at: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    image?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    manga?: boolean | User$mangaArgs<ExtArgs>
    translations?: boolean | User$translationsArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    bookmarks?: boolean | User$bookmarksArgs<ExtArgs>
    chapter_bookmarks?: boolean | User$chapter_bookmarksArgs<ExtArgs>
    reading_progress?: boolean | User$reading_progressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    image?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    image?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    image?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "emailVerified" | "name" | "image" | "role" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    manga?: boolean | User$mangaArgs<ExtArgs>
    translations?: boolean | User$translationsArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    bookmarks?: boolean | User$bookmarksArgs<ExtArgs>
    chapter_bookmarks?: boolean | User$chapter_bookmarksArgs<ExtArgs>
    reading_progress?: boolean | User$reading_progressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      manga: Prisma.$MangaPayload<ExtArgs>[]
      translations: Prisma.$TranslationPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
      bookmarks: Prisma.$BookmarkPayload<ExtArgs>[]
      chapter_bookmarks: Prisma.$ChapterBookmarkPayload<ExtArgs>[]
      reading_progress: Prisma.$ReadingProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      emailVerified: boolean
      name: string | null
      image: string | null
      role: $Enums.Role
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    manga<T extends User$mangaArgs<ExtArgs> = {}>(args?: Subset<T, User$mangaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    translations<T extends User$translationsArgs<ExtArgs> = {}>(args?: Subset<T, User$translationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends User$commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookmarks<T extends User$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, User$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chapter_bookmarks<T extends User$chapter_bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, User$chapter_bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reading_progress<T extends User$reading_progressArgs<ExtArgs> = {}>(args?: Subset<T, User$reading_progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly name: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.manga
   */
  export type User$mangaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    where?: MangaWhereInput
    orderBy?: MangaOrderByWithRelationInput | MangaOrderByWithRelationInput[]
    cursor?: MangaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MangaScalarFieldEnum | MangaScalarFieldEnum[]
  }

  /**
   * User.translations
   */
  export type User$translationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    where?: TranslationWhereInput
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    cursor?: TranslationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * User.comments
   */
  export type User$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.bookmarks
   */
  export type User$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * User.chapter_bookmarks
   */
  export type User$chapter_bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    where?: ChapterBookmarkWhereInput
    orderBy?: ChapterBookmarkOrderByWithRelationInput | ChapterBookmarkOrderByWithRelationInput[]
    cursor?: ChapterBookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChapterBookmarkScalarFieldEnum | ChapterBookmarkScalarFieldEnum[]
  }

  /**
   * User.reading_progress
   */
  export type User$reading_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    where?: ReadingProgressWhereInput
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    cursor?: ReadingProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    issuer: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    issuer: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    issuer: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    issuer?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    issuer?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    issuer?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    issuer: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    issuer?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    issuer?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    issuer?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    issuer?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "issuer" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      issuer: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly issuer: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    token: string | null
    expiresAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    token: string | null
    expiresAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    token: number
    expiresAt: number
    ipAddress: number
    userAgent: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    token?: true
    expiresAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    token?: true
    expiresAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    token?: true
    expiresAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    token: string
    expiresAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "expiresAt" | "ipAddress" | "userAgent" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      expiresAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly token: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
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
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model Manga
   */

  export type AggregateManga = {
    _count: MangaCountAggregateOutputType | null
    _min: MangaMinAggregateOutputType | null
    _max: MangaMaxAggregateOutputType | null
  }

  export type MangaMinAggregateOutputType = {
    id: string | null
    author_id: string | null
    manga_title: string | null
    manga_synopsis: string | null
    cover_image_url: string | null
    banner_image_url: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MangaMaxAggregateOutputType = {
    id: string | null
    author_id: string | null
    manga_title: string | null
    manga_synopsis: string | null
    cover_image_url: string | null
    banner_image_url: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MangaCountAggregateOutputType = {
    id: number
    author_id: number
    manga_title: number
    manga_synopsis: number
    cover_image_url: number
    banner_image_url: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type MangaMinAggregateInputType = {
    id?: true
    author_id?: true
    manga_title?: true
    manga_synopsis?: true
    cover_image_url?: true
    banner_image_url?: true
    created_at?: true
    updated_at?: true
  }

  export type MangaMaxAggregateInputType = {
    id?: true
    author_id?: true
    manga_title?: true
    manga_synopsis?: true
    cover_image_url?: true
    banner_image_url?: true
    created_at?: true
    updated_at?: true
  }

  export type MangaCountAggregateInputType = {
    id?: true
    author_id?: true
    manga_title?: true
    manga_synopsis?: true
    cover_image_url?: true
    banner_image_url?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type MangaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Manga to aggregate.
     */
    where?: MangaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manga to fetch.
     */
    orderBy?: MangaOrderByWithRelationInput | MangaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MangaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manga from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manga.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Manga
    **/
    _count?: true | MangaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MangaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MangaMaxAggregateInputType
  }

  export type GetMangaAggregateType<T extends MangaAggregateArgs> = {
        [P in keyof T & keyof AggregateManga]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManga[P]>
      : GetScalarType<T[P], AggregateManga[P]>
  }




  export type MangaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MangaWhereInput
    orderBy?: MangaOrderByWithAggregationInput | MangaOrderByWithAggregationInput[]
    by: MangaScalarFieldEnum[] | MangaScalarFieldEnum
    having?: MangaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MangaCountAggregateInputType | true
    _min?: MangaMinAggregateInputType
    _max?: MangaMaxAggregateInputType
  }

  export type MangaGroupByOutputType = {
    id: string
    author_id: string
    manga_title: string
    manga_synopsis: string
    cover_image_url: string | null
    banner_image_url: string | null
    created_at: Date
    updated_at: Date
    _count: MangaCountAggregateOutputType | null
    _min: MangaMinAggregateOutputType | null
    _max: MangaMaxAggregateOutputType | null
  }

  type GetMangaGroupByPayload<T extends MangaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MangaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MangaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MangaGroupByOutputType[P]>
            : GetScalarType<T[P], MangaGroupByOutputType[P]>
        }
      >
    >


  export type MangaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    author_id?: boolean
    manga_title?: boolean
    manga_synopsis?: boolean
    cover_image_url?: boolean
    banner_image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    arcs?: boolean | Manga$arcsArgs<ExtArgs>
    chapters?: boolean | Manga$chaptersArgs<ExtArgs>
    bookmarks?: boolean | Manga$bookmarksArgs<ExtArgs>
    _count?: boolean | MangaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manga"]>

  export type MangaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    author_id?: boolean
    manga_title?: boolean
    manga_synopsis?: boolean
    cover_image_url?: boolean
    banner_image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manga"]>

  export type MangaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    author_id?: boolean
    manga_title?: boolean
    manga_synopsis?: boolean
    cover_image_url?: boolean
    banner_image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manga"]>

  export type MangaSelectScalar = {
    id?: boolean
    author_id?: boolean
    manga_title?: boolean
    manga_synopsis?: boolean
    cover_image_url?: boolean
    banner_image_url?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type MangaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "author_id" | "manga_title" | "manga_synopsis" | "cover_image_url" | "banner_image_url" | "created_at" | "updated_at", ExtArgs["result"]["manga"]>
  export type MangaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    arcs?: boolean | Manga$arcsArgs<ExtArgs>
    chapters?: boolean | Manga$chaptersArgs<ExtArgs>
    bookmarks?: boolean | Manga$bookmarksArgs<ExtArgs>
    _count?: boolean | MangaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MangaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MangaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MangaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Manga"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      arcs: Prisma.$ArcPayload<ExtArgs>[]
      chapters: Prisma.$ChapterPayload<ExtArgs>[]
      bookmarks: Prisma.$BookmarkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      author_id: string
      manga_title: string
      manga_synopsis: string
      cover_image_url: string | null
      banner_image_url: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["manga"]>
    composites: {}
  }

  type MangaGetPayload<S extends boolean | null | undefined | MangaDefaultArgs> = $Result.GetResult<Prisma.$MangaPayload, S>

  type MangaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MangaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MangaCountAggregateInputType | true
    }

  export interface MangaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Manga'], meta: { name: 'Manga' } }
    /**
     * Find zero or one Manga that matches the filter.
     * @param {MangaFindUniqueArgs} args - Arguments to find a Manga
     * @example
     * // Get one Manga
     * const manga = await prisma.manga.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MangaFindUniqueArgs>(args: SelectSubset<T, MangaFindUniqueArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Manga that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MangaFindUniqueOrThrowArgs} args - Arguments to find a Manga
     * @example
     * // Get one Manga
     * const manga = await prisma.manga.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MangaFindUniqueOrThrowArgs>(args: SelectSubset<T, MangaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Manga that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaFindFirstArgs} args - Arguments to find a Manga
     * @example
     * // Get one Manga
     * const manga = await prisma.manga.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MangaFindFirstArgs>(args?: SelectSubset<T, MangaFindFirstArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Manga that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaFindFirstOrThrowArgs} args - Arguments to find a Manga
     * @example
     * // Get one Manga
     * const manga = await prisma.manga.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MangaFindFirstOrThrowArgs>(args?: SelectSubset<T, MangaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Manga that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Manga
     * const manga = await prisma.manga.findMany()
     * 
     * // Get first 10 Manga
     * const manga = await prisma.manga.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mangaWithIdOnly = await prisma.manga.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MangaFindManyArgs>(args?: SelectSubset<T, MangaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Manga.
     * @param {MangaCreateArgs} args - Arguments to create a Manga.
     * @example
     * // Create one Manga
     * const Manga = await prisma.manga.create({
     *   data: {
     *     // ... data to create a Manga
     *   }
     * })
     * 
     */
    create<T extends MangaCreateArgs>(args: SelectSubset<T, MangaCreateArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Manga.
     * @param {MangaCreateManyArgs} args - Arguments to create many Manga.
     * @example
     * // Create many Manga
     * const manga = await prisma.manga.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MangaCreateManyArgs>(args?: SelectSubset<T, MangaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Manga and returns the data saved in the database.
     * @param {MangaCreateManyAndReturnArgs} args - Arguments to create many Manga.
     * @example
     * // Create many Manga
     * const manga = await prisma.manga.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Manga and only return the `id`
     * const mangaWithIdOnly = await prisma.manga.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MangaCreateManyAndReturnArgs>(args?: SelectSubset<T, MangaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Manga.
     * @param {MangaDeleteArgs} args - Arguments to delete one Manga.
     * @example
     * // Delete one Manga
     * const Manga = await prisma.manga.delete({
     *   where: {
     *     // ... filter to delete one Manga
     *   }
     * })
     * 
     */
    delete<T extends MangaDeleteArgs>(args: SelectSubset<T, MangaDeleteArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Manga.
     * @param {MangaUpdateArgs} args - Arguments to update one Manga.
     * @example
     * // Update one Manga
     * const manga = await prisma.manga.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MangaUpdateArgs>(args: SelectSubset<T, MangaUpdateArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Manga.
     * @param {MangaDeleteManyArgs} args - Arguments to filter Manga to delete.
     * @example
     * // Delete a few Manga
     * const { count } = await prisma.manga.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MangaDeleteManyArgs>(args?: SelectSubset<T, MangaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Manga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Manga
     * const manga = await prisma.manga.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MangaUpdateManyArgs>(args: SelectSubset<T, MangaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Manga and returns the data updated in the database.
     * @param {MangaUpdateManyAndReturnArgs} args - Arguments to update many Manga.
     * @example
     * // Update many Manga
     * const manga = await prisma.manga.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Manga and only return the `id`
     * const mangaWithIdOnly = await prisma.manga.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MangaUpdateManyAndReturnArgs>(args: SelectSubset<T, MangaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Manga.
     * @param {MangaUpsertArgs} args - Arguments to update or create a Manga.
     * @example
     * // Update or create a Manga
     * const manga = await prisma.manga.upsert({
     *   create: {
     *     // ... data to create a Manga
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Manga we want to update
     *   }
     * })
     */
    upsert<T extends MangaUpsertArgs>(args: SelectSubset<T, MangaUpsertArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Manga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaCountArgs} args - Arguments to filter Manga to count.
     * @example
     * // Count the number of Manga
     * const count = await prisma.manga.count({
     *   where: {
     *     // ... the filter for the Manga we want to count
     *   }
     * })
    **/
    count<T extends MangaCountArgs>(
      args?: Subset<T, MangaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MangaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Manga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MangaAggregateArgs>(args: Subset<T, MangaAggregateArgs>): Prisma.PrismaPromise<GetMangaAggregateType<T>>

    /**
     * Group by Manga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MangaGroupByArgs} args - Group by arguments.
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
      T extends MangaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MangaGroupByArgs['orderBy'] }
        : { orderBy?: MangaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MangaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMangaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Manga model
   */
  readonly fields: MangaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Manga.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MangaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    arcs<T extends Manga$arcsArgs<ExtArgs> = {}>(args?: Subset<T, Manga$arcsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chapters<T extends Manga$chaptersArgs<ExtArgs> = {}>(args?: Subset<T, Manga$chaptersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookmarks<T extends Manga$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, Manga$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Manga model
   */
  interface MangaFieldRefs {
    readonly id: FieldRef<"Manga", 'String'>
    readonly author_id: FieldRef<"Manga", 'String'>
    readonly manga_title: FieldRef<"Manga", 'String'>
    readonly manga_synopsis: FieldRef<"Manga", 'String'>
    readonly cover_image_url: FieldRef<"Manga", 'String'>
    readonly banner_image_url: FieldRef<"Manga", 'String'>
    readonly created_at: FieldRef<"Manga", 'DateTime'>
    readonly updated_at: FieldRef<"Manga", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Manga findUnique
   */
  export type MangaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * Filter, which Manga to fetch.
     */
    where: MangaWhereUniqueInput
  }

  /**
   * Manga findUniqueOrThrow
   */
  export type MangaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * Filter, which Manga to fetch.
     */
    where: MangaWhereUniqueInput
  }

  /**
   * Manga findFirst
   */
  export type MangaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * Filter, which Manga to fetch.
     */
    where?: MangaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manga to fetch.
     */
    orderBy?: MangaOrderByWithRelationInput | MangaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Manga.
     */
    cursor?: MangaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manga from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manga.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Manga.
     */
    distinct?: MangaScalarFieldEnum | MangaScalarFieldEnum[]
  }

  /**
   * Manga findFirstOrThrow
   */
  export type MangaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * Filter, which Manga to fetch.
     */
    where?: MangaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manga to fetch.
     */
    orderBy?: MangaOrderByWithRelationInput | MangaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Manga.
     */
    cursor?: MangaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manga from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manga.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Manga.
     */
    distinct?: MangaScalarFieldEnum | MangaScalarFieldEnum[]
  }

  /**
   * Manga findMany
   */
  export type MangaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * Filter, which Manga to fetch.
     */
    where?: MangaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Manga to fetch.
     */
    orderBy?: MangaOrderByWithRelationInput | MangaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Manga.
     */
    cursor?: MangaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Manga from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Manga.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Manga.
     */
    distinct?: MangaScalarFieldEnum | MangaScalarFieldEnum[]
  }

  /**
   * Manga create
   */
  export type MangaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * The data needed to create a Manga.
     */
    data: XOR<MangaCreateInput, MangaUncheckedCreateInput>
  }

  /**
   * Manga createMany
   */
  export type MangaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Manga.
     */
    data: MangaCreateManyInput | MangaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Manga createManyAndReturn
   */
  export type MangaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * The data used to create many Manga.
     */
    data: MangaCreateManyInput | MangaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Manga update
   */
  export type MangaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * The data needed to update a Manga.
     */
    data: XOR<MangaUpdateInput, MangaUncheckedUpdateInput>
    /**
     * Choose, which Manga to update.
     */
    where: MangaWhereUniqueInput
  }

  /**
   * Manga updateMany
   */
  export type MangaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Manga.
     */
    data: XOR<MangaUpdateManyMutationInput, MangaUncheckedUpdateManyInput>
    /**
     * Filter which Manga to update
     */
    where?: MangaWhereInput
    /**
     * Limit how many Manga to update.
     */
    limit?: number
  }

  /**
   * Manga updateManyAndReturn
   */
  export type MangaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * The data used to update Manga.
     */
    data: XOR<MangaUpdateManyMutationInput, MangaUncheckedUpdateManyInput>
    /**
     * Filter which Manga to update
     */
    where?: MangaWhereInput
    /**
     * Limit how many Manga to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Manga upsert
   */
  export type MangaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * The filter to search for the Manga to update in case it exists.
     */
    where: MangaWhereUniqueInput
    /**
     * In case the Manga found by the `where` argument doesn't exist, create a new Manga with this data.
     */
    create: XOR<MangaCreateInput, MangaUncheckedCreateInput>
    /**
     * In case the Manga was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MangaUpdateInput, MangaUncheckedUpdateInput>
  }

  /**
   * Manga delete
   */
  export type MangaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
    /**
     * Filter which Manga to delete.
     */
    where: MangaWhereUniqueInput
  }

  /**
   * Manga deleteMany
   */
  export type MangaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Manga to delete
     */
    where?: MangaWhereInput
    /**
     * Limit how many Manga to delete.
     */
    limit?: number
  }

  /**
   * Manga.arcs
   */
  export type Manga$arcsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    where?: ArcWhereInput
    orderBy?: ArcOrderByWithRelationInput | ArcOrderByWithRelationInput[]
    cursor?: ArcWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArcScalarFieldEnum | ArcScalarFieldEnum[]
  }

  /**
   * Manga.chapters
   */
  export type Manga$chaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    where?: ChapterWhereInput
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    cursor?: ChapterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Manga.bookmarks
   */
  export type Manga$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Manga without action
   */
  export type MangaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manga
     */
    select?: MangaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manga
     */
    omit?: MangaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MangaInclude<ExtArgs> | null
  }


  /**
   * Model Arc
   */

  export type AggregateArc = {
    _count: ArcCountAggregateOutputType | null
    _avg: ArcAvgAggregateOutputType | null
    _sum: ArcSumAggregateOutputType | null
    _min: ArcMinAggregateOutputType | null
    _max: ArcMaxAggregateOutputType | null
  }

  export type ArcAvgAggregateOutputType = {
    arc_order: number | null
  }

  export type ArcSumAggregateOutputType = {
    arc_order: number | null
  }

  export type ArcMinAggregateOutputType = {
    id: string | null
    manga_id: string | null
    arc_name: string | null
    arc_order: number | null
    arc_status: $Enums.ArcStatus | null
    arc_image_url: string | null
    created_at: Date | null
  }

  export type ArcMaxAggregateOutputType = {
    id: string | null
    manga_id: string | null
    arc_name: string | null
    arc_order: number | null
    arc_status: $Enums.ArcStatus | null
    arc_image_url: string | null
    created_at: Date | null
  }

  export type ArcCountAggregateOutputType = {
    id: number
    manga_id: number
    arc_name: number
    arc_order: number
    arc_status: number
    arc_image_url: number
    created_at: number
    _all: number
  }


  export type ArcAvgAggregateInputType = {
    arc_order?: true
  }

  export type ArcSumAggregateInputType = {
    arc_order?: true
  }

  export type ArcMinAggregateInputType = {
    id?: true
    manga_id?: true
    arc_name?: true
    arc_order?: true
    arc_status?: true
    arc_image_url?: true
    created_at?: true
  }

  export type ArcMaxAggregateInputType = {
    id?: true
    manga_id?: true
    arc_name?: true
    arc_order?: true
    arc_status?: true
    arc_image_url?: true
    created_at?: true
  }

  export type ArcCountAggregateInputType = {
    id?: true
    manga_id?: true
    arc_name?: true
    arc_order?: true
    arc_status?: true
    arc_image_url?: true
    created_at?: true
    _all?: true
  }

  export type ArcAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Arc to aggregate.
     */
    where?: ArcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Arcs to fetch.
     */
    orderBy?: ArcOrderByWithRelationInput | ArcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Arcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Arcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Arcs
    **/
    _count?: true | ArcCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArcAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArcSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArcMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArcMaxAggregateInputType
  }

  export type GetArcAggregateType<T extends ArcAggregateArgs> = {
        [P in keyof T & keyof AggregateArc]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArc[P]>
      : GetScalarType<T[P], AggregateArc[P]>
  }




  export type ArcGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArcWhereInput
    orderBy?: ArcOrderByWithAggregationInput | ArcOrderByWithAggregationInput[]
    by: ArcScalarFieldEnum[] | ArcScalarFieldEnum
    having?: ArcScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArcCountAggregateInputType | true
    _avg?: ArcAvgAggregateInputType
    _sum?: ArcSumAggregateInputType
    _min?: ArcMinAggregateInputType
    _max?: ArcMaxAggregateInputType
  }

  export type ArcGroupByOutputType = {
    id: string
    manga_id: string
    arc_name: string
    arc_order: number
    arc_status: $Enums.ArcStatus
    arc_image_url: string | null
    created_at: Date
    _count: ArcCountAggregateOutputType | null
    _avg: ArcAvgAggregateOutputType | null
    _sum: ArcSumAggregateOutputType | null
    _min: ArcMinAggregateOutputType | null
    _max: ArcMaxAggregateOutputType | null
  }

  type GetArcGroupByPayload<T extends ArcGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArcGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArcGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArcGroupByOutputType[P]>
            : GetScalarType<T[P], ArcGroupByOutputType[P]>
        }
      >
    >


  export type ArcSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    manga_id?: boolean
    arc_name?: boolean
    arc_order?: boolean
    arc_status?: boolean
    arc_image_url?: boolean
    created_at?: boolean
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    chapters?: boolean | Arc$chaptersArgs<ExtArgs>
    _count?: boolean | ArcCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["arc"]>

  export type ArcSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    manga_id?: boolean
    arc_name?: boolean
    arc_order?: boolean
    arc_status?: boolean
    arc_image_url?: boolean
    created_at?: boolean
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["arc"]>

  export type ArcSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    manga_id?: boolean
    arc_name?: boolean
    arc_order?: boolean
    arc_status?: boolean
    arc_image_url?: boolean
    created_at?: boolean
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["arc"]>

  export type ArcSelectScalar = {
    id?: boolean
    manga_id?: boolean
    arc_name?: boolean
    arc_order?: boolean
    arc_status?: boolean
    arc_image_url?: boolean
    created_at?: boolean
  }

  export type ArcOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "manga_id" | "arc_name" | "arc_order" | "arc_status" | "arc_image_url" | "created_at", ExtArgs["result"]["arc"]>
  export type ArcInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    chapters?: boolean | Arc$chaptersArgs<ExtArgs>
    _count?: boolean | ArcCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArcIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }
  export type ArcIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }

  export type $ArcPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Arc"
    objects: {
      manga: Prisma.$MangaPayload<ExtArgs>
      chapters: Prisma.$ChapterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      manga_id: string
      arc_name: string
      arc_order: number
      arc_status: $Enums.ArcStatus
      arc_image_url: string | null
      created_at: Date
    }, ExtArgs["result"]["arc"]>
    composites: {}
  }

  type ArcGetPayload<S extends boolean | null | undefined | ArcDefaultArgs> = $Result.GetResult<Prisma.$ArcPayload, S>

  type ArcCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArcFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArcCountAggregateInputType | true
    }

  export interface ArcDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Arc'], meta: { name: 'Arc' } }
    /**
     * Find zero or one Arc that matches the filter.
     * @param {ArcFindUniqueArgs} args - Arguments to find a Arc
     * @example
     * // Get one Arc
     * const arc = await prisma.arc.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArcFindUniqueArgs>(args: SelectSubset<T, ArcFindUniqueArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Arc that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArcFindUniqueOrThrowArgs} args - Arguments to find a Arc
     * @example
     * // Get one Arc
     * const arc = await prisma.arc.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArcFindUniqueOrThrowArgs>(args: SelectSubset<T, ArcFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Arc that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcFindFirstArgs} args - Arguments to find a Arc
     * @example
     * // Get one Arc
     * const arc = await prisma.arc.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArcFindFirstArgs>(args?: SelectSubset<T, ArcFindFirstArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Arc that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcFindFirstOrThrowArgs} args - Arguments to find a Arc
     * @example
     * // Get one Arc
     * const arc = await prisma.arc.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArcFindFirstOrThrowArgs>(args?: SelectSubset<T, ArcFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Arcs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Arcs
     * const arcs = await prisma.arc.findMany()
     * 
     * // Get first 10 Arcs
     * const arcs = await prisma.arc.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const arcWithIdOnly = await prisma.arc.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArcFindManyArgs>(args?: SelectSubset<T, ArcFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Arc.
     * @param {ArcCreateArgs} args - Arguments to create a Arc.
     * @example
     * // Create one Arc
     * const Arc = await prisma.arc.create({
     *   data: {
     *     // ... data to create a Arc
     *   }
     * })
     * 
     */
    create<T extends ArcCreateArgs>(args: SelectSubset<T, ArcCreateArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Arcs.
     * @param {ArcCreateManyArgs} args - Arguments to create many Arcs.
     * @example
     * // Create many Arcs
     * const arc = await prisma.arc.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArcCreateManyArgs>(args?: SelectSubset<T, ArcCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Arcs and returns the data saved in the database.
     * @param {ArcCreateManyAndReturnArgs} args - Arguments to create many Arcs.
     * @example
     * // Create many Arcs
     * const arc = await prisma.arc.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Arcs and only return the `id`
     * const arcWithIdOnly = await prisma.arc.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArcCreateManyAndReturnArgs>(args?: SelectSubset<T, ArcCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Arc.
     * @param {ArcDeleteArgs} args - Arguments to delete one Arc.
     * @example
     * // Delete one Arc
     * const Arc = await prisma.arc.delete({
     *   where: {
     *     // ... filter to delete one Arc
     *   }
     * })
     * 
     */
    delete<T extends ArcDeleteArgs>(args: SelectSubset<T, ArcDeleteArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Arc.
     * @param {ArcUpdateArgs} args - Arguments to update one Arc.
     * @example
     * // Update one Arc
     * const arc = await prisma.arc.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArcUpdateArgs>(args: SelectSubset<T, ArcUpdateArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Arcs.
     * @param {ArcDeleteManyArgs} args - Arguments to filter Arcs to delete.
     * @example
     * // Delete a few Arcs
     * const { count } = await prisma.arc.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArcDeleteManyArgs>(args?: SelectSubset<T, ArcDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Arcs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Arcs
     * const arc = await prisma.arc.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArcUpdateManyArgs>(args: SelectSubset<T, ArcUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Arcs and returns the data updated in the database.
     * @param {ArcUpdateManyAndReturnArgs} args - Arguments to update many Arcs.
     * @example
     * // Update many Arcs
     * const arc = await prisma.arc.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Arcs and only return the `id`
     * const arcWithIdOnly = await prisma.arc.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArcUpdateManyAndReturnArgs>(args: SelectSubset<T, ArcUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Arc.
     * @param {ArcUpsertArgs} args - Arguments to update or create a Arc.
     * @example
     * // Update or create a Arc
     * const arc = await prisma.arc.upsert({
     *   create: {
     *     // ... data to create a Arc
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Arc we want to update
     *   }
     * })
     */
    upsert<T extends ArcUpsertArgs>(args: SelectSubset<T, ArcUpsertArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Arcs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcCountArgs} args - Arguments to filter Arcs to count.
     * @example
     * // Count the number of Arcs
     * const count = await prisma.arc.count({
     *   where: {
     *     // ... the filter for the Arcs we want to count
     *   }
     * })
    **/
    count<T extends ArcCountArgs>(
      args?: Subset<T, ArcCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArcCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Arc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArcAggregateArgs>(args: Subset<T, ArcAggregateArgs>): Prisma.PrismaPromise<GetArcAggregateType<T>>

    /**
     * Group by Arc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArcGroupByArgs} args - Group by arguments.
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
      T extends ArcGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArcGroupByArgs['orderBy'] }
        : { orderBy?: ArcGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ArcGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArcGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Arc model
   */
  readonly fields: ArcFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Arc.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArcClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    manga<T extends MangaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MangaDefaultArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chapters<T extends Arc$chaptersArgs<ExtArgs> = {}>(args?: Subset<T, Arc$chaptersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Arc model
   */
  interface ArcFieldRefs {
    readonly id: FieldRef<"Arc", 'String'>
    readonly manga_id: FieldRef<"Arc", 'String'>
    readonly arc_name: FieldRef<"Arc", 'String'>
    readonly arc_order: FieldRef<"Arc", 'Int'>
    readonly arc_status: FieldRef<"Arc", 'ArcStatus'>
    readonly arc_image_url: FieldRef<"Arc", 'String'>
    readonly created_at: FieldRef<"Arc", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Arc findUnique
   */
  export type ArcFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * Filter, which Arc to fetch.
     */
    where: ArcWhereUniqueInput
  }

  /**
   * Arc findUniqueOrThrow
   */
  export type ArcFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * Filter, which Arc to fetch.
     */
    where: ArcWhereUniqueInput
  }

  /**
   * Arc findFirst
   */
  export type ArcFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * Filter, which Arc to fetch.
     */
    where?: ArcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Arcs to fetch.
     */
    orderBy?: ArcOrderByWithRelationInput | ArcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Arcs.
     */
    cursor?: ArcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Arcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Arcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Arcs.
     */
    distinct?: ArcScalarFieldEnum | ArcScalarFieldEnum[]
  }

  /**
   * Arc findFirstOrThrow
   */
  export type ArcFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * Filter, which Arc to fetch.
     */
    where?: ArcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Arcs to fetch.
     */
    orderBy?: ArcOrderByWithRelationInput | ArcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Arcs.
     */
    cursor?: ArcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Arcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Arcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Arcs.
     */
    distinct?: ArcScalarFieldEnum | ArcScalarFieldEnum[]
  }

  /**
   * Arc findMany
   */
  export type ArcFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * Filter, which Arcs to fetch.
     */
    where?: ArcWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Arcs to fetch.
     */
    orderBy?: ArcOrderByWithRelationInput | ArcOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Arcs.
     */
    cursor?: ArcWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Arcs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Arcs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Arcs.
     */
    distinct?: ArcScalarFieldEnum | ArcScalarFieldEnum[]
  }

  /**
   * Arc create
   */
  export type ArcCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * The data needed to create a Arc.
     */
    data: XOR<ArcCreateInput, ArcUncheckedCreateInput>
  }

  /**
   * Arc createMany
   */
  export type ArcCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Arcs.
     */
    data: ArcCreateManyInput | ArcCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Arc createManyAndReturn
   */
  export type ArcCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * The data used to create many Arcs.
     */
    data: ArcCreateManyInput | ArcCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Arc update
   */
  export type ArcUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * The data needed to update a Arc.
     */
    data: XOR<ArcUpdateInput, ArcUncheckedUpdateInput>
    /**
     * Choose, which Arc to update.
     */
    where: ArcWhereUniqueInput
  }

  /**
   * Arc updateMany
   */
  export type ArcUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Arcs.
     */
    data: XOR<ArcUpdateManyMutationInput, ArcUncheckedUpdateManyInput>
    /**
     * Filter which Arcs to update
     */
    where?: ArcWhereInput
    /**
     * Limit how many Arcs to update.
     */
    limit?: number
  }

  /**
   * Arc updateManyAndReturn
   */
  export type ArcUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * The data used to update Arcs.
     */
    data: XOR<ArcUpdateManyMutationInput, ArcUncheckedUpdateManyInput>
    /**
     * Filter which Arcs to update
     */
    where?: ArcWhereInput
    /**
     * Limit how many Arcs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Arc upsert
   */
  export type ArcUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * The filter to search for the Arc to update in case it exists.
     */
    where: ArcWhereUniqueInput
    /**
     * In case the Arc found by the `where` argument doesn't exist, create a new Arc with this data.
     */
    create: XOR<ArcCreateInput, ArcUncheckedCreateInput>
    /**
     * In case the Arc was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArcUpdateInput, ArcUncheckedUpdateInput>
  }

  /**
   * Arc delete
   */
  export type ArcDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    /**
     * Filter which Arc to delete.
     */
    where: ArcWhereUniqueInput
  }

  /**
   * Arc deleteMany
   */
  export type ArcDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Arcs to delete
     */
    where?: ArcWhereInput
    /**
     * Limit how many Arcs to delete.
     */
    limit?: number
  }

  /**
   * Arc.chapters
   */
  export type Arc$chaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    where?: ChapterWhereInput
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    cursor?: ChapterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Arc without action
   */
  export type ArcDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
  }


  /**
   * Model Chapter
   */

  export type AggregateChapter = {
    _count: ChapterCountAggregateOutputType | null
    _avg: ChapterAvgAggregateOutputType | null
    _sum: ChapterSumAggregateOutputType | null
    _min: ChapterMinAggregateOutputType | null
    _max: ChapterMaxAggregateOutputType | null
  }

  export type ChapterAvgAggregateOutputType = {
    chapter_number: number | null
    view_count: number | null
    comment_count: number | null
  }

  export type ChapterSumAggregateOutputType = {
    chapter_number: number | null
    view_count: number | null
    comment_count: number | null
  }

  export type ChapterMinAggregateOutputType = {
    id: string | null
    manga_id: string | null
    arc_id: string | null
    chapter_number: number | null
    chapter_name: string | null
    cover_image_url: string | null
    published_date: Date | null
    view_count: number | null
    comment_count: number | null
    created_at: Date | null
  }

  export type ChapterMaxAggregateOutputType = {
    id: string | null
    manga_id: string | null
    arc_id: string | null
    chapter_number: number | null
    chapter_name: string | null
    cover_image_url: string | null
    published_date: Date | null
    view_count: number | null
    comment_count: number | null
    created_at: Date | null
  }

  export type ChapterCountAggregateOutputType = {
    id: number
    manga_id: number
    arc_id: number
    chapter_number: number
    chapter_name: number
    cover_image_url: number
    published_date: number
    view_count: number
    comment_count: number
    created_at: number
    _all: number
  }


  export type ChapterAvgAggregateInputType = {
    chapter_number?: true
    view_count?: true
    comment_count?: true
  }

  export type ChapterSumAggregateInputType = {
    chapter_number?: true
    view_count?: true
    comment_count?: true
  }

  export type ChapterMinAggregateInputType = {
    id?: true
    manga_id?: true
    arc_id?: true
    chapter_number?: true
    chapter_name?: true
    cover_image_url?: true
    published_date?: true
    view_count?: true
    comment_count?: true
    created_at?: true
  }

  export type ChapterMaxAggregateInputType = {
    id?: true
    manga_id?: true
    arc_id?: true
    chapter_number?: true
    chapter_name?: true
    cover_image_url?: true
    published_date?: true
    view_count?: true
    comment_count?: true
    created_at?: true
  }

  export type ChapterCountAggregateInputType = {
    id?: true
    manga_id?: true
    arc_id?: true
    chapter_number?: true
    chapter_name?: true
    cover_image_url?: true
    published_date?: true
    view_count?: true
    comment_count?: true
    created_at?: true
    _all?: true
  }

  export type ChapterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chapter to aggregate.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Chapters
    **/
    _count?: true | ChapterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChapterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChapterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChapterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChapterMaxAggregateInputType
  }

  export type GetChapterAggregateType<T extends ChapterAggregateArgs> = {
        [P in keyof T & keyof AggregateChapter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChapter[P]>
      : GetScalarType<T[P], AggregateChapter[P]>
  }




  export type ChapterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterWhereInput
    orderBy?: ChapterOrderByWithAggregationInput | ChapterOrderByWithAggregationInput[]
    by: ChapterScalarFieldEnum[] | ChapterScalarFieldEnum
    having?: ChapterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChapterCountAggregateInputType | true
    _avg?: ChapterAvgAggregateInputType
    _sum?: ChapterSumAggregateInputType
    _min?: ChapterMinAggregateInputType
    _max?: ChapterMaxAggregateInputType
  }

  export type ChapterGroupByOutputType = {
    id: string
    manga_id: string
    arc_id: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url: string | null
    published_date: Date
    view_count: number
    comment_count: number
    created_at: Date
    _count: ChapterCountAggregateOutputType | null
    _avg: ChapterAvgAggregateOutputType | null
    _sum: ChapterSumAggregateOutputType | null
    _min: ChapterMinAggregateOutputType | null
    _max: ChapterMaxAggregateOutputType | null
  }

  type GetChapterGroupByPayload<T extends ChapterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChapterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChapterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChapterGroupByOutputType[P]>
            : GetScalarType<T[P], ChapterGroupByOutputType[P]>
        }
      >
    >


  export type ChapterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    manga_id?: boolean
    arc_id?: boolean
    chapter_number?: boolean
    chapter_name?: boolean
    cover_image_url?: boolean
    published_date?: boolean
    view_count?: boolean
    comment_count?: boolean
    created_at?: boolean
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    arc?: boolean | Chapter$arcArgs<ExtArgs>
    translations?: boolean | Chapter$translationsArgs<ExtArgs>
    comments?: boolean | Chapter$commentsArgs<ExtArgs>
    reading_progress?: boolean | Chapter$reading_progressArgs<ExtArgs>
    chapter_bookmarks?: boolean | Chapter$chapter_bookmarksArgs<ExtArgs>
    _count?: boolean | ChapterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>

  export type ChapterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    manga_id?: boolean
    arc_id?: boolean
    chapter_number?: boolean
    chapter_name?: boolean
    cover_image_url?: boolean
    published_date?: boolean
    view_count?: boolean
    comment_count?: boolean
    created_at?: boolean
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    arc?: boolean | Chapter$arcArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>

  export type ChapterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    manga_id?: boolean
    arc_id?: boolean
    chapter_number?: boolean
    chapter_name?: boolean
    cover_image_url?: boolean
    published_date?: boolean
    view_count?: boolean
    comment_count?: boolean
    created_at?: boolean
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    arc?: boolean | Chapter$arcArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>

  export type ChapterSelectScalar = {
    id?: boolean
    manga_id?: boolean
    arc_id?: boolean
    chapter_number?: boolean
    chapter_name?: boolean
    cover_image_url?: boolean
    published_date?: boolean
    view_count?: boolean
    comment_count?: boolean
    created_at?: boolean
  }

  export type ChapterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "manga_id" | "arc_id" | "chapter_number" | "chapter_name" | "cover_image_url" | "published_date" | "view_count" | "comment_count" | "created_at", ExtArgs["result"]["chapter"]>
  export type ChapterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    arc?: boolean | Chapter$arcArgs<ExtArgs>
    translations?: boolean | Chapter$translationsArgs<ExtArgs>
    comments?: boolean | Chapter$commentsArgs<ExtArgs>
    reading_progress?: boolean | Chapter$reading_progressArgs<ExtArgs>
    chapter_bookmarks?: boolean | Chapter$chapter_bookmarksArgs<ExtArgs>
    _count?: boolean | ChapterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChapterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    arc?: boolean | Chapter$arcArgs<ExtArgs>
  }
  export type ChapterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    manga?: boolean | MangaDefaultArgs<ExtArgs>
    arc?: boolean | Chapter$arcArgs<ExtArgs>
  }

  export type $ChapterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Chapter"
    objects: {
      manga: Prisma.$MangaPayload<ExtArgs>
      arc: Prisma.$ArcPayload<ExtArgs> | null
      translations: Prisma.$TranslationPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
      reading_progress: Prisma.$ReadingProgressPayload<ExtArgs>[]
      chapter_bookmarks: Prisma.$ChapterBookmarkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      manga_id: string
      arc_id: string | null
      chapter_number: number
      chapter_name: string
      cover_image_url: string | null
      published_date: Date
      view_count: number
      comment_count: number
      created_at: Date
    }, ExtArgs["result"]["chapter"]>
    composites: {}
  }

  type ChapterGetPayload<S extends boolean | null | undefined | ChapterDefaultArgs> = $Result.GetResult<Prisma.$ChapterPayload, S>

  type ChapterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChapterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChapterCountAggregateInputType | true
    }

  export interface ChapterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Chapter'], meta: { name: 'Chapter' } }
    /**
     * Find zero or one Chapter that matches the filter.
     * @param {ChapterFindUniqueArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChapterFindUniqueArgs>(args: SelectSubset<T, ChapterFindUniqueArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Chapter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChapterFindUniqueOrThrowArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChapterFindUniqueOrThrowArgs>(args: SelectSubset<T, ChapterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chapter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterFindFirstArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChapterFindFirstArgs>(args?: SelectSubset<T, ChapterFindFirstArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chapter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterFindFirstOrThrowArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChapterFindFirstOrThrowArgs>(args?: SelectSubset<T, ChapterFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Chapters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chapters
     * const chapters = await prisma.chapter.findMany()
     * 
     * // Get first 10 Chapters
     * const chapters = await prisma.chapter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chapterWithIdOnly = await prisma.chapter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChapterFindManyArgs>(args?: SelectSubset<T, ChapterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Chapter.
     * @param {ChapterCreateArgs} args - Arguments to create a Chapter.
     * @example
     * // Create one Chapter
     * const Chapter = await prisma.chapter.create({
     *   data: {
     *     // ... data to create a Chapter
     *   }
     * })
     * 
     */
    create<T extends ChapterCreateArgs>(args: SelectSubset<T, ChapterCreateArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Chapters.
     * @param {ChapterCreateManyArgs} args - Arguments to create many Chapters.
     * @example
     * // Create many Chapters
     * const chapter = await prisma.chapter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChapterCreateManyArgs>(args?: SelectSubset<T, ChapterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Chapters and returns the data saved in the database.
     * @param {ChapterCreateManyAndReturnArgs} args - Arguments to create many Chapters.
     * @example
     * // Create many Chapters
     * const chapter = await prisma.chapter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Chapters and only return the `id`
     * const chapterWithIdOnly = await prisma.chapter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChapterCreateManyAndReturnArgs>(args?: SelectSubset<T, ChapterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Chapter.
     * @param {ChapterDeleteArgs} args - Arguments to delete one Chapter.
     * @example
     * // Delete one Chapter
     * const Chapter = await prisma.chapter.delete({
     *   where: {
     *     // ... filter to delete one Chapter
     *   }
     * })
     * 
     */
    delete<T extends ChapterDeleteArgs>(args: SelectSubset<T, ChapterDeleteArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Chapter.
     * @param {ChapterUpdateArgs} args - Arguments to update one Chapter.
     * @example
     * // Update one Chapter
     * const chapter = await prisma.chapter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChapterUpdateArgs>(args: SelectSubset<T, ChapterUpdateArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Chapters.
     * @param {ChapterDeleteManyArgs} args - Arguments to filter Chapters to delete.
     * @example
     * // Delete a few Chapters
     * const { count } = await prisma.chapter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChapterDeleteManyArgs>(args?: SelectSubset<T, ChapterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chapters
     * const chapter = await prisma.chapter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChapterUpdateManyArgs>(args: SelectSubset<T, ChapterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chapters and returns the data updated in the database.
     * @param {ChapterUpdateManyAndReturnArgs} args - Arguments to update many Chapters.
     * @example
     * // Update many Chapters
     * const chapter = await prisma.chapter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Chapters and only return the `id`
     * const chapterWithIdOnly = await prisma.chapter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChapterUpdateManyAndReturnArgs>(args: SelectSubset<T, ChapterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Chapter.
     * @param {ChapterUpsertArgs} args - Arguments to update or create a Chapter.
     * @example
     * // Update or create a Chapter
     * const chapter = await prisma.chapter.upsert({
     *   create: {
     *     // ... data to create a Chapter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chapter we want to update
     *   }
     * })
     */
    upsert<T extends ChapterUpsertArgs>(args: SelectSubset<T, ChapterUpsertArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Chapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterCountArgs} args - Arguments to filter Chapters to count.
     * @example
     * // Count the number of Chapters
     * const count = await prisma.chapter.count({
     *   where: {
     *     // ... the filter for the Chapters we want to count
     *   }
     * })
    **/
    count<T extends ChapterCountArgs>(
      args?: Subset<T, ChapterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChapterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChapterAggregateArgs>(args: Subset<T, ChapterAggregateArgs>): Prisma.PrismaPromise<GetChapterAggregateType<T>>

    /**
     * Group by Chapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterGroupByArgs} args - Group by arguments.
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
      T extends ChapterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChapterGroupByArgs['orderBy'] }
        : { orderBy?: ChapterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChapterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChapterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Chapter model
   */
  readonly fields: ChapterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Chapter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChapterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    manga<T extends MangaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MangaDefaultArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    arc<T extends Chapter$arcArgs<ExtArgs> = {}>(args?: Subset<T, Chapter$arcArgs<ExtArgs>>): Prisma__ArcClient<$Result.GetResult<Prisma.$ArcPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    translations<T extends Chapter$translationsArgs<ExtArgs> = {}>(args?: Subset<T, Chapter$translationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends Chapter$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Chapter$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reading_progress<T extends Chapter$reading_progressArgs<ExtArgs> = {}>(args?: Subset<T, Chapter$reading_progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chapter_bookmarks<T extends Chapter$chapter_bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, Chapter$chapter_bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Chapter model
   */
  interface ChapterFieldRefs {
    readonly id: FieldRef<"Chapter", 'String'>
    readonly manga_id: FieldRef<"Chapter", 'String'>
    readonly arc_id: FieldRef<"Chapter", 'String'>
    readonly chapter_number: FieldRef<"Chapter", 'Int'>
    readonly chapter_name: FieldRef<"Chapter", 'String'>
    readonly cover_image_url: FieldRef<"Chapter", 'String'>
    readonly published_date: FieldRef<"Chapter", 'DateTime'>
    readonly view_count: FieldRef<"Chapter", 'Int'>
    readonly comment_count: FieldRef<"Chapter", 'Int'>
    readonly created_at: FieldRef<"Chapter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Chapter findUnique
   */
  export type ChapterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter findUniqueOrThrow
   */
  export type ChapterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter findFirst
   */
  export type ChapterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chapters.
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Chapter findFirstOrThrow
   */
  export type ChapterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chapters.
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Chapter findMany
   */
  export type ChapterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapters to fetch.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Chapters.
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Chapter create
   */
  export type ChapterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * The data needed to create a Chapter.
     */
    data: XOR<ChapterCreateInput, ChapterUncheckedCreateInput>
  }

  /**
   * Chapter createMany
   */
  export type ChapterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Chapters.
     */
    data: ChapterCreateManyInput | ChapterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Chapter createManyAndReturn
   */
  export type ChapterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * The data used to create many Chapters.
     */
    data: ChapterCreateManyInput | ChapterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Chapter update
   */
  export type ChapterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * The data needed to update a Chapter.
     */
    data: XOR<ChapterUpdateInput, ChapterUncheckedUpdateInput>
    /**
     * Choose, which Chapter to update.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter updateMany
   */
  export type ChapterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Chapters.
     */
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyInput>
    /**
     * Filter which Chapters to update
     */
    where?: ChapterWhereInput
    /**
     * Limit how many Chapters to update.
     */
    limit?: number
  }

  /**
   * Chapter updateManyAndReturn
   */
  export type ChapterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * The data used to update Chapters.
     */
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyInput>
    /**
     * Filter which Chapters to update
     */
    where?: ChapterWhereInput
    /**
     * Limit how many Chapters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Chapter upsert
   */
  export type ChapterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * The filter to search for the Chapter to update in case it exists.
     */
    where: ChapterWhereUniqueInput
    /**
     * In case the Chapter found by the `where` argument doesn't exist, create a new Chapter with this data.
     */
    create: XOR<ChapterCreateInput, ChapterUncheckedCreateInput>
    /**
     * In case the Chapter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChapterUpdateInput, ChapterUncheckedUpdateInput>
  }

  /**
   * Chapter delete
   */
  export type ChapterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter which Chapter to delete.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter deleteMany
   */
  export type ChapterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chapters to delete
     */
    where?: ChapterWhereInput
    /**
     * Limit how many Chapters to delete.
     */
    limit?: number
  }

  /**
   * Chapter.arc
   */
  export type Chapter$arcArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Arc
     */
    select?: ArcSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Arc
     */
    omit?: ArcOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArcInclude<ExtArgs> | null
    where?: ArcWhereInput
  }

  /**
   * Chapter.translations
   */
  export type Chapter$translationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    where?: TranslationWhereInput
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    cursor?: TranslationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Chapter.comments
   */
  export type Chapter$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Chapter.reading_progress
   */
  export type Chapter$reading_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    where?: ReadingProgressWhereInput
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    cursor?: ReadingProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * Chapter.chapter_bookmarks
   */
  export type Chapter$chapter_bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    where?: ChapterBookmarkWhereInput
    orderBy?: ChapterBookmarkOrderByWithRelationInput | ChapterBookmarkOrderByWithRelationInput[]
    cursor?: ChapterBookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChapterBookmarkScalarFieldEnum | ChapterBookmarkScalarFieldEnum[]
  }

  /**
   * Chapter without action
   */
  export type ChapterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
  }


  /**
   * Model Translation
   */

  export type AggregateTranslation = {
    _count: TranslationCountAggregateOutputType | null
    _min: TranslationMinAggregateOutputType | null
    _max: TranslationMaxAggregateOutputType | null
  }

  export type TranslationMinAggregateOutputType = {
    id: string | null
    chapter_id: string | null
    language: $Enums.Language | null
    file_url: string | null
    translator_id: string | null
    created_at: Date | null
  }

  export type TranslationMaxAggregateOutputType = {
    id: string | null
    chapter_id: string | null
    language: $Enums.Language | null
    file_url: string | null
    translator_id: string | null
    created_at: Date | null
  }

  export type TranslationCountAggregateOutputType = {
    id: number
    chapter_id: number
    language: number
    file_url: number
    translator_id: number
    created_at: number
    _all: number
  }


  export type TranslationMinAggregateInputType = {
    id?: true
    chapter_id?: true
    language?: true
    file_url?: true
    translator_id?: true
    created_at?: true
  }

  export type TranslationMaxAggregateInputType = {
    id?: true
    chapter_id?: true
    language?: true
    file_url?: true
    translator_id?: true
    created_at?: true
  }

  export type TranslationCountAggregateInputType = {
    id?: true
    chapter_id?: true
    language?: true
    file_url?: true
    translator_id?: true
    created_at?: true
    _all?: true
  }

  export type TranslationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Translation to aggregate.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Translations
    **/
    _count?: true | TranslationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranslationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranslationMaxAggregateInputType
  }

  export type GetTranslationAggregateType<T extends TranslationAggregateArgs> = {
        [P in keyof T & keyof AggregateTranslation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranslation[P]>
      : GetScalarType<T[P], AggregateTranslation[P]>
  }




  export type TranslationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslationWhereInput
    orderBy?: TranslationOrderByWithAggregationInput | TranslationOrderByWithAggregationInput[]
    by: TranslationScalarFieldEnum[] | TranslationScalarFieldEnum
    having?: TranslationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranslationCountAggregateInputType | true
    _min?: TranslationMinAggregateInputType
    _max?: TranslationMaxAggregateInputType
  }

  export type TranslationGroupByOutputType = {
    id: string
    chapter_id: string
    language: $Enums.Language
    file_url: string
    translator_id: string | null
    created_at: Date
    _count: TranslationCountAggregateOutputType | null
    _min: TranslationMinAggregateOutputType | null
    _max: TranslationMaxAggregateOutputType | null
  }

  type GetTranslationGroupByPayload<T extends TranslationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranslationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranslationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranslationGroupByOutputType[P]>
            : GetScalarType<T[P], TranslationGroupByOutputType[P]>
        }
      >
    >


  export type TranslationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chapter_id?: boolean
    language?: boolean
    file_url?: boolean
    translator_id?: boolean
    created_at?: boolean
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
    translator?: boolean | Translation$translatorArgs<ExtArgs>
  }, ExtArgs["result"]["translation"]>

  export type TranslationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chapter_id?: boolean
    language?: boolean
    file_url?: boolean
    translator_id?: boolean
    created_at?: boolean
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
    translator?: boolean | Translation$translatorArgs<ExtArgs>
  }, ExtArgs["result"]["translation"]>

  export type TranslationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chapter_id?: boolean
    language?: boolean
    file_url?: boolean
    translator_id?: boolean
    created_at?: boolean
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
    translator?: boolean | Translation$translatorArgs<ExtArgs>
  }, ExtArgs["result"]["translation"]>

  export type TranslationSelectScalar = {
    id?: boolean
    chapter_id?: boolean
    language?: boolean
    file_url?: boolean
    translator_id?: boolean
    created_at?: boolean
  }

  export type TranslationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chapter_id" | "language" | "file_url" | "translator_id" | "created_at", ExtArgs["result"]["translation"]>
  export type TranslationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
    translator?: boolean | Translation$translatorArgs<ExtArgs>
  }
  export type TranslationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
    translator?: boolean | Translation$translatorArgs<ExtArgs>
  }
  export type TranslationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
    translator?: boolean | Translation$translatorArgs<ExtArgs>
  }

  export type $TranslationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Translation"
    objects: {
      chapter: Prisma.$ChapterPayload<ExtArgs>
      translator: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chapter_id: string
      language: $Enums.Language
      file_url: string
      translator_id: string | null
      created_at: Date
    }, ExtArgs["result"]["translation"]>
    composites: {}
  }

  type TranslationGetPayload<S extends boolean | null | undefined | TranslationDefaultArgs> = $Result.GetResult<Prisma.$TranslationPayload, S>

  type TranslationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranslationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranslationCountAggregateInputType | true
    }

  export interface TranslationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Translation'], meta: { name: 'Translation' } }
    /**
     * Find zero or one Translation that matches the filter.
     * @param {TranslationFindUniqueArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranslationFindUniqueArgs>(args: SelectSubset<T, TranslationFindUniqueArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Translation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranslationFindUniqueOrThrowArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranslationFindUniqueOrThrowArgs>(args: SelectSubset<T, TranslationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Translation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationFindFirstArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranslationFindFirstArgs>(args?: SelectSubset<T, TranslationFindFirstArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Translation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationFindFirstOrThrowArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranslationFindFirstOrThrowArgs>(args?: SelectSubset<T, TranslationFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Translations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Translations
     * const translations = await prisma.translation.findMany()
     * 
     * // Get first 10 Translations
     * const translations = await prisma.translation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const translationWithIdOnly = await prisma.translation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranslationFindManyArgs>(args?: SelectSubset<T, TranslationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Translation.
     * @param {TranslationCreateArgs} args - Arguments to create a Translation.
     * @example
     * // Create one Translation
     * const Translation = await prisma.translation.create({
     *   data: {
     *     // ... data to create a Translation
     *   }
     * })
     * 
     */
    create<T extends TranslationCreateArgs>(args: SelectSubset<T, TranslationCreateArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Translations.
     * @param {TranslationCreateManyArgs} args - Arguments to create many Translations.
     * @example
     * // Create many Translations
     * const translation = await prisma.translation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranslationCreateManyArgs>(args?: SelectSubset<T, TranslationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Translations and returns the data saved in the database.
     * @param {TranslationCreateManyAndReturnArgs} args - Arguments to create many Translations.
     * @example
     * // Create many Translations
     * const translation = await prisma.translation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Translations and only return the `id`
     * const translationWithIdOnly = await prisma.translation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranslationCreateManyAndReturnArgs>(args?: SelectSubset<T, TranslationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Translation.
     * @param {TranslationDeleteArgs} args - Arguments to delete one Translation.
     * @example
     * // Delete one Translation
     * const Translation = await prisma.translation.delete({
     *   where: {
     *     // ... filter to delete one Translation
     *   }
     * })
     * 
     */
    delete<T extends TranslationDeleteArgs>(args: SelectSubset<T, TranslationDeleteArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Translation.
     * @param {TranslationUpdateArgs} args - Arguments to update one Translation.
     * @example
     * // Update one Translation
     * const translation = await prisma.translation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranslationUpdateArgs>(args: SelectSubset<T, TranslationUpdateArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Translations.
     * @param {TranslationDeleteManyArgs} args - Arguments to filter Translations to delete.
     * @example
     * // Delete a few Translations
     * const { count } = await prisma.translation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranslationDeleteManyArgs>(args?: SelectSubset<T, TranslationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Translations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Translations
     * const translation = await prisma.translation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranslationUpdateManyArgs>(args: SelectSubset<T, TranslationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Translations and returns the data updated in the database.
     * @param {TranslationUpdateManyAndReturnArgs} args - Arguments to update many Translations.
     * @example
     * // Update many Translations
     * const translation = await prisma.translation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Translations and only return the `id`
     * const translationWithIdOnly = await prisma.translation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TranslationUpdateManyAndReturnArgs>(args: SelectSubset<T, TranslationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Translation.
     * @param {TranslationUpsertArgs} args - Arguments to update or create a Translation.
     * @example
     * // Update or create a Translation
     * const translation = await prisma.translation.upsert({
     *   create: {
     *     // ... data to create a Translation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Translation we want to update
     *   }
     * })
     */
    upsert<T extends TranslationUpsertArgs>(args: SelectSubset<T, TranslationUpsertArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Translations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationCountArgs} args - Arguments to filter Translations to count.
     * @example
     * // Count the number of Translations
     * const count = await prisma.translation.count({
     *   where: {
     *     // ... the filter for the Translations we want to count
     *   }
     * })
    **/
    count<T extends TranslationCountArgs>(
      args?: Subset<T, TranslationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranslationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Translation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TranslationAggregateArgs>(args: Subset<T, TranslationAggregateArgs>): Prisma.PrismaPromise<GetTranslationAggregateType<T>>

    /**
     * Group by Translation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationGroupByArgs} args - Group by arguments.
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
      T extends TranslationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranslationGroupByArgs['orderBy'] }
        : { orderBy?: TranslationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TranslationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Translation model
   */
  readonly fields: TranslationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Translation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranslationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chapter<T extends ChapterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChapterDefaultArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    translator<T extends Translation$translatorArgs<ExtArgs> = {}>(args?: Subset<T, Translation$translatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Translation model
   */
  interface TranslationFieldRefs {
    readonly id: FieldRef<"Translation", 'String'>
    readonly chapter_id: FieldRef<"Translation", 'String'>
    readonly language: FieldRef<"Translation", 'Language'>
    readonly file_url: FieldRef<"Translation", 'String'>
    readonly translator_id: FieldRef<"Translation", 'String'>
    readonly created_at: FieldRef<"Translation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Translation findUnique
   */
  export type TranslationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation findUniqueOrThrow
   */
  export type TranslationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation findFirst
   */
  export type TranslationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Translations.
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Translations.
     */
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Translation findFirstOrThrow
   */
  export type TranslationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Translations.
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Translations.
     */
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Translation findMany
   */
  export type TranslationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translations to fetch.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Translations.
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Translations.
     */
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Translation create
   */
  export type TranslationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * The data needed to create a Translation.
     */
    data: XOR<TranslationCreateInput, TranslationUncheckedCreateInput>
  }

  /**
   * Translation createMany
   */
  export type TranslationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Translations.
     */
    data: TranslationCreateManyInput | TranslationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Translation createManyAndReturn
   */
  export type TranslationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * The data used to create many Translations.
     */
    data: TranslationCreateManyInput | TranslationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Translation update
   */
  export type TranslationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * The data needed to update a Translation.
     */
    data: XOR<TranslationUpdateInput, TranslationUncheckedUpdateInput>
    /**
     * Choose, which Translation to update.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation updateMany
   */
  export type TranslationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Translations.
     */
    data: XOR<TranslationUpdateManyMutationInput, TranslationUncheckedUpdateManyInput>
    /**
     * Filter which Translations to update
     */
    where?: TranslationWhereInput
    /**
     * Limit how many Translations to update.
     */
    limit?: number
  }

  /**
   * Translation updateManyAndReturn
   */
  export type TranslationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * The data used to update Translations.
     */
    data: XOR<TranslationUpdateManyMutationInput, TranslationUncheckedUpdateManyInput>
    /**
     * Filter which Translations to update
     */
    where?: TranslationWhereInput
    /**
     * Limit how many Translations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Translation upsert
   */
  export type TranslationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * The filter to search for the Translation to update in case it exists.
     */
    where: TranslationWhereUniqueInput
    /**
     * In case the Translation found by the `where` argument doesn't exist, create a new Translation with this data.
     */
    create: XOR<TranslationCreateInput, TranslationUncheckedCreateInput>
    /**
     * In case the Translation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranslationUpdateInput, TranslationUncheckedUpdateInput>
  }

  /**
   * Translation delete
   */
  export type TranslationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter which Translation to delete.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation deleteMany
   */
  export type TranslationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Translations to delete
     */
    where?: TranslationWhereInput
    /**
     * Limit how many Translations to delete.
     */
    limit?: number
  }

  /**
   * Translation.translator
   */
  export type Translation$translatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Translation without action
   */
  export type TranslationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Translation
     */
    omit?: TranslationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    chapter_id: string | null
    body: string | null
    hidden_at: Date | null
    created_at: Date | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    chapter_id: string | null
    body: string | null
    hidden_at: Date | null
    created_at: Date | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    user_id: number
    chapter_id: number
    body: number
    hidden_at: number
    created_at: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    body?: true
    hidden_at?: true
    created_at?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    body?: true
    hidden_at?: true
    created_at?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    body?: true
    hidden_at?: true
    created_at?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    user_id: string
    chapter_id: string
    body: string
    hidden_at: Date | null
    created_at: Date
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    body?: boolean
    hidden_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    body?: boolean
    hidden_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    body?: boolean
    hidden_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    body?: boolean
    hidden_at?: boolean
    created_at?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "chapter_id" | "body" | "hidden_at" | "created_at", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }
  export type CommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chapter: Prisma.$ChapterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      chapter_id: string
      body: string
      hidden_at: Date | null
      created_at: Date
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
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
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chapter<T extends ChapterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChapterDefaultArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly user_id: FieldRef<"Comment", 'String'>
    readonly chapter_id: FieldRef<"Comment", 'String'>
    readonly body: FieldRef<"Comment", 'String'>
    readonly hidden_at: FieldRef<"Comment", 'DateTime'>
    readonly created_at: FieldRef<"Comment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Bookmark
   */

  export type AggregateBookmark = {
    _count: BookmarkCountAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  export type BookmarkMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    manga_id: string | null
    created_at: Date | null
  }

  export type BookmarkMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    manga_id: string | null
    created_at: Date | null
  }

  export type BookmarkCountAggregateOutputType = {
    id: number
    user_id: number
    manga_id: number
    created_at: number
    _all: number
  }


  export type BookmarkMinAggregateInputType = {
    id?: true
    user_id?: true
    manga_id?: true
    created_at?: true
  }

  export type BookmarkMaxAggregateInputType = {
    id?: true
    user_id?: true
    manga_id?: true
    created_at?: true
  }

  export type BookmarkCountAggregateInputType = {
    id?: true
    user_id?: true
    manga_id?: true
    created_at?: true
    _all?: true
  }

  export type BookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmark to aggregate.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookmarks
    **/
    _count?: true | BookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookmarkMaxAggregateInputType
  }

  export type GetBookmarkAggregateType<T extends BookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookmark[P]>
      : GetScalarType<T[P], AggregateBookmark[P]>
  }




  export type BookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithAggregationInput | BookmarkOrderByWithAggregationInput[]
    by: BookmarkScalarFieldEnum[] | BookmarkScalarFieldEnum
    having?: BookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookmarkCountAggregateInputType | true
    _min?: BookmarkMinAggregateInputType
    _max?: BookmarkMaxAggregateInputType
  }

  export type BookmarkGroupByOutputType = {
    id: string
    user_id: string
    manga_id: string
    created_at: Date
    _count: BookmarkCountAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  type GetBookmarkGroupByPayload<T extends BookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
        }
      >
    >


  export type BookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    manga_id?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    manga_id?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    manga_id?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectScalar = {
    id?: boolean
    user_id?: boolean
    manga_id?: boolean
    created_at?: boolean
  }

  export type BookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "manga_id" | "created_at", ExtArgs["result"]["bookmark"]>
  export type BookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    manga?: boolean | MangaDefaultArgs<ExtArgs>
  }

  export type $BookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bookmark"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      manga: Prisma.$MangaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      manga_id: string
      created_at: Date
    }, ExtArgs["result"]["bookmark"]>
    composites: {}
  }

  type BookmarkGetPayload<S extends boolean | null | undefined | BookmarkDefaultArgs> = $Result.GetResult<Prisma.$BookmarkPayload, S>

  type BookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookmarkCountAggregateInputType | true
    }

  export interface BookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bookmark'], meta: { name: 'Bookmark' } }
    /**
     * Find zero or one Bookmark that matches the filter.
     * @param {BookmarkFindUniqueArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookmarkFindUniqueArgs>(args: SelectSubset<T, BookmarkFindUniqueArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookmarkFindUniqueOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, BookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookmarkFindFirstArgs>(args?: SelectSubset<T, BookmarkFindFirstArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, BookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookmarks
     * const bookmarks = await prisma.bookmark.findMany()
     * 
     * // Get first 10 Bookmarks
     * const bookmarks = await prisma.bookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookmarkFindManyArgs>(args?: SelectSubset<T, BookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookmark.
     * @param {BookmarkCreateArgs} args - Arguments to create a Bookmark.
     * @example
     * // Create one Bookmark
     * const Bookmark = await prisma.bookmark.create({
     *   data: {
     *     // ... data to create a Bookmark
     *   }
     * })
     * 
     */
    create<T extends BookmarkCreateArgs>(args: SelectSubset<T, BookmarkCreateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookmarks.
     * @param {BookmarkCreateManyArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookmarkCreateManyArgs>(args?: SelectSubset<T, BookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookmarks and returns the data saved in the database.
     * @param {BookmarkCreateManyAndReturnArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, BookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bookmark.
     * @param {BookmarkDeleteArgs} args - Arguments to delete one Bookmark.
     * @example
     * // Delete one Bookmark
     * const Bookmark = await prisma.bookmark.delete({
     *   where: {
     *     // ... filter to delete one Bookmark
     *   }
     * })
     * 
     */
    delete<T extends BookmarkDeleteArgs>(args: SelectSubset<T, BookmarkDeleteArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookmark.
     * @param {BookmarkUpdateArgs} args - Arguments to update one Bookmark.
     * @example
     * // Update one Bookmark
     * const bookmark = await prisma.bookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookmarkUpdateArgs>(args: SelectSubset<T, BookmarkUpdateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookmarks.
     * @param {BookmarkDeleteManyArgs} args - Arguments to filter Bookmarks to delete.
     * @example
     * // Delete a few Bookmarks
     * const { count } = await prisma.bookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookmarkDeleteManyArgs>(args?: SelectSubset<T, BookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookmarkUpdateManyArgs>(args: SelectSubset<T, BookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks and returns the data updated in the database.
     * @param {BookmarkUpdateManyAndReturnArgs} args - Arguments to update many Bookmarks.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, BookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bookmark.
     * @param {BookmarkUpsertArgs} args - Arguments to update or create a Bookmark.
     * @example
     * // Update or create a Bookmark
     * const bookmark = await prisma.bookmark.upsert({
     *   create: {
     *     // ... data to create a Bookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookmark we want to update
     *   }
     * })
     */
    upsert<T extends BookmarkUpsertArgs>(args: SelectSubset<T, BookmarkUpsertArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCountArgs} args - Arguments to filter Bookmarks to count.
     * @example
     * // Count the number of Bookmarks
     * const count = await prisma.bookmark.count({
     *   where: {
     *     // ... the filter for the Bookmarks we want to count
     *   }
     * })
    **/
    count<T extends BookmarkCountArgs>(
      args?: Subset<T, BookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookmarkAggregateArgs>(args: Subset<T, BookmarkAggregateArgs>): Prisma.PrismaPromise<GetBookmarkAggregateType<T>>

    /**
     * Group by Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkGroupByArgs} args - Group by arguments.
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
      T extends BookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookmarkGroupByArgs['orderBy'] }
        : { orderBy?: BookmarkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bookmark model
   */
  readonly fields: BookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    manga<T extends MangaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MangaDefaultArgs<ExtArgs>>): Prisma__MangaClient<$Result.GetResult<Prisma.$MangaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bookmark model
   */
  interface BookmarkFieldRefs {
    readonly id: FieldRef<"Bookmark", 'String'>
    readonly user_id: FieldRef<"Bookmark", 'String'>
    readonly manga_id: FieldRef<"Bookmark", 'String'>
    readonly created_at: FieldRef<"Bookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bookmark findUnique
   */
  export type BookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findUniqueOrThrow
   */
  export type BookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findFirst
   */
  export type BookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findFirstOrThrow
   */
  export type BookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findMany
   */
  export type BookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmarks to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark create
   */
  export type BookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a Bookmark.
     */
    data: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
  }

  /**
   * Bookmark createMany
   */
  export type BookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bookmark createManyAndReturn
   */
  export type BookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark update
   */
  export type BookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a Bookmark.
     */
    data: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
    /**
     * Choose, which Bookmark to update.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark updateMany
   */
  export type BookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
  }

  /**
   * Bookmark updateManyAndReturn
   */
  export type BookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark upsert
   */
  export type BookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the Bookmark to update in case it exists.
     */
    where: BookmarkWhereUniqueInput
    /**
     * In case the Bookmark found by the `where` argument doesn't exist, create a new Bookmark with this data.
     */
    create: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
    /**
     * In case the Bookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
  }

  /**
   * Bookmark delete
   */
  export type BookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter which Bookmark to delete.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark deleteMany
   */
  export type BookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmarks to delete
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to delete.
     */
    limit?: number
  }

  /**
   * Bookmark without action
   */
  export type BookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
  }


  /**
   * Model ChapterBookmark
   */

  export type AggregateChapterBookmark = {
    _count: ChapterBookmarkCountAggregateOutputType | null
    _min: ChapterBookmarkMinAggregateOutputType | null
    _max: ChapterBookmarkMaxAggregateOutputType | null
  }

  export type ChapterBookmarkMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    chapter_id: string | null
    created_at: Date | null
  }

  export type ChapterBookmarkMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    chapter_id: string | null
    created_at: Date | null
  }

  export type ChapterBookmarkCountAggregateOutputType = {
    id: number
    user_id: number
    chapter_id: number
    created_at: number
    _all: number
  }


  export type ChapterBookmarkMinAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    created_at?: true
  }

  export type ChapterBookmarkMaxAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    created_at?: true
  }

  export type ChapterBookmarkCountAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    created_at?: true
    _all?: true
  }

  export type ChapterBookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChapterBookmark to aggregate.
     */
    where?: ChapterBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChapterBookmarks to fetch.
     */
    orderBy?: ChapterBookmarkOrderByWithRelationInput | ChapterBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChapterBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChapterBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChapterBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChapterBookmarks
    **/
    _count?: true | ChapterBookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChapterBookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChapterBookmarkMaxAggregateInputType
  }

  export type GetChapterBookmarkAggregateType<T extends ChapterBookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateChapterBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChapterBookmark[P]>
      : GetScalarType<T[P], AggregateChapterBookmark[P]>
  }




  export type ChapterBookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterBookmarkWhereInput
    orderBy?: ChapterBookmarkOrderByWithAggregationInput | ChapterBookmarkOrderByWithAggregationInput[]
    by: ChapterBookmarkScalarFieldEnum[] | ChapterBookmarkScalarFieldEnum
    having?: ChapterBookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChapterBookmarkCountAggregateInputType | true
    _min?: ChapterBookmarkMinAggregateInputType
    _max?: ChapterBookmarkMaxAggregateInputType
  }

  export type ChapterBookmarkGroupByOutputType = {
    id: string
    user_id: string
    chapter_id: string
    created_at: Date
    _count: ChapterBookmarkCountAggregateOutputType | null
    _min: ChapterBookmarkMinAggregateOutputType | null
    _max: ChapterBookmarkMaxAggregateOutputType | null
  }

  type GetChapterBookmarkGroupByPayload<T extends ChapterBookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChapterBookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChapterBookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChapterBookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], ChapterBookmarkGroupByOutputType[P]>
        }
      >
    >


  export type ChapterBookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapterBookmark"]>

  export type ChapterBookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapterBookmark"]>

  export type ChapterBookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapterBookmark"]>

  export type ChapterBookmarkSelectScalar = {
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    created_at?: boolean
  }

  export type ChapterBookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "chapter_id" | "created_at", ExtArgs["result"]["chapterBookmark"]>
  export type ChapterBookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }
  export type ChapterBookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }
  export type ChapterBookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }

  export type $ChapterBookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChapterBookmark"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chapter: Prisma.$ChapterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      chapter_id: string
      created_at: Date
    }, ExtArgs["result"]["chapterBookmark"]>
    composites: {}
  }

  type ChapterBookmarkGetPayload<S extends boolean | null | undefined | ChapterBookmarkDefaultArgs> = $Result.GetResult<Prisma.$ChapterBookmarkPayload, S>

  type ChapterBookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChapterBookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChapterBookmarkCountAggregateInputType | true
    }

  export interface ChapterBookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChapterBookmark'], meta: { name: 'ChapterBookmark' } }
    /**
     * Find zero or one ChapterBookmark that matches the filter.
     * @param {ChapterBookmarkFindUniqueArgs} args - Arguments to find a ChapterBookmark
     * @example
     * // Get one ChapterBookmark
     * const chapterBookmark = await prisma.chapterBookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChapterBookmarkFindUniqueArgs>(args: SelectSubset<T, ChapterBookmarkFindUniqueArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChapterBookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChapterBookmarkFindUniqueOrThrowArgs} args - Arguments to find a ChapterBookmark
     * @example
     * // Get one ChapterBookmark
     * const chapterBookmark = await prisma.chapterBookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChapterBookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, ChapterBookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChapterBookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkFindFirstArgs} args - Arguments to find a ChapterBookmark
     * @example
     * // Get one ChapterBookmark
     * const chapterBookmark = await prisma.chapterBookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChapterBookmarkFindFirstArgs>(args?: SelectSubset<T, ChapterBookmarkFindFirstArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChapterBookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkFindFirstOrThrowArgs} args - Arguments to find a ChapterBookmark
     * @example
     * // Get one ChapterBookmark
     * const chapterBookmark = await prisma.chapterBookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChapterBookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, ChapterBookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChapterBookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChapterBookmarks
     * const chapterBookmarks = await prisma.chapterBookmark.findMany()
     * 
     * // Get first 10 ChapterBookmarks
     * const chapterBookmarks = await prisma.chapterBookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chapterBookmarkWithIdOnly = await prisma.chapterBookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChapterBookmarkFindManyArgs>(args?: SelectSubset<T, ChapterBookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChapterBookmark.
     * @param {ChapterBookmarkCreateArgs} args - Arguments to create a ChapterBookmark.
     * @example
     * // Create one ChapterBookmark
     * const ChapterBookmark = await prisma.chapterBookmark.create({
     *   data: {
     *     // ... data to create a ChapterBookmark
     *   }
     * })
     * 
     */
    create<T extends ChapterBookmarkCreateArgs>(args: SelectSubset<T, ChapterBookmarkCreateArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChapterBookmarks.
     * @param {ChapterBookmarkCreateManyArgs} args - Arguments to create many ChapterBookmarks.
     * @example
     * // Create many ChapterBookmarks
     * const chapterBookmark = await prisma.chapterBookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChapterBookmarkCreateManyArgs>(args?: SelectSubset<T, ChapterBookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChapterBookmarks and returns the data saved in the database.
     * @param {ChapterBookmarkCreateManyAndReturnArgs} args - Arguments to create many ChapterBookmarks.
     * @example
     * // Create many ChapterBookmarks
     * const chapterBookmark = await prisma.chapterBookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChapterBookmarks and only return the `id`
     * const chapterBookmarkWithIdOnly = await prisma.chapterBookmark.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChapterBookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, ChapterBookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChapterBookmark.
     * @param {ChapterBookmarkDeleteArgs} args - Arguments to delete one ChapterBookmark.
     * @example
     * // Delete one ChapterBookmark
     * const ChapterBookmark = await prisma.chapterBookmark.delete({
     *   where: {
     *     // ... filter to delete one ChapterBookmark
     *   }
     * })
     * 
     */
    delete<T extends ChapterBookmarkDeleteArgs>(args: SelectSubset<T, ChapterBookmarkDeleteArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChapterBookmark.
     * @param {ChapterBookmarkUpdateArgs} args - Arguments to update one ChapterBookmark.
     * @example
     * // Update one ChapterBookmark
     * const chapterBookmark = await prisma.chapterBookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChapterBookmarkUpdateArgs>(args: SelectSubset<T, ChapterBookmarkUpdateArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChapterBookmarks.
     * @param {ChapterBookmarkDeleteManyArgs} args - Arguments to filter ChapterBookmarks to delete.
     * @example
     * // Delete a few ChapterBookmarks
     * const { count } = await prisma.chapterBookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChapterBookmarkDeleteManyArgs>(args?: SelectSubset<T, ChapterBookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChapterBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChapterBookmarks
     * const chapterBookmark = await prisma.chapterBookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChapterBookmarkUpdateManyArgs>(args: SelectSubset<T, ChapterBookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChapterBookmarks and returns the data updated in the database.
     * @param {ChapterBookmarkUpdateManyAndReturnArgs} args - Arguments to update many ChapterBookmarks.
     * @example
     * // Update many ChapterBookmarks
     * const chapterBookmark = await prisma.chapterBookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChapterBookmarks and only return the `id`
     * const chapterBookmarkWithIdOnly = await prisma.chapterBookmark.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChapterBookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, ChapterBookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChapterBookmark.
     * @param {ChapterBookmarkUpsertArgs} args - Arguments to update or create a ChapterBookmark.
     * @example
     * // Update or create a ChapterBookmark
     * const chapterBookmark = await prisma.chapterBookmark.upsert({
     *   create: {
     *     // ... data to create a ChapterBookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChapterBookmark we want to update
     *   }
     * })
     */
    upsert<T extends ChapterBookmarkUpsertArgs>(args: SelectSubset<T, ChapterBookmarkUpsertArgs<ExtArgs>>): Prisma__ChapterBookmarkClient<$Result.GetResult<Prisma.$ChapterBookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChapterBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkCountArgs} args - Arguments to filter ChapterBookmarks to count.
     * @example
     * // Count the number of ChapterBookmarks
     * const count = await prisma.chapterBookmark.count({
     *   where: {
     *     // ... the filter for the ChapterBookmarks we want to count
     *   }
     * })
    **/
    count<T extends ChapterBookmarkCountArgs>(
      args?: Subset<T, ChapterBookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChapterBookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChapterBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChapterBookmarkAggregateArgs>(args: Subset<T, ChapterBookmarkAggregateArgs>): Prisma.PrismaPromise<GetChapterBookmarkAggregateType<T>>

    /**
     * Group by ChapterBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterBookmarkGroupByArgs} args - Group by arguments.
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
      T extends ChapterBookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChapterBookmarkGroupByArgs['orderBy'] }
        : { orderBy?: ChapterBookmarkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChapterBookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChapterBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChapterBookmark model
   */
  readonly fields: ChapterBookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChapterBookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChapterBookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chapter<T extends ChapterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChapterDefaultArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChapterBookmark model
   */
  interface ChapterBookmarkFieldRefs {
    readonly id: FieldRef<"ChapterBookmark", 'String'>
    readonly user_id: FieldRef<"ChapterBookmark", 'String'>
    readonly chapter_id: FieldRef<"ChapterBookmark", 'String'>
    readonly created_at: FieldRef<"ChapterBookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChapterBookmark findUnique
   */
  export type ChapterBookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which ChapterBookmark to fetch.
     */
    where: ChapterBookmarkWhereUniqueInput
  }

  /**
   * ChapterBookmark findUniqueOrThrow
   */
  export type ChapterBookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which ChapterBookmark to fetch.
     */
    where: ChapterBookmarkWhereUniqueInput
  }

  /**
   * ChapterBookmark findFirst
   */
  export type ChapterBookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which ChapterBookmark to fetch.
     */
    where?: ChapterBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChapterBookmarks to fetch.
     */
    orderBy?: ChapterBookmarkOrderByWithRelationInput | ChapterBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChapterBookmarks.
     */
    cursor?: ChapterBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChapterBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChapterBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChapterBookmarks.
     */
    distinct?: ChapterBookmarkScalarFieldEnum | ChapterBookmarkScalarFieldEnum[]
  }

  /**
   * ChapterBookmark findFirstOrThrow
   */
  export type ChapterBookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which ChapterBookmark to fetch.
     */
    where?: ChapterBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChapterBookmarks to fetch.
     */
    orderBy?: ChapterBookmarkOrderByWithRelationInput | ChapterBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChapterBookmarks.
     */
    cursor?: ChapterBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChapterBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChapterBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChapterBookmarks.
     */
    distinct?: ChapterBookmarkScalarFieldEnum | ChapterBookmarkScalarFieldEnum[]
  }

  /**
   * ChapterBookmark findMany
   */
  export type ChapterBookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which ChapterBookmarks to fetch.
     */
    where?: ChapterBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChapterBookmarks to fetch.
     */
    orderBy?: ChapterBookmarkOrderByWithRelationInput | ChapterBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChapterBookmarks.
     */
    cursor?: ChapterBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChapterBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChapterBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChapterBookmarks.
     */
    distinct?: ChapterBookmarkScalarFieldEnum | ChapterBookmarkScalarFieldEnum[]
  }

  /**
   * ChapterBookmark create
   */
  export type ChapterBookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a ChapterBookmark.
     */
    data: XOR<ChapterBookmarkCreateInput, ChapterBookmarkUncheckedCreateInput>
  }

  /**
   * ChapterBookmark createMany
   */
  export type ChapterBookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChapterBookmarks.
     */
    data: ChapterBookmarkCreateManyInput | ChapterBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChapterBookmark createManyAndReturn
   */
  export type ChapterBookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many ChapterBookmarks.
     */
    data: ChapterBookmarkCreateManyInput | ChapterBookmarkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChapterBookmark update
   */
  export type ChapterBookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a ChapterBookmark.
     */
    data: XOR<ChapterBookmarkUpdateInput, ChapterBookmarkUncheckedUpdateInput>
    /**
     * Choose, which ChapterBookmark to update.
     */
    where: ChapterBookmarkWhereUniqueInput
  }

  /**
   * ChapterBookmark updateMany
   */
  export type ChapterBookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChapterBookmarks.
     */
    data: XOR<ChapterBookmarkUpdateManyMutationInput, ChapterBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which ChapterBookmarks to update
     */
    where?: ChapterBookmarkWhereInput
    /**
     * Limit how many ChapterBookmarks to update.
     */
    limit?: number
  }

  /**
   * ChapterBookmark updateManyAndReturn
   */
  export type ChapterBookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * The data used to update ChapterBookmarks.
     */
    data: XOR<ChapterBookmarkUpdateManyMutationInput, ChapterBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which ChapterBookmarks to update
     */
    where?: ChapterBookmarkWhereInput
    /**
     * Limit how many ChapterBookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChapterBookmark upsert
   */
  export type ChapterBookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the ChapterBookmark to update in case it exists.
     */
    where: ChapterBookmarkWhereUniqueInput
    /**
     * In case the ChapterBookmark found by the `where` argument doesn't exist, create a new ChapterBookmark with this data.
     */
    create: XOR<ChapterBookmarkCreateInput, ChapterBookmarkUncheckedCreateInput>
    /**
     * In case the ChapterBookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChapterBookmarkUpdateInput, ChapterBookmarkUncheckedUpdateInput>
  }

  /**
   * ChapterBookmark delete
   */
  export type ChapterBookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
    /**
     * Filter which ChapterBookmark to delete.
     */
    where: ChapterBookmarkWhereUniqueInput
  }

  /**
   * ChapterBookmark deleteMany
   */
  export type ChapterBookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChapterBookmarks to delete
     */
    where?: ChapterBookmarkWhereInput
    /**
     * Limit how many ChapterBookmarks to delete.
     */
    limit?: number
  }

  /**
   * ChapterBookmark without action
   */
  export type ChapterBookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterBookmark
     */
    select?: ChapterBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChapterBookmark
     */
    omit?: ChapterBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterBookmarkInclude<ExtArgs> | null
  }


  /**
   * Model ReadingProgress
   */

  export type AggregateReadingProgress = {
    _count: ReadingProgressCountAggregateOutputType | null
    _avg: ReadingProgressAvgAggregateOutputType | null
    _sum: ReadingProgressSumAggregateOutputType | null
    _min: ReadingProgressMinAggregateOutputType | null
    _max: ReadingProgressMaxAggregateOutputType | null
  }

  export type ReadingProgressAvgAggregateOutputType = {
    last_page_read: number | null
  }

  export type ReadingProgressSumAggregateOutputType = {
    last_page_read: number | null
  }

  export type ReadingProgressMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    chapter_id: string | null
    last_page_read: number | null
    completed: boolean | null
    updated_at: Date | null
  }

  export type ReadingProgressMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    chapter_id: string | null
    last_page_read: number | null
    completed: boolean | null
    updated_at: Date | null
  }

  export type ReadingProgressCountAggregateOutputType = {
    id: number
    user_id: number
    chapter_id: number
    last_page_read: number
    completed: number
    updated_at: number
    _all: number
  }


  export type ReadingProgressAvgAggregateInputType = {
    last_page_read?: true
  }

  export type ReadingProgressSumAggregateInputType = {
    last_page_read?: true
  }

  export type ReadingProgressMinAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    last_page_read?: true
    completed?: true
    updated_at?: true
  }

  export type ReadingProgressMaxAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    last_page_read?: true
    completed?: true
    updated_at?: true
  }

  export type ReadingProgressCountAggregateInputType = {
    id?: true
    user_id?: true
    chapter_id?: true
    last_page_read?: true
    completed?: true
    updated_at?: true
    _all?: true
  }

  export type ReadingProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingProgress to aggregate.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReadingProgresses
    **/
    _count?: true | ReadingProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReadingProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReadingProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReadingProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReadingProgressMaxAggregateInputType
  }

  export type GetReadingProgressAggregateType<T extends ReadingProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateReadingProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReadingProgress[P]>
      : GetScalarType<T[P], AggregateReadingProgress[P]>
  }




  export type ReadingProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingProgressWhereInput
    orderBy?: ReadingProgressOrderByWithAggregationInput | ReadingProgressOrderByWithAggregationInput[]
    by: ReadingProgressScalarFieldEnum[] | ReadingProgressScalarFieldEnum
    having?: ReadingProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReadingProgressCountAggregateInputType | true
    _avg?: ReadingProgressAvgAggregateInputType
    _sum?: ReadingProgressSumAggregateInputType
    _min?: ReadingProgressMinAggregateInputType
    _max?: ReadingProgressMaxAggregateInputType
  }

  export type ReadingProgressGroupByOutputType = {
    id: string
    user_id: string
    chapter_id: string
    last_page_read: number
    completed: boolean
    updated_at: Date
    _count: ReadingProgressCountAggregateOutputType | null
    _avg: ReadingProgressAvgAggregateOutputType | null
    _sum: ReadingProgressSumAggregateOutputType | null
    _min: ReadingProgressMinAggregateOutputType | null
    _max: ReadingProgressMaxAggregateOutputType | null
  }

  type GetReadingProgressGroupByPayload<T extends ReadingProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReadingProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReadingProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReadingProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ReadingProgressGroupByOutputType[P]>
        }
      >
    >


  export type ReadingProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    last_page_read?: boolean
    completed?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingProgress"]>

  export type ReadingProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    last_page_read?: boolean
    completed?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingProgress"]>

  export type ReadingProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    last_page_read?: boolean
    completed?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingProgress"]>

  export type ReadingProgressSelectScalar = {
    id?: boolean
    user_id?: boolean
    chapter_id?: boolean
    last_page_read?: boolean
    completed?: boolean
    updated_at?: boolean
  }

  export type ReadingProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "chapter_id" | "last_page_read" | "completed" | "updated_at", ExtArgs["result"]["readingProgress"]>
  export type ReadingProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }
  export type ReadingProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }
  export type ReadingProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | ChapterDefaultArgs<ExtArgs>
  }

  export type $ReadingProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReadingProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chapter: Prisma.$ChapterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      chapter_id: string
      last_page_read: number
      completed: boolean
      updated_at: Date
    }, ExtArgs["result"]["readingProgress"]>
    composites: {}
  }

  type ReadingProgressGetPayload<S extends boolean | null | undefined | ReadingProgressDefaultArgs> = $Result.GetResult<Prisma.$ReadingProgressPayload, S>

  type ReadingProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReadingProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReadingProgressCountAggregateInputType | true
    }

  export interface ReadingProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReadingProgress'], meta: { name: 'ReadingProgress' } }
    /**
     * Find zero or one ReadingProgress that matches the filter.
     * @param {ReadingProgressFindUniqueArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReadingProgressFindUniqueArgs>(args: SelectSubset<T, ReadingProgressFindUniqueArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReadingProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReadingProgressFindUniqueOrThrowArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReadingProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ReadingProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReadingProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressFindFirstArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReadingProgressFindFirstArgs>(args?: SelectSubset<T, ReadingProgressFindFirstArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReadingProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressFindFirstOrThrowArgs} args - Arguments to find a ReadingProgress
     * @example
     * // Get one ReadingProgress
     * const readingProgress = await prisma.readingProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReadingProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ReadingProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReadingProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReadingProgresses
     * const readingProgresses = await prisma.readingProgress.findMany()
     * 
     * // Get first 10 ReadingProgresses
     * const readingProgresses = await prisma.readingProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const readingProgressWithIdOnly = await prisma.readingProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReadingProgressFindManyArgs>(args?: SelectSubset<T, ReadingProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReadingProgress.
     * @param {ReadingProgressCreateArgs} args - Arguments to create a ReadingProgress.
     * @example
     * // Create one ReadingProgress
     * const ReadingProgress = await prisma.readingProgress.create({
     *   data: {
     *     // ... data to create a ReadingProgress
     *   }
     * })
     * 
     */
    create<T extends ReadingProgressCreateArgs>(args: SelectSubset<T, ReadingProgressCreateArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReadingProgresses.
     * @param {ReadingProgressCreateManyArgs} args - Arguments to create many ReadingProgresses.
     * @example
     * // Create many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReadingProgressCreateManyArgs>(args?: SelectSubset<T, ReadingProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReadingProgresses and returns the data saved in the database.
     * @param {ReadingProgressCreateManyAndReturnArgs} args - Arguments to create many ReadingProgresses.
     * @example
     * // Create many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReadingProgresses and only return the `id`
     * const readingProgressWithIdOnly = await prisma.readingProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReadingProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ReadingProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReadingProgress.
     * @param {ReadingProgressDeleteArgs} args - Arguments to delete one ReadingProgress.
     * @example
     * // Delete one ReadingProgress
     * const ReadingProgress = await prisma.readingProgress.delete({
     *   where: {
     *     // ... filter to delete one ReadingProgress
     *   }
     * })
     * 
     */
    delete<T extends ReadingProgressDeleteArgs>(args: SelectSubset<T, ReadingProgressDeleteArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReadingProgress.
     * @param {ReadingProgressUpdateArgs} args - Arguments to update one ReadingProgress.
     * @example
     * // Update one ReadingProgress
     * const readingProgress = await prisma.readingProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReadingProgressUpdateArgs>(args: SelectSubset<T, ReadingProgressUpdateArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReadingProgresses.
     * @param {ReadingProgressDeleteManyArgs} args - Arguments to filter ReadingProgresses to delete.
     * @example
     * // Delete a few ReadingProgresses
     * const { count } = await prisma.readingProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReadingProgressDeleteManyArgs>(args?: SelectSubset<T, ReadingProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReadingProgressUpdateManyArgs>(args: SelectSubset<T, ReadingProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingProgresses and returns the data updated in the database.
     * @param {ReadingProgressUpdateManyAndReturnArgs} args - Arguments to update many ReadingProgresses.
     * @example
     * // Update many ReadingProgresses
     * const readingProgress = await prisma.readingProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReadingProgresses and only return the `id`
     * const readingProgressWithIdOnly = await prisma.readingProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReadingProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, ReadingProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReadingProgress.
     * @param {ReadingProgressUpsertArgs} args - Arguments to update or create a ReadingProgress.
     * @example
     * // Update or create a ReadingProgress
     * const readingProgress = await prisma.readingProgress.upsert({
     *   create: {
     *     // ... data to create a ReadingProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReadingProgress we want to update
     *   }
     * })
     */
    upsert<T extends ReadingProgressUpsertArgs>(args: SelectSubset<T, ReadingProgressUpsertArgs<ExtArgs>>): Prisma__ReadingProgressClient<$Result.GetResult<Prisma.$ReadingProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReadingProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressCountArgs} args - Arguments to filter ReadingProgresses to count.
     * @example
     * // Count the number of ReadingProgresses
     * const count = await prisma.readingProgress.count({
     *   where: {
     *     // ... the filter for the ReadingProgresses we want to count
     *   }
     * })
    **/
    count<T extends ReadingProgressCountArgs>(
      args?: Subset<T, ReadingProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReadingProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReadingProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReadingProgressAggregateArgs>(args: Subset<T, ReadingProgressAggregateArgs>): Prisma.PrismaPromise<GetReadingProgressAggregateType<T>>

    /**
     * Group by ReadingProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingProgressGroupByArgs} args - Group by arguments.
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
      T extends ReadingProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReadingProgressGroupByArgs['orderBy'] }
        : { orderBy?: ReadingProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReadingProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReadingProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReadingProgress model
   */
  readonly fields: ReadingProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReadingProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReadingProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chapter<T extends ChapterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChapterDefaultArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReadingProgress model
   */
  interface ReadingProgressFieldRefs {
    readonly id: FieldRef<"ReadingProgress", 'String'>
    readonly user_id: FieldRef<"ReadingProgress", 'String'>
    readonly chapter_id: FieldRef<"ReadingProgress", 'String'>
    readonly last_page_read: FieldRef<"ReadingProgress", 'Int'>
    readonly completed: FieldRef<"ReadingProgress", 'Boolean'>
    readonly updated_at: FieldRef<"ReadingProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReadingProgress findUnique
   */
  export type ReadingProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress findUniqueOrThrow
   */
  export type ReadingProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress findFirst
   */
  export type ReadingProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingProgresses.
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingProgresses.
     */
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * ReadingProgress findFirstOrThrow
   */
  export type ReadingProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgress to fetch.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingProgresses.
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingProgresses.
     */
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * ReadingProgress findMany
   */
  export type ReadingProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter, which ReadingProgresses to fetch.
     */
    where?: ReadingProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingProgresses to fetch.
     */
    orderBy?: ReadingProgressOrderByWithRelationInput | ReadingProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReadingProgresses.
     */
    cursor?: ReadingProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingProgresses.
     */
    distinct?: ReadingProgressScalarFieldEnum | ReadingProgressScalarFieldEnum[]
  }

  /**
   * ReadingProgress create
   */
  export type ReadingProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a ReadingProgress.
     */
    data: XOR<ReadingProgressCreateInput, ReadingProgressUncheckedCreateInput>
  }

  /**
   * ReadingProgress createMany
   */
  export type ReadingProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReadingProgresses.
     */
    data: ReadingProgressCreateManyInput | ReadingProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReadingProgress createManyAndReturn
   */
  export type ReadingProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * The data used to create many ReadingProgresses.
     */
    data: ReadingProgressCreateManyInput | ReadingProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReadingProgress update
   */
  export type ReadingProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a ReadingProgress.
     */
    data: XOR<ReadingProgressUpdateInput, ReadingProgressUncheckedUpdateInput>
    /**
     * Choose, which ReadingProgress to update.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress updateMany
   */
  export type ReadingProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReadingProgresses.
     */
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyInput>
    /**
     * Filter which ReadingProgresses to update
     */
    where?: ReadingProgressWhereInput
    /**
     * Limit how many ReadingProgresses to update.
     */
    limit?: number
  }

  /**
   * ReadingProgress updateManyAndReturn
   */
  export type ReadingProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * The data used to update ReadingProgresses.
     */
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyInput>
    /**
     * Filter which ReadingProgresses to update
     */
    where?: ReadingProgressWhereInput
    /**
     * Limit how many ReadingProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReadingProgress upsert
   */
  export type ReadingProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the ReadingProgress to update in case it exists.
     */
    where: ReadingProgressWhereUniqueInput
    /**
     * In case the ReadingProgress found by the `where` argument doesn't exist, create a new ReadingProgress with this data.
     */
    create: XOR<ReadingProgressCreateInput, ReadingProgressUncheckedCreateInput>
    /**
     * In case the ReadingProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReadingProgressUpdateInput, ReadingProgressUncheckedUpdateInput>
  }

  /**
   * ReadingProgress delete
   */
  export type ReadingProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
    /**
     * Filter which ReadingProgress to delete.
     */
    where: ReadingProgressWhereUniqueInput
  }

  /**
   * ReadingProgress deleteMany
   */
  export type ReadingProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingProgresses to delete
     */
    where?: ReadingProgressWhereInput
    /**
     * Limit how many ReadingProgresses to delete.
     */
    limit?: number
  }

  /**
   * ReadingProgress without action
   */
  export type ReadingProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingProgress
     */
    select?: ReadingProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingProgress
     */
    omit?: ReadingProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingProgressInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    emailVerified: 'emailVerified',
    name: 'name',
    image: 'image',
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    issuer: 'issuer',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    token: 'token',
    expiresAt: 'expiresAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const MangaScalarFieldEnum: {
    id: 'id',
    author_id: 'author_id',
    manga_title: 'manga_title',
    manga_synopsis: 'manga_synopsis',
    cover_image_url: 'cover_image_url',
    banner_image_url: 'banner_image_url',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type MangaScalarFieldEnum = (typeof MangaScalarFieldEnum)[keyof typeof MangaScalarFieldEnum]


  export const ArcScalarFieldEnum: {
    id: 'id',
    manga_id: 'manga_id',
    arc_name: 'arc_name',
    arc_order: 'arc_order',
    arc_status: 'arc_status',
    arc_image_url: 'arc_image_url',
    created_at: 'created_at'
  };

  export type ArcScalarFieldEnum = (typeof ArcScalarFieldEnum)[keyof typeof ArcScalarFieldEnum]


  export const ChapterScalarFieldEnum: {
    id: 'id',
    manga_id: 'manga_id',
    arc_id: 'arc_id',
    chapter_number: 'chapter_number',
    chapter_name: 'chapter_name',
    cover_image_url: 'cover_image_url',
    published_date: 'published_date',
    view_count: 'view_count',
    comment_count: 'comment_count',
    created_at: 'created_at'
  };

  export type ChapterScalarFieldEnum = (typeof ChapterScalarFieldEnum)[keyof typeof ChapterScalarFieldEnum]


  export const TranslationScalarFieldEnum: {
    id: 'id',
    chapter_id: 'chapter_id',
    language: 'language',
    file_url: 'file_url',
    translator_id: 'translator_id',
    created_at: 'created_at'
  };

  export type TranslationScalarFieldEnum = (typeof TranslationScalarFieldEnum)[keyof typeof TranslationScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    chapter_id: 'chapter_id',
    body: 'body',
    hidden_at: 'hidden_at',
    created_at: 'created_at'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const BookmarkScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    manga_id: 'manga_id',
    created_at: 'created_at'
  };

  export type BookmarkScalarFieldEnum = (typeof BookmarkScalarFieldEnum)[keyof typeof BookmarkScalarFieldEnum]


  export const ChapterBookmarkScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    chapter_id: 'chapter_id',
    created_at: 'created_at'
  };

  export type ChapterBookmarkScalarFieldEnum = (typeof ChapterBookmarkScalarFieldEnum)[keyof typeof ChapterBookmarkScalarFieldEnum]


  export const ReadingProgressScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    chapter_id: 'chapter_id',
    last_page_read: 'last_page_read',
    completed: 'completed',
    updated_at: 'updated_at'
  };

  export type ReadingProgressScalarFieldEnum = (typeof ReadingProgressScalarFieldEnum)[keyof typeof ReadingProgressScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ArcStatus'
   */
  export type EnumArcStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArcStatus'>
    


  /**
   * Reference to a field of type 'ArcStatus[]'
   */
  export type ListEnumArcStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArcStatus[]'>
    


  /**
   * Reference to a field of type 'Language'
   */
  export type EnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language'>
    


  /**
   * Reference to a field of type 'Language[]'
   */
  export type ListEnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    manga?: MangaListRelationFilter
    translations?: TranslationListRelationFilter
    comments?: CommentListRelationFilter
    bookmarks?: BookmarkListRelationFilter
    chapter_bookmarks?: ChapterBookmarkListRelationFilter
    reading_progress?: ReadingProgressListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    manga?: MangaOrderByRelationAggregateInput
    translations?: TranslationOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
    bookmarks?: BookmarkOrderByRelationAggregateInput
    chapter_bookmarks?: ChapterBookmarkOrderByRelationAggregateInput
    reading_progress?: ReadingProgressOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    emailVerified?: BoolFilter<"User"> | boolean
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    manga?: MangaListRelationFilter
    translations?: TranslationListRelationFilter
    comments?: CommentListRelationFilter
    bookmarks?: BookmarkListRelationFilter
    chapter_bookmarks?: ChapterBookmarkListRelationFilter
    reading_progress?: ReadingProgressListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    issuer?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    issuer?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    issuer_accountId?: AccountIssuerAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    issuer?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "issuer_accountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    issuer?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    issuer?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    token?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type MangaWhereInput = {
    AND?: MangaWhereInput | MangaWhereInput[]
    OR?: MangaWhereInput[]
    NOT?: MangaWhereInput | MangaWhereInput[]
    id?: StringFilter<"Manga"> | string
    author_id?: StringFilter<"Manga"> | string
    manga_title?: StringFilter<"Manga"> | string
    manga_synopsis?: StringFilter<"Manga"> | string
    cover_image_url?: StringNullableFilter<"Manga"> | string | null
    banner_image_url?: StringNullableFilter<"Manga"> | string | null
    created_at?: DateTimeFilter<"Manga"> | Date | string
    updated_at?: DateTimeFilter<"Manga"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    arcs?: ArcListRelationFilter
    chapters?: ChapterListRelationFilter
    bookmarks?: BookmarkListRelationFilter
  }

  export type MangaOrderByWithRelationInput = {
    id?: SortOrder
    author_id?: SortOrder
    manga_title?: SortOrder
    manga_synopsis?: SortOrder
    cover_image_url?: SortOrderInput | SortOrder
    banner_image_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    author?: UserOrderByWithRelationInput
    arcs?: ArcOrderByRelationAggregateInput
    chapters?: ChapterOrderByRelationAggregateInput
    bookmarks?: BookmarkOrderByRelationAggregateInput
  }

  export type MangaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MangaWhereInput | MangaWhereInput[]
    OR?: MangaWhereInput[]
    NOT?: MangaWhereInput | MangaWhereInput[]
    author_id?: StringFilter<"Manga"> | string
    manga_title?: StringFilter<"Manga"> | string
    manga_synopsis?: StringFilter<"Manga"> | string
    cover_image_url?: StringNullableFilter<"Manga"> | string | null
    banner_image_url?: StringNullableFilter<"Manga"> | string | null
    created_at?: DateTimeFilter<"Manga"> | Date | string
    updated_at?: DateTimeFilter<"Manga"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    arcs?: ArcListRelationFilter
    chapters?: ChapterListRelationFilter
    bookmarks?: BookmarkListRelationFilter
  }, "id">

  export type MangaOrderByWithAggregationInput = {
    id?: SortOrder
    author_id?: SortOrder
    manga_title?: SortOrder
    manga_synopsis?: SortOrder
    cover_image_url?: SortOrderInput | SortOrder
    banner_image_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: MangaCountOrderByAggregateInput
    _max?: MangaMaxOrderByAggregateInput
    _min?: MangaMinOrderByAggregateInput
  }

  export type MangaScalarWhereWithAggregatesInput = {
    AND?: MangaScalarWhereWithAggregatesInput | MangaScalarWhereWithAggregatesInput[]
    OR?: MangaScalarWhereWithAggregatesInput[]
    NOT?: MangaScalarWhereWithAggregatesInput | MangaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Manga"> | string
    author_id?: StringWithAggregatesFilter<"Manga"> | string
    manga_title?: StringWithAggregatesFilter<"Manga"> | string
    manga_synopsis?: StringWithAggregatesFilter<"Manga"> | string
    cover_image_url?: StringNullableWithAggregatesFilter<"Manga"> | string | null
    banner_image_url?: StringNullableWithAggregatesFilter<"Manga"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Manga"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Manga"> | Date | string
  }

  export type ArcWhereInput = {
    AND?: ArcWhereInput | ArcWhereInput[]
    OR?: ArcWhereInput[]
    NOT?: ArcWhereInput | ArcWhereInput[]
    id?: StringFilter<"Arc"> | string
    manga_id?: StringFilter<"Arc"> | string
    arc_name?: StringFilter<"Arc"> | string
    arc_order?: IntFilter<"Arc"> | number
    arc_status?: EnumArcStatusFilter<"Arc"> | $Enums.ArcStatus
    arc_image_url?: StringNullableFilter<"Arc"> | string | null
    created_at?: DateTimeFilter<"Arc"> | Date | string
    manga?: XOR<MangaScalarRelationFilter, MangaWhereInput>
    chapters?: ChapterListRelationFilter
  }

  export type ArcOrderByWithRelationInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_name?: SortOrder
    arc_order?: SortOrder
    arc_status?: SortOrder
    arc_image_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    manga?: MangaOrderByWithRelationInput
    chapters?: ChapterOrderByRelationAggregateInput
  }

  export type ArcWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    manga_id_arc_order?: ArcManga_idArc_orderCompoundUniqueInput
    AND?: ArcWhereInput | ArcWhereInput[]
    OR?: ArcWhereInput[]
    NOT?: ArcWhereInput | ArcWhereInput[]
    manga_id?: StringFilter<"Arc"> | string
    arc_name?: StringFilter<"Arc"> | string
    arc_order?: IntFilter<"Arc"> | number
    arc_status?: EnumArcStatusFilter<"Arc"> | $Enums.ArcStatus
    arc_image_url?: StringNullableFilter<"Arc"> | string | null
    created_at?: DateTimeFilter<"Arc"> | Date | string
    manga?: XOR<MangaScalarRelationFilter, MangaWhereInput>
    chapters?: ChapterListRelationFilter
  }, "id" | "manga_id_arc_order">

  export type ArcOrderByWithAggregationInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_name?: SortOrder
    arc_order?: SortOrder
    arc_status?: SortOrder
    arc_image_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: ArcCountOrderByAggregateInput
    _avg?: ArcAvgOrderByAggregateInput
    _max?: ArcMaxOrderByAggregateInput
    _min?: ArcMinOrderByAggregateInput
    _sum?: ArcSumOrderByAggregateInput
  }

  export type ArcScalarWhereWithAggregatesInput = {
    AND?: ArcScalarWhereWithAggregatesInput | ArcScalarWhereWithAggregatesInput[]
    OR?: ArcScalarWhereWithAggregatesInput[]
    NOT?: ArcScalarWhereWithAggregatesInput | ArcScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Arc"> | string
    manga_id?: StringWithAggregatesFilter<"Arc"> | string
    arc_name?: StringWithAggregatesFilter<"Arc"> | string
    arc_order?: IntWithAggregatesFilter<"Arc"> | number
    arc_status?: EnumArcStatusWithAggregatesFilter<"Arc"> | $Enums.ArcStatus
    arc_image_url?: StringNullableWithAggregatesFilter<"Arc"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Arc"> | Date | string
  }

  export type ChapterWhereInput = {
    AND?: ChapterWhereInput | ChapterWhereInput[]
    OR?: ChapterWhereInput[]
    NOT?: ChapterWhereInput | ChapterWhereInput[]
    id?: StringFilter<"Chapter"> | string
    manga_id?: StringFilter<"Chapter"> | string
    arc_id?: StringNullableFilter<"Chapter"> | string | null
    chapter_number?: IntFilter<"Chapter"> | number
    chapter_name?: StringFilter<"Chapter"> | string
    cover_image_url?: StringNullableFilter<"Chapter"> | string | null
    published_date?: DateTimeFilter<"Chapter"> | Date | string
    view_count?: IntFilter<"Chapter"> | number
    comment_count?: IntFilter<"Chapter"> | number
    created_at?: DateTimeFilter<"Chapter"> | Date | string
    manga?: XOR<MangaScalarRelationFilter, MangaWhereInput>
    arc?: XOR<ArcNullableScalarRelationFilter, ArcWhereInput> | null
    translations?: TranslationListRelationFilter
    comments?: CommentListRelationFilter
    reading_progress?: ReadingProgressListRelationFilter
    chapter_bookmarks?: ChapterBookmarkListRelationFilter
  }

  export type ChapterOrderByWithRelationInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_id?: SortOrderInput | SortOrder
    chapter_number?: SortOrder
    chapter_name?: SortOrder
    cover_image_url?: SortOrderInput | SortOrder
    published_date?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
    created_at?: SortOrder
    manga?: MangaOrderByWithRelationInput
    arc?: ArcOrderByWithRelationInput
    translations?: TranslationOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
    reading_progress?: ReadingProgressOrderByRelationAggregateInput
    chapter_bookmarks?: ChapterBookmarkOrderByRelationAggregateInput
  }

  export type ChapterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    manga_id_chapter_number?: ChapterManga_idChapter_numberCompoundUniqueInput
    AND?: ChapterWhereInput | ChapterWhereInput[]
    OR?: ChapterWhereInput[]
    NOT?: ChapterWhereInput | ChapterWhereInput[]
    manga_id?: StringFilter<"Chapter"> | string
    arc_id?: StringNullableFilter<"Chapter"> | string | null
    chapter_number?: IntFilter<"Chapter"> | number
    chapter_name?: StringFilter<"Chapter"> | string
    cover_image_url?: StringNullableFilter<"Chapter"> | string | null
    published_date?: DateTimeFilter<"Chapter"> | Date | string
    view_count?: IntFilter<"Chapter"> | number
    comment_count?: IntFilter<"Chapter"> | number
    created_at?: DateTimeFilter<"Chapter"> | Date | string
    manga?: XOR<MangaScalarRelationFilter, MangaWhereInput>
    arc?: XOR<ArcNullableScalarRelationFilter, ArcWhereInput> | null
    translations?: TranslationListRelationFilter
    comments?: CommentListRelationFilter
    reading_progress?: ReadingProgressListRelationFilter
    chapter_bookmarks?: ChapterBookmarkListRelationFilter
  }, "id" | "manga_id_chapter_number">

  export type ChapterOrderByWithAggregationInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_id?: SortOrderInput | SortOrder
    chapter_number?: SortOrder
    chapter_name?: SortOrder
    cover_image_url?: SortOrderInput | SortOrder
    published_date?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
    created_at?: SortOrder
    _count?: ChapterCountOrderByAggregateInput
    _avg?: ChapterAvgOrderByAggregateInput
    _max?: ChapterMaxOrderByAggregateInput
    _min?: ChapterMinOrderByAggregateInput
    _sum?: ChapterSumOrderByAggregateInput
  }

  export type ChapterScalarWhereWithAggregatesInput = {
    AND?: ChapterScalarWhereWithAggregatesInput | ChapterScalarWhereWithAggregatesInput[]
    OR?: ChapterScalarWhereWithAggregatesInput[]
    NOT?: ChapterScalarWhereWithAggregatesInput | ChapterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Chapter"> | string
    manga_id?: StringWithAggregatesFilter<"Chapter"> | string
    arc_id?: StringNullableWithAggregatesFilter<"Chapter"> | string | null
    chapter_number?: IntWithAggregatesFilter<"Chapter"> | number
    chapter_name?: StringWithAggregatesFilter<"Chapter"> | string
    cover_image_url?: StringNullableWithAggregatesFilter<"Chapter"> | string | null
    published_date?: DateTimeWithAggregatesFilter<"Chapter"> | Date | string
    view_count?: IntWithAggregatesFilter<"Chapter"> | number
    comment_count?: IntWithAggregatesFilter<"Chapter"> | number
    created_at?: DateTimeWithAggregatesFilter<"Chapter"> | Date | string
  }

  export type TranslationWhereInput = {
    AND?: TranslationWhereInput | TranslationWhereInput[]
    OR?: TranslationWhereInput[]
    NOT?: TranslationWhereInput | TranslationWhereInput[]
    id?: StringFilter<"Translation"> | string
    chapter_id?: StringFilter<"Translation"> | string
    language?: EnumLanguageFilter<"Translation"> | $Enums.Language
    file_url?: StringFilter<"Translation"> | string
    translator_id?: StringNullableFilter<"Translation"> | string | null
    created_at?: DateTimeFilter<"Translation"> | Date | string
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
    translator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type TranslationOrderByWithRelationInput = {
    id?: SortOrder
    chapter_id?: SortOrder
    language?: SortOrder
    file_url?: SortOrder
    translator_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    chapter?: ChapterOrderByWithRelationInput
    translator?: UserOrderByWithRelationInput
  }

  export type TranslationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    chapter_id_language?: TranslationChapter_idLanguageCompoundUniqueInput
    AND?: TranslationWhereInput | TranslationWhereInput[]
    OR?: TranslationWhereInput[]
    NOT?: TranslationWhereInput | TranslationWhereInput[]
    chapter_id?: StringFilter<"Translation"> | string
    language?: EnumLanguageFilter<"Translation"> | $Enums.Language
    file_url?: StringFilter<"Translation"> | string
    translator_id?: StringNullableFilter<"Translation"> | string | null
    created_at?: DateTimeFilter<"Translation"> | Date | string
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
    translator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "chapter_id_language">

  export type TranslationOrderByWithAggregationInput = {
    id?: SortOrder
    chapter_id?: SortOrder
    language?: SortOrder
    file_url?: SortOrder
    translator_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: TranslationCountOrderByAggregateInput
    _max?: TranslationMaxOrderByAggregateInput
    _min?: TranslationMinOrderByAggregateInput
  }

  export type TranslationScalarWhereWithAggregatesInput = {
    AND?: TranslationScalarWhereWithAggregatesInput | TranslationScalarWhereWithAggregatesInput[]
    OR?: TranslationScalarWhereWithAggregatesInput[]
    NOT?: TranslationScalarWhereWithAggregatesInput | TranslationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Translation"> | string
    chapter_id?: StringWithAggregatesFilter<"Translation"> | string
    language?: EnumLanguageWithAggregatesFilter<"Translation"> | $Enums.Language
    file_url?: StringWithAggregatesFilter<"Translation"> | string
    translator_id?: StringNullableWithAggregatesFilter<"Translation"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Translation"> | Date | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    user_id?: StringFilter<"Comment"> | string
    chapter_id?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    hidden_at?: DateTimeNullableFilter<"Comment"> | Date | string | null
    created_at?: DateTimeFilter<"Comment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    body?: SortOrder
    hidden_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
    chapter?: ChapterOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    user_id?: StringFilter<"Comment"> | string
    chapter_id?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    hidden_at?: DateTimeNullableFilter<"Comment"> | Date | string | null
    created_at?: DateTimeFilter<"Comment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    body?: SortOrder
    hidden_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    user_id?: StringWithAggregatesFilter<"Comment"> | string
    chapter_id?: StringWithAggregatesFilter<"Comment"> | string
    body?: StringWithAggregatesFilter<"Comment"> | string
    hidden_at?: DateTimeNullableWithAggregatesFilter<"Comment"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
  }

  export type BookmarkWhereInput = {
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    id?: StringFilter<"Bookmark"> | string
    user_id?: StringFilter<"Bookmark"> | string
    manga_id?: StringFilter<"Bookmark"> | string
    created_at?: DateTimeFilter<"Bookmark"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    manga?: XOR<MangaScalarRelationFilter, MangaWhereInput>
  }

  export type BookmarkOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    manga_id?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
    manga?: MangaOrderByWithRelationInput
  }

  export type BookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_manga_id?: BookmarkUser_idManga_idCompoundUniqueInput
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    user_id?: StringFilter<"Bookmark"> | string
    manga_id?: StringFilter<"Bookmark"> | string
    created_at?: DateTimeFilter<"Bookmark"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    manga?: XOR<MangaScalarRelationFilter, MangaWhereInput>
  }, "id" | "user_id_manga_id">

  export type BookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    manga_id?: SortOrder
    created_at?: SortOrder
    _count?: BookmarkCountOrderByAggregateInput
    _max?: BookmarkMaxOrderByAggregateInput
    _min?: BookmarkMinOrderByAggregateInput
  }

  export type BookmarkScalarWhereWithAggregatesInput = {
    AND?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    OR?: BookmarkScalarWhereWithAggregatesInput[]
    NOT?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bookmark"> | string
    user_id?: StringWithAggregatesFilter<"Bookmark"> | string
    manga_id?: StringWithAggregatesFilter<"Bookmark"> | string
    created_at?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
  }

  export type ChapterBookmarkWhereInput = {
    AND?: ChapterBookmarkWhereInput | ChapterBookmarkWhereInput[]
    OR?: ChapterBookmarkWhereInput[]
    NOT?: ChapterBookmarkWhereInput | ChapterBookmarkWhereInput[]
    id?: StringFilter<"ChapterBookmark"> | string
    user_id?: StringFilter<"ChapterBookmark"> | string
    chapter_id?: StringFilter<"ChapterBookmark"> | string
    created_at?: DateTimeFilter<"ChapterBookmark"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
  }

  export type ChapterBookmarkOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
    chapter?: ChapterOrderByWithRelationInput
  }

  export type ChapterBookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_chapter_id?: ChapterBookmarkUser_idChapter_idCompoundUniqueInput
    AND?: ChapterBookmarkWhereInput | ChapterBookmarkWhereInput[]
    OR?: ChapterBookmarkWhereInput[]
    NOT?: ChapterBookmarkWhereInput | ChapterBookmarkWhereInput[]
    user_id?: StringFilter<"ChapterBookmark"> | string
    chapter_id?: StringFilter<"ChapterBookmark"> | string
    created_at?: DateTimeFilter<"ChapterBookmark"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
  }, "id" | "user_id_chapter_id">

  export type ChapterBookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    created_at?: SortOrder
    _count?: ChapterBookmarkCountOrderByAggregateInput
    _max?: ChapterBookmarkMaxOrderByAggregateInput
    _min?: ChapterBookmarkMinOrderByAggregateInput
  }

  export type ChapterBookmarkScalarWhereWithAggregatesInput = {
    AND?: ChapterBookmarkScalarWhereWithAggregatesInput | ChapterBookmarkScalarWhereWithAggregatesInput[]
    OR?: ChapterBookmarkScalarWhereWithAggregatesInput[]
    NOT?: ChapterBookmarkScalarWhereWithAggregatesInput | ChapterBookmarkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChapterBookmark"> | string
    user_id?: StringWithAggregatesFilter<"ChapterBookmark"> | string
    chapter_id?: StringWithAggregatesFilter<"ChapterBookmark"> | string
    created_at?: DateTimeWithAggregatesFilter<"ChapterBookmark"> | Date | string
  }

  export type ReadingProgressWhereInput = {
    AND?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    OR?: ReadingProgressWhereInput[]
    NOT?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    id?: StringFilter<"ReadingProgress"> | string
    user_id?: StringFilter<"ReadingProgress"> | string
    chapter_id?: StringFilter<"ReadingProgress"> | string
    last_page_read?: IntFilter<"ReadingProgress"> | number
    completed?: BoolFilter<"ReadingProgress"> | boolean
    updated_at?: DateTimeFilter<"ReadingProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
  }

  export type ReadingProgressOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    last_page_read?: SortOrder
    completed?: SortOrder
    updated_at?: SortOrder
    user?: UserOrderByWithRelationInput
    chapter?: ChapterOrderByWithRelationInput
  }

  export type ReadingProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_chapter_id?: ReadingProgressUser_idChapter_idCompoundUniqueInput
    AND?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    OR?: ReadingProgressWhereInput[]
    NOT?: ReadingProgressWhereInput | ReadingProgressWhereInput[]
    user_id?: StringFilter<"ReadingProgress"> | string
    chapter_id?: StringFilter<"ReadingProgress"> | string
    last_page_read?: IntFilter<"ReadingProgress"> | number
    completed?: BoolFilter<"ReadingProgress"> | boolean
    updated_at?: DateTimeFilter<"ReadingProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<ChapterScalarRelationFilter, ChapterWhereInput>
  }, "id" | "user_id_chapter_id">

  export type ReadingProgressOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    last_page_read?: SortOrder
    completed?: SortOrder
    updated_at?: SortOrder
    _count?: ReadingProgressCountOrderByAggregateInput
    _avg?: ReadingProgressAvgOrderByAggregateInput
    _max?: ReadingProgressMaxOrderByAggregateInput
    _min?: ReadingProgressMinOrderByAggregateInput
    _sum?: ReadingProgressSumOrderByAggregateInput
  }

  export type ReadingProgressScalarWhereWithAggregatesInput = {
    AND?: ReadingProgressScalarWhereWithAggregatesInput | ReadingProgressScalarWhereWithAggregatesInput[]
    OR?: ReadingProgressScalarWhereWithAggregatesInput[]
    NOT?: ReadingProgressScalarWhereWithAggregatesInput | ReadingProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReadingProgress"> | string
    user_id?: StringWithAggregatesFilter<"ReadingProgress"> | string
    chapter_id?: StringWithAggregatesFilter<"ReadingProgress"> | string
    last_page_read?: IntWithAggregatesFilter<"ReadingProgress"> | number
    completed?: BoolWithAggregatesFilter<"ReadingProgress"> | boolean
    updated_at?: DateTimeWithAggregatesFilter<"ReadingProgress"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    accountId: string
    providerId: string
    issuer: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    accountId: string
    providerId: string
    issuer: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    accountId: string
    providerId: string
    issuer: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MangaCreateInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    author: UserCreateNestedOneWithoutMangaInput
    arcs?: ArcCreateNestedManyWithoutMangaInput
    chapters?: ChapterCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkCreateNestedManyWithoutMangaInput
  }

  export type MangaUncheckedCreateInput = {
    id?: string
    author_id: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    arcs?: ArcUncheckedCreateNestedManyWithoutMangaInput
    chapters?: ChapterUncheckedCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutMangaInput
  }

  export type MangaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutMangaNestedInput
    arcs?: ArcUpdateManyWithoutMangaNestedInput
    chapters?: ChapterUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUpdateManyWithoutMangaNestedInput
  }

  export type MangaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    arcs?: ArcUncheckedUpdateManyWithoutMangaNestedInput
    chapters?: ChapterUncheckedUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutMangaNestedInput
  }

  export type MangaCreateManyInput = {
    id?: string
    author_id: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MangaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MangaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArcCreateInput = {
    id?: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutArcsInput
    chapters?: ChapterCreateNestedManyWithoutArcInput
  }

  export type ArcUncheckedCreateInput = {
    id?: string
    manga_id: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
    chapters?: ChapterUncheckedCreateNestedManyWithoutArcInput
  }

  export type ArcUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutArcsNestedInput
    chapters?: ChapterUpdateManyWithoutArcNestedInput
  }

  export type ArcUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUncheckedUpdateManyWithoutArcNestedInput
  }

  export type ArcCreateManyInput = {
    id?: string
    manga_id: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
  }

  export type ArcUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArcUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterCreateInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutChaptersInput
    arc?: ArcCreateNestedOneWithoutChaptersInput
    translations?: TranslationCreateNestedManyWithoutChapterInput
    comments?: CommentCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateInput = {
    id?: string
    manga_id: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    translations?: TranslationUncheckedCreateNestedManyWithoutChapterInput
    comments?: CommentUncheckedCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutChaptersNestedInput
    arc?: ArcUpdateOneWithoutChaptersNestedInput
    translations?: TranslationUpdateManyWithoutChapterNestedInput
    comments?: CommentUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translations?: TranslationUncheckedUpdateManyWithoutChapterNestedInput
    comments?: CommentUncheckedUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type ChapterCreateManyInput = {
    id?: string
    manga_id: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
  }

  export type ChapterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationCreateInput = {
    id?: string
    language: $Enums.Language
    file_url: string
    created_at?: Date | string
    chapter: ChapterCreateNestedOneWithoutTranslationsInput
    translator?: UserCreateNestedOneWithoutTranslationsInput
  }

  export type TranslationUncheckedCreateInput = {
    id?: string
    chapter_id: string
    language: $Enums.Language
    file_url: string
    translator_id?: string | null
    created_at?: Date | string
  }

  export type TranslationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapter?: ChapterUpdateOneRequiredWithoutTranslationsNestedInput
    translator?: UserUpdateOneWithoutTranslationsNestedInput
  }

  export type TranslationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    translator_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationCreateManyInput = {
    id?: string
    chapter_id: string
    language: $Enums.Language
    file_url: string
    translator_id?: string | null
    created_at?: Date | string
  }

  export type TranslationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    translator_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateInput = {
    id?: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
    chapter: ChapterCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    user_id: string
    chapter_id: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
    chapter?: ChapterUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyInput = {
    id?: string
    user_id: string
    chapter_id: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkCreateInput = {
    id?: string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutBookmarksInput
    manga: MangaCreateNestedOneWithoutBookmarksInput
  }

  export type BookmarkUncheckedCreateInput = {
    id?: string
    user_id: string
    manga_id: string
    created_at?: Date | string
  }

  export type BookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookmarksNestedInput
    manga?: MangaUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type BookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkCreateManyInput = {
    id?: string
    user_id: string
    manga_id: string
    created_at?: Date | string
  }

  export type BookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkCreateInput = {
    id?: string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutChapter_bookmarksInput
    chapter: ChapterCreateNestedOneWithoutChapter_bookmarksInput
  }

  export type ChapterBookmarkUncheckedCreateInput = {
    id?: string
    user_id: string
    chapter_id: string
    created_at?: Date | string
  }

  export type ChapterBookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChapter_bookmarksNestedInput
    chapter?: ChapterUpdateOneRequiredWithoutChapter_bookmarksNestedInput
  }

  export type ChapterBookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkCreateManyInput = {
    id?: string
    user_id: string
    chapter_id: string
    created_at?: Date | string
  }

  export type ChapterBookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressCreateInput = {
    id?: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutReading_progressInput
    chapter: ChapterCreateNestedOneWithoutReading_progressInput
  }

  export type ReadingProgressUncheckedCreateInput = {
    id?: string
    user_id: string
    chapter_id: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
  }

  export type ReadingProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReading_progressNestedInput
    chapter?: ChapterUpdateOneRequiredWithoutReading_progressNestedInput
  }

  export type ReadingProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressCreateManyInput = {
    id?: string
    user_id: string
    chapter_id: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
  }

  export type ReadingProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type MangaListRelationFilter = {
    every?: MangaWhereInput
    some?: MangaWhereInput
    none?: MangaWhereInput
  }

  export type TranslationListRelationFilter = {
    every?: TranslationWhereInput
    some?: TranslationWhereInput
    none?: TranslationWhereInput
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type BookmarkListRelationFilter = {
    every?: BookmarkWhereInput
    some?: BookmarkWhereInput
    none?: BookmarkWhereInput
  }

  export type ChapterBookmarkListRelationFilter = {
    every?: ChapterBookmarkWhereInput
    some?: ChapterBookmarkWhereInput
    none?: ChapterBookmarkWhereInput
  }

  export type ReadingProgressListRelationFilter = {
    every?: ReadingProgressWhereInput
    some?: ReadingProgressWhereInput
    none?: ReadingProgressWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MangaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TranslationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChapterBookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReadingProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    image?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    image?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    image?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountIssuerAccountIdCompoundUniqueInput = {
    issuer: string
    accountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    issuer?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    issuer?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    issuer?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArcListRelationFilter = {
    every?: ArcWhereInput
    some?: ArcWhereInput
    none?: ArcWhereInput
  }

  export type ChapterListRelationFilter = {
    every?: ChapterWhereInput
    some?: ChapterWhereInput
    none?: ChapterWhereInput
  }

  export type ArcOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChapterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MangaCountOrderByAggregateInput = {
    id?: SortOrder
    author_id?: SortOrder
    manga_title?: SortOrder
    manga_synopsis?: SortOrder
    cover_image_url?: SortOrder
    banner_image_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MangaMaxOrderByAggregateInput = {
    id?: SortOrder
    author_id?: SortOrder
    manga_title?: SortOrder
    manga_synopsis?: SortOrder
    cover_image_url?: SortOrder
    banner_image_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MangaMinOrderByAggregateInput = {
    id?: SortOrder
    author_id?: SortOrder
    manga_title?: SortOrder
    manga_synopsis?: SortOrder
    cover_image_url?: SortOrder
    banner_image_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumArcStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ArcStatus | EnumArcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArcStatusFilter<$PrismaModel> | $Enums.ArcStatus
  }

  export type MangaScalarRelationFilter = {
    is?: MangaWhereInput
    isNot?: MangaWhereInput
  }

  export type ArcManga_idArc_orderCompoundUniqueInput = {
    manga_id: string
    arc_order: number
  }

  export type ArcCountOrderByAggregateInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_name?: SortOrder
    arc_order?: SortOrder
    arc_status?: SortOrder
    arc_image_url?: SortOrder
    created_at?: SortOrder
  }

  export type ArcAvgOrderByAggregateInput = {
    arc_order?: SortOrder
  }

  export type ArcMaxOrderByAggregateInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_name?: SortOrder
    arc_order?: SortOrder
    arc_status?: SortOrder
    arc_image_url?: SortOrder
    created_at?: SortOrder
  }

  export type ArcMinOrderByAggregateInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_name?: SortOrder
    arc_order?: SortOrder
    arc_status?: SortOrder
    arc_image_url?: SortOrder
    created_at?: SortOrder
  }

  export type ArcSumOrderByAggregateInput = {
    arc_order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type EnumArcStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArcStatus | EnumArcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArcStatusWithAggregatesFilter<$PrismaModel> | $Enums.ArcStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArcStatusFilter<$PrismaModel>
    _max?: NestedEnumArcStatusFilter<$PrismaModel>
  }

  export type ArcNullableScalarRelationFilter = {
    is?: ArcWhereInput | null
    isNot?: ArcWhereInput | null
  }

  export type ChapterManga_idChapter_numberCompoundUniqueInput = {
    manga_id: string
    chapter_number: number
  }

  export type ChapterCountOrderByAggregateInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_id?: SortOrder
    chapter_number?: SortOrder
    chapter_name?: SortOrder
    cover_image_url?: SortOrder
    published_date?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
    created_at?: SortOrder
  }

  export type ChapterAvgOrderByAggregateInput = {
    chapter_number?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
  }

  export type ChapterMaxOrderByAggregateInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_id?: SortOrder
    chapter_number?: SortOrder
    chapter_name?: SortOrder
    cover_image_url?: SortOrder
    published_date?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
    created_at?: SortOrder
  }

  export type ChapterMinOrderByAggregateInput = {
    id?: SortOrder
    manga_id?: SortOrder
    arc_id?: SortOrder
    chapter_number?: SortOrder
    chapter_name?: SortOrder
    cover_image_url?: SortOrder
    published_date?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
    created_at?: SortOrder
  }

  export type ChapterSumOrderByAggregateInput = {
    chapter_number?: SortOrder
    view_count?: SortOrder
    comment_count?: SortOrder
  }

  export type EnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language
  }

  export type ChapterScalarRelationFilter = {
    is?: ChapterWhereInput
    isNot?: ChapterWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TranslationChapter_idLanguageCompoundUniqueInput = {
    chapter_id: string
    language: $Enums.Language
  }

  export type TranslationCountOrderByAggregateInput = {
    id?: SortOrder
    chapter_id?: SortOrder
    language?: SortOrder
    file_url?: SortOrder
    translator_id?: SortOrder
    created_at?: SortOrder
  }

  export type TranslationMaxOrderByAggregateInput = {
    id?: SortOrder
    chapter_id?: SortOrder
    language?: SortOrder
    file_url?: SortOrder
    translator_id?: SortOrder
    created_at?: SortOrder
  }

  export type TranslationMinOrderByAggregateInput = {
    id?: SortOrder
    chapter_id?: SortOrder
    language?: SortOrder
    file_url?: SortOrder
    translator_id?: SortOrder
    created_at?: SortOrder
  }

  export type EnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLanguageFilter<$PrismaModel>
    _max?: NestedEnumLanguageFilter<$PrismaModel>
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    body?: SortOrder
    hidden_at?: SortOrder
    created_at?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    body?: SortOrder
    hidden_at?: SortOrder
    created_at?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    body?: SortOrder
    hidden_at?: SortOrder
    created_at?: SortOrder
  }

  export type BookmarkUser_idManga_idCompoundUniqueInput = {
    user_id: string
    manga_id: string
  }

  export type BookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    manga_id?: SortOrder
    created_at?: SortOrder
  }

  export type BookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    manga_id?: SortOrder
    created_at?: SortOrder
  }

  export type BookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    manga_id?: SortOrder
    created_at?: SortOrder
  }

  export type ChapterBookmarkUser_idChapter_idCompoundUniqueInput = {
    user_id: string
    chapter_id: string
  }

  export type ChapterBookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    created_at?: SortOrder
  }

  export type ChapterBookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    created_at?: SortOrder
  }

  export type ChapterBookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    created_at?: SortOrder
  }

  export type ReadingProgressUser_idChapter_idCompoundUniqueInput = {
    user_id: string
    chapter_id: string
  }

  export type ReadingProgressCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    last_page_read?: SortOrder
    completed?: SortOrder
    updated_at?: SortOrder
  }

  export type ReadingProgressAvgOrderByAggregateInput = {
    last_page_read?: SortOrder
  }

  export type ReadingProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    last_page_read?: SortOrder
    completed?: SortOrder
    updated_at?: SortOrder
  }

  export type ReadingProgressMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    chapter_id?: SortOrder
    last_page_read?: SortOrder
    completed?: SortOrder
    updated_at?: SortOrder
  }

  export type ReadingProgressSumOrderByAggregateInput = {
    last_page_read?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type MangaCreateNestedManyWithoutAuthorInput = {
    create?: XOR<MangaCreateWithoutAuthorInput, MangaUncheckedCreateWithoutAuthorInput> | MangaCreateWithoutAuthorInput[] | MangaUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MangaCreateOrConnectWithoutAuthorInput | MangaCreateOrConnectWithoutAuthorInput[]
    createMany?: MangaCreateManyAuthorInputEnvelope
    connect?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
  }

  export type TranslationCreateNestedManyWithoutTranslatorInput = {
    create?: XOR<TranslationCreateWithoutTranslatorInput, TranslationUncheckedCreateWithoutTranslatorInput> | TranslationCreateWithoutTranslatorInput[] | TranslationUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutTranslatorInput | TranslationCreateOrConnectWithoutTranslatorInput[]
    createMany?: TranslationCreateManyTranslatorInputEnvelope
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type BookmarkCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type ChapterBookmarkCreateNestedManyWithoutUserInput = {
    create?: XOR<ChapterBookmarkCreateWithoutUserInput, ChapterBookmarkUncheckedCreateWithoutUserInput> | ChapterBookmarkCreateWithoutUserInput[] | ChapterBookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutUserInput | ChapterBookmarkCreateOrConnectWithoutUserInput[]
    createMany?: ChapterBookmarkCreateManyUserInputEnvelope
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
  }

  export type ReadingProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type MangaUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<MangaCreateWithoutAuthorInput, MangaUncheckedCreateWithoutAuthorInput> | MangaCreateWithoutAuthorInput[] | MangaUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MangaCreateOrConnectWithoutAuthorInput | MangaCreateOrConnectWithoutAuthorInput[]
    createMany?: MangaCreateManyAuthorInputEnvelope
    connect?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
  }

  export type TranslationUncheckedCreateNestedManyWithoutTranslatorInput = {
    create?: XOR<TranslationCreateWithoutTranslatorInput, TranslationUncheckedCreateWithoutTranslatorInput> | TranslationCreateWithoutTranslatorInput[] | TranslationUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutTranslatorInput | TranslationCreateOrConnectWithoutTranslatorInput[]
    createMany?: TranslationCreateManyTranslatorInputEnvelope
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChapterBookmarkCreateWithoutUserInput, ChapterBookmarkUncheckedCreateWithoutUserInput> | ChapterBookmarkCreateWithoutUserInput[] | ChapterBookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutUserInput | ChapterBookmarkCreateOrConnectWithoutUserInput[]
    createMany?: ChapterBookmarkCreateManyUserInputEnvelope
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
  }

  export type ReadingProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type MangaUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<MangaCreateWithoutAuthorInput, MangaUncheckedCreateWithoutAuthorInput> | MangaCreateWithoutAuthorInput[] | MangaUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MangaCreateOrConnectWithoutAuthorInput | MangaCreateOrConnectWithoutAuthorInput[]
    upsert?: MangaUpsertWithWhereUniqueWithoutAuthorInput | MangaUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: MangaCreateManyAuthorInputEnvelope
    set?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    disconnect?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    delete?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    connect?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    update?: MangaUpdateWithWhereUniqueWithoutAuthorInput | MangaUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: MangaUpdateManyWithWhereWithoutAuthorInput | MangaUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: MangaScalarWhereInput | MangaScalarWhereInput[]
  }

  export type TranslationUpdateManyWithoutTranslatorNestedInput = {
    create?: XOR<TranslationCreateWithoutTranslatorInput, TranslationUncheckedCreateWithoutTranslatorInput> | TranslationCreateWithoutTranslatorInput[] | TranslationUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutTranslatorInput | TranslationCreateOrConnectWithoutTranslatorInput[]
    upsert?: TranslationUpsertWithWhereUniqueWithoutTranslatorInput | TranslationUpsertWithWhereUniqueWithoutTranslatorInput[]
    createMany?: TranslationCreateManyTranslatorInputEnvelope
    set?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    disconnect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    delete?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    update?: TranslationUpdateWithWhereUniqueWithoutTranslatorInput | TranslationUpdateWithWhereUniqueWithoutTranslatorInput[]
    updateMany?: TranslationUpdateManyWithWhereWithoutTranslatorInput | TranslationUpdateManyWithWhereWithoutTranslatorInput[]
    deleteMany?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type BookmarkUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type ChapterBookmarkUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChapterBookmarkCreateWithoutUserInput, ChapterBookmarkUncheckedCreateWithoutUserInput> | ChapterBookmarkCreateWithoutUserInput[] | ChapterBookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutUserInput | ChapterBookmarkCreateOrConnectWithoutUserInput[]
    upsert?: ChapterBookmarkUpsertWithWhereUniqueWithoutUserInput | ChapterBookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChapterBookmarkCreateManyUserInputEnvelope
    set?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    disconnect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    delete?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    update?: ChapterBookmarkUpdateWithWhereUniqueWithoutUserInput | ChapterBookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChapterBookmarkUpdateManyWithWhereWithoutUserInput | ChapterBookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChapterBookmarkScalarWhereInput | ChapterBookmarkScalarWhereInput[]
  }

  export type ReadingProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutUserInput | ReadingProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutUserInput | ReadingProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutUserInput | ReadingProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type MangaUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<MangaCreateWithoutAuthorInput, MangaUncheckedCreateWithoutAuthorInput> | MangaCreateWithoutAuthorInput[] | MangaUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: MangaCreateOrConnectWithoutAuthorInput | MangaCreateOrConnectWithoutAuthorInput[]
    upsert?: MangaUpsertWithWhereUniqueWithoutAuthorInput | MangaUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: MangaCreateManyAuthorInputEnvelope
    set?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    disconnect?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    delete?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    connect?: MangaWhereUniqueInput | MangaWhereUniqueInput[]
    update?: MangaUpdateWithWhereUniqueWithoutAuthorInput | MangaUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: MangaUpdateManyWithWhereWithoutAuthorInput | MangaUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: MangaScalarWhereInput | MangaScalarWhereInput[]
  }

  export type TranslationUncheckedUpdateManyWithoutTranslatorNestedInput = {
    create?: XOR<TranslationCreateWithoutTranslatorInput, TranslationUncheckedCreateWithoutTranslatorInput> | TranslationCreateWithoutTranslatorInput[] | TranslationUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutTranslatorInput | TranslationCreateOrConnectWithoutTranslatorInput[]
    upsert?: TranslationUpsertWithWhereUniqueWithoutTranslatorInput | TranslationUpsertWithWhereUniqueWithoutTranslatorInput[]
    createMany?: TranslationCreateManyTranslatorInputEnvelope
    set?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    disconnect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    delete?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    update?: TranslationUpdateWithWhereUniqueWithoutTranslatorInput | TranslationUpdateWithWhereUniqueWithoutTranslatorInput[]
    updateMany?: TranslationUpdateManyWithWhereWithoutTranslatorInput | TranslationUpdateManyWithWhereWithoutTranslatorInput[]
    deleteMany?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChapterBookmarkCreateWithoutUserInput, ChapterBookmarkUncheckedCreateWithoutUserInput> | ChapterBookmarkCreateWithoutUserInput[] | ChapterBookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutUserInput | ChapterBookmarkCreateOrConnectWithoutUserInput[]
    upsert?: ChapterBookmarkUpsertWithWhereUniqueWithoutUserInput | ChapterBookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChapterBookmarkCreateManyUserInputEnvelope
    set?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    disconnect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    delete?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    update?: ChapterBookmarkUpdateWithWhereUniqueWithoutUserInput | ChapterBookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChapterBookmarkUpdateManyWithWhereWithoutUserInput | ChapterBookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChapterBookmarkScalarWhereInput | ChapterBookmarkScalarWhereInput[]
  }

  export type ReadingProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput> | ReadingProgressCreateWithoutUserInput[] | ReadingProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutUserInput | ReadingProgressCreateOrConnectWithoutUserInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutUserInput | ReadingProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingProgressCreateManyUserInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutUserInput | ReadingProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutUserInput | ReadingProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutMangaInput = {
    create?: XOR<UserCreateWithoutMangaInput, UserUncheckedCreateWithoutMangaInput>
    connectOrCreate?: UserCreateOrConnectWithoutMangaInput
    connect?: UserWhereUniqueInput
  }

  export type ArcCreateNestedManyWithoutMangaInput = {
    create?: XOR<ArcCreateWithoutMangaInput, ArcUncheckedCreateWithoutMangaInput> | ArcCreateWithoutMangaInput[] | ArcUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ArcCreateOrConnectWithoutMangaInput | ArcCreateOrConnectWithoutMangaInput[]
    createMany?: ArcCreateManyMangaInputEnvelope
    connect?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
  }

  export type ChapterCreateNestedManyWithoutMangaInput = {
    create?: XOR<ChapterCreateWithoutMangaInput, ChapterUncheckedCreateWithoutMangaInput> | ChapterCreateWithoutMangaInput[] | ChapterUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutMangaInput | ChapterCreateOrConnectWithoutMangaInput[]
    createMany?: ChapterCreateManyMangaInputEnvelope
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
  }

  export type BookmarkCreateNestedManyWithoutMangaInput = {
    create?: XOR<BookmarkCreateWithoutMangaInput, BookmarkUncheckedCreateWithoutMangaInput> | BookmarkCreateWithoutMangaInput[] | BookmarkUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMangaInput | BookmarkCreateOrConnectWithoutMangaInput[]
    createMany?: BookmarkCreateManyMangaInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type ArcUncheckedCreateNestedManyWithoutMangaInput = {
    create?: XOR<ArcCreateWithoutMangaInput, ArcUncheckedCreateWithoutMangaInput> | ArcCreateWithoutMangaInput[] | ArcUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ArcCreateOrConnectWithoutMangaInput | ArcCreateOrConnectWithoutMangaInput[]
    createMany?: ArcCreateManyMangaInputEnvelope
    connect?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
  }

  export type ChapterUncheckedCreateNestedManyWithoutMangaInput = {
    create?: XOR<ChapterCreateWithoutMangaInput, ChapterUncheckedCreateWithoutMangaInput> | ChapterCreateWithoutMangaInput[] | ChapterUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutMangaInput | ChapterCreateOrConnectWithoutMangaInput[]
    createMany?: ChapterCreateManyMangaInputEnvelope
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutMangaInput = {
    create?: XOR<BookmarkCreateWithoutMangaInput, BookmarkUncheckedCreateWithoutMangaInput> | BookmarkCreateWithoutMangaInput[] | BookmarkUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMangaInput | BookmarkCreateOrConnectWithoutMangaInput[]
    createMany?: BookmarkCreateManyMangaInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutMangaNestedInput = {
    create?: XOR<UserCreateWithoutMangaInput, UserUncheckedCreateWithoutMangaInput>
    connectOrCreate?: UserCreateOrConnectWithoutMangaInput
    upsert?: UserUpsertWithoutMangaInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMangaInput, UserUpdateWithoutMangaInput>, UserUncheckedUpdateWithoutMangaInput>
  }

  export type ArcUpdateManyWithoutMangaNestedInput = {
    create?: XOR<ArcCreateWithoutMangaInput, ArcUncheckedCreateWithoutMangaInput> | ArcCreateWithoutMangaInput[] | ArcUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ArcCreateOrConnectWithoutMangaInput | ArcCreateOrConnectWithoutMangaInput[]
    upsert?: ArcUpsertWithWhereUniqueWithoutMangaInput | ArcUpsertWithWhereUniqueWithoutMangaInput[]
    createMany?: ArcCreateManyMangaInputEnvelope
    set?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    disconnect?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    delete?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    connect?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    update?: ArcUpdateWithWhereUniqueWithoutMangaInput | ArcUpdateWithWhereUniqueWithoutMangaInput[]
    updateMany?: ArcUpdateManyWithWhereWithoutMangaInput | ArcUpdateManyWithWhereWithoutMangaInput[]
    deleteMany?: ArcScalarWhereInput | ArcScalarWhereInput[]
  }

  export type ChapterUpdateManyWithoutMangaNestedInput = {
    create?: XOR<ChapterCreateWithoutMangaInput, ChapterUncheckedCreateWithoutMangaInput> | ChapterCreateWithoutMangaInput[] | ChapterUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutMangaInput | ChapterCreateOrConnectWithoutMangaInput[]
    upsert?: ChapterUpsertWithWhereUniqueWithoutMangaInput | ChapterUpsertWithWhereUniqueWithoutMangaInput[]
    createMany?: ChapterCreateManyMangaInputEnvelope
    set?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    disconnect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    delete?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    update?: ChapterUpdateWithWhereUniqueWithoutMangaInput | ChapterUpdateWithWhereUniqueWithoutMangaInput[]
    updateMany?: ChapterUpdateManyWithWhereWithoutMangaInput | ChapterUpdateManyWithWhereWithoutMangaInput[]
    deleteMany?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
  }

  export type BookmarkUpdateManyWithoutMangaNestedInput = {
    create?: XOR<BookmarkCreateWithoutMangaInput, BookmarkUncheckedCreateWithoutMangaInput> | BookmarkCreateWithoutMangaInput[] | BookmarkUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMangaInput | BookmarkCreateOrConnectWithoutMangaInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutMangaInput | BookmarkUpsertWithWhereUniqueWithoutMangaInput[]
    createMany?: BookmarkCreateManyMangaInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutMangaInput | BookmarkUpdateWithWhereUniqueWithoutMangaInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutMangaInput | BookmarkUpdateManyWithWhereWithoutMangaInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type ArcUncheckedUpdateManyWithoutMangaNestedInput = {
    create?: XOR<ArcCreateWithoutMangaInput, ArcUncheckedCreateWithoutMangaInput> | ArcCreateWithoutMangaInput[] | ArcUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ArcCreateOrConnectWithoutMangaInput | ArcCreateOrConnectWithoutMangaInput[]
    upsert?: ArcUpsertWithWhereUniqueWithoutMangaInput | ArcUpsertWithWhereUniqueWithoutMangaInput[]
    createMany?: ArcCreateManyMangaInputEnvelope
    set?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    disconnect?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    delete?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    connect?: ArcWhereUniqueInput | ArcWhereUniqueInput[]
    update?: ArcUpdateWithWhereUniqueWithoutMangaInput | ArcUpdateWithWhereUniqueWithoutMangaInput[]
    updateMany?: ArcUpdateManyWithWhereWithoutMangaInput | ArcUpdateManyWithWhereWithoutMangaInput[]
    deleteMany?: ArcScalarWhereInput | ArcScalarWhereInput[]
  }

  export type ChapterUncheckedUpdateManyWithoutMangaNestedInput = {
    create?: XOR<ChapterCreateWithoutMangaInput, ChapterUncheckedCreateWithoutMangaInput> | ChapterCreateWithoutMangaInput[] | ChapterUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutMangaInput | ChapterCreateOrConnectWithoutMangaInput[]
    upsert?: ChapterUpsertWithWhereUniqueWithoutMangaInput | ChapterUpsertWithWhereUniqueWithoutMangaInput[]
    createMany?: ChapterCreateManyMangaInputEnvelope
    set?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    disconnect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    delete?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    update?: ChapterUpdateWithWhereUniqueWithoutMangaInput | ChapterUpdateWithWhereUniqueWithoutMangaInput[]
    updateMany?: ChapterUpdateManyWithWhereWithoutMangaInput | ChapterUpdateManyWithWhereWithoutMangaInput[]
    deleteMany?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutMangaNestedInput = {
    create?: XOR<BookmarkCreateWithoutMangaInput, BookmarkUncheckedCreateWithoutMangaInput> | BookmarkCreateWithoutMangaInput[] | BookmarkUncheckedCreateWithoutMangaInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutMangaInput | BookmarkCreateOrConnectWithoutMangaInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutMangaInput | BookmarkUpsertWithWhereUniqueWithoutMangaInput[]
    createMany?: BookmarkCreateManyMangaInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutMangaInput | BookmarkUpdateWithWhereUniqueWithoutMangaInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutMangaInput | BookmarkUpdateManyWithWhereWithoutMangaInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type MangaCreateNestedOneWithoutArcsInput = {
    create?: XOR<MangaCreateWithoutArcsInput, MangaUncheckedCreateWithoutArcsInput>
    connectOrCreate?: MangaCreateOrConnectWithoutArcsInput
    connect?: MangaWhereUniqueInput
  }

  export type ChapterCreateNestedManyWithoutArcInput = {
    create?: XOR<ChapterCreateWithoutArcInput, ChapterUncheckedCreateWithoutArcInput> | ChapterCreateWithoutArcInput[] | ChapterUncheckedCreateWithoutArcInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutArcInput | ChapterCreateOrConnectWithoutArcInput[]
    createMany?: ChapterCreateManyArcInputEnvelope
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
  }

  export type ChapterUncheckedCreateNestedManyWithoutArcInput = {
    create?: XOR<ChapterCreateWithoutArcInput, ChapterUncheckedCreateWithoutArcInput> | ChapterCreateWithoutArcInput[] | ChapterUncheckedCreateWithoutArcInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutArcInput | ChapterCreateOrConnectWithoutArcInput[]
    createMany?: ChapterCreateManyArcInputEnvelope
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumArcStatusFieldUpdateOperationsInput = {
    set?: $Enums.ArcStatus
  }

  export type MangaUpdateOneRequiredWithoutArcsNestedInput = {
    create?: XOR<MangaCreateWithoutArcsInput, MangaUncheckedCreateWithoutArcsInput>
    connectOrCreate?: MangaCreateOrConnectWithoutArcsInput
    upsert?: MangaUpsertWithoutArcsInput
    connect?: MangaWhereUniqueInput
    update?: XOR<XOR<MangaUpdateToOneWithWhereWithoutArcsInput, MangaUpdateWithoutArcsInput>, MangaUncheckedUpdateWithoutArcsInput>
  }

  export type ChapterUpdateManyWithoutArcNestedInput = {
    create?: XOR<ChapterCreateWithoutArcInput, ChapterUncheckedCreateWithoutArcInput> | ChapterCreateWithoutArcInput[] | ChapterUncheckedCreateWithoutArcInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutArcInput | ChapterCreateOrConnectWithoutArcInput[]
    upsert?: ChapterUpsertWithWhereUniqueWithoutArcInput | ChapterUpsertWithWhereUniqueWithoutArcInput[]
    createMany?: ChapterCreateManyArcInputEnvelope
    set?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    disconnect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    delete?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    update?: ChapterUpdateWithWhereUniqueWithoutArcInput | ChapterUpdateWithWhereUniqueWithoutArcInput[]
    updateMany?: ChapterUpdateManyWithWhereWithoutArcInput | ChapterUpdateManyWithWhereWithoutArcInput[]
    deleteMany?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
  }

  export type ChapterUncheckedUpdateManyWithoutArcNestedInput = {
    create?: XOR<ChapterCreateWithoutArcInput, ChapterUncheckedCreateWithoutArcInput> | ChapterCreateWithoutArcInput[] | ChapterUncheckedCreateWithoutArcInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutArcInput | ChapterCreateOrConnectWithoutArcInput[]
    upsert?: ChapterUpsertWithWhereUniqueWithoutArcInput | ChapterUpsertWithWhereUniqueWithoutArcInput[]
    createMany?: ChapterCreateManyArcInputEnvelope
    set?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    disconnect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    delete?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    update?: ChapterUpdateWithWhereUniqueWithoutArcInput | ChapterUpdateWithWhereUniqueWithoutArcInput[]
    updateMany?: ChapterUpdateManyWithWhereWithoutArcInput | ChapterUpdateManyWithWhereWithoutArcInput[]
    deleteMany?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
  }

  export type MangaCreateNestedOneWithoutChaptersInput = {
    create?: XOR<MangaCreateWithoutChaptersInput, MangaUncheckedCreateWithoutChaptersInput>
    connectOrCreate?: MangaCreateOrConnectWithoutChaptersInput
    connect?: MangaWhereUniqueInput
  }

  export type ArcCreateNestedOneWithoutChaptersInput = {
    create?: XOR<ArcCreateWithoutChaptersInput, ArcUncheckedCreateWithoutChaptersInput>
    connectOrCreate?: ArcCreateOrConnectWithoutChaptersInput
    connect?: ArcWhereUniqueInput
  }

  export type TranslationCreateNestedManyWithoutChapterInput = {
    create?: XOR<TranslationCreateWithoutChapterInput, TranslationUncheckedCreateWithoutChapterInput> | TranslationCreateWithoutChapterInput[] | TranslationUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutChapterInput | TranslationCreateOrConnectWithoutChapterInput[]
    createMany?: TranslationCreateManyChapterInputEnvelope
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutChapterInput = {
    create?: XOR<CommentCreateWithoutChapterInput, CommentUncheckedCreateWithoutChapterInput> | CommentCreateWithoutChapterInput[] | CommentUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutChapterInput | CommentCreateOrConnectWithoutChapterInput[]
    createMany?: CommentCreateManyChapterInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type ReadingProgressCreateNestedManyWithoutChapterInput = {
    create?: XOR<ReadingProgressCreateWithoutChapterInput, ReadingProgressUncheckedCreateWithoutChapterInput> | ReadingProgressCreateWithoutChapterInput[] | ReadingProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutChapterInput | ReadingProgressCreateOrConnectWithoutChapterInput[]
    createMany?: ReadingProgressCreateManyChapterInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type ChapterBookmarkCreateNestedManyWithoutChapterInput = {
    create?: XOR<ChapterBookmarkCreateWithoutChapterInput, ChapterBookmarkUncheckedCreateWithoutChapterInput> | ChapterBookmarkCreateWithoutChapterInput[] | ChapterBookmarkUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutChapterInput | ChapterBookmarkCreateOrConnectWithoutChapterInput[]
    createMany?: ChapterBookmarkCreateManyChapterInputEnvelope
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
  }

  export type TranslationUncheckedCreateNestedManyWithoutChapterInput = {
    create?: XOR<TranslationCreateWithoutChapterInput, TranslationUncheckedCreateWithoutChapterInput> | TranslationCreateWithoutChapterInput[] | TranslationUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutChapterInput | TranslationCreateOrConnectWithoutChapterInput[]
    createMany?: TranslationCreateManyChapterInputEnvelope
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutChapterInput = {
    create?: XOR<CommentCreateWithoutChapterInput, CommentUncheckedCreateWithoutChapterInput> | CommentCreateWithoutChapterInput[] | CommentUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutChapterInput | CommentCreateOrConnectWithoutChapterInput[]
    createMany?: CommentCreateManyChapterInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type ReadingProgressUncheckedCreateNestedManyWithoutChapterInput = {
    create?: XOR<ReadingProgressCreateWithoutChapterInput, ReadingProgressUncheckedCreateWithoutChapterInput> | ReadingProgressCreateWithoutChapterInput[] | ReadingProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutChapterInput | ReadingProgressCreateOrConnectWithoutChapterInput[]
    createMany?: ReadingProgressCreateManyChapterInputEnvelope
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
  }

  export type ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput = {
    create?: XOR<ChapterBookmarkCreateWithoutChapterInput, ChapterBookmarkUncheckedCreateWithoutChapterInput> | ChapterBookmarkCreateWithoutChapterInput[] | ChapterBookmarkUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutChapterInput | ChapterBookmarkCreateOrConnectWithoutChapterInput[]
    createMany?: ChapterBookmarkCreateManyChapterInputEnvelope
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
  }

  export type MangaUpdateOneRequiredWithoutChaptersNestedInput = {
    create?: XOR<MangaCreateWithoutChaptersInput, MangaUncheckedCreateWithoutChaptersInput>
    connectOrCreate?: MangaCreateOrConnectWithoutChaptersInput
    upsert?: MangaUpsertWithoutChaptersInput
    connect?: MangaWhereUniqueInput
    update?: XOR<XOR<MangaUpdateToOneWithWhereWithoutChaptersInput, MangaUpdateWithoutChaptersInput>, MangaUncheckedUpdateWithoutChaptersInput>
  }

  export type ArcUpdateOneWithoutChaptersNestedInput = {
    create?: XOR<ArcCreateWithoutChaptersInput, ArcUncheckedCreateWithoutChaptersInput>
    connectOrCreate?: ArcCreateOrConnectWithoutChaptersInput
    upsert?: ArcUpsertWithoutChaptersInput
    disconnect?: ArcWhereInput | boolean
    delete?: ArcWhereInput | boolean
    connect?: ArcWhereUniqueInput
    update?: XOR<XOR<ArcUpdateToOneWithWhereWithoutChaptersInput, ArcUpdateWithoutChaptersInput>, ArcUncheckedUpdateWithoutChaptersInput>
  }

  export type TranslationUpdateManyWithoutChapterNestedInput = {
    create?: XOR<TranslationCreateWithoutChapterInput, TranslationUncheckedCreateWithoutChapterInput> | TranslationCreateWithoutChapterInput[] | TranslationUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutChapterInput | TranslationCreateOrConnectWithoutChapterInput[]
    upsert?: TranslationUpsertWithWhereUniqueWithoutChapterInput | TranslationUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: TranslationCreateManyChapterInputEnvelope
    set?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    disconnect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    delete?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    update?: TranslationUpdateWithWhereUniqueWithoutChapterInput | TranslationUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: TranslationUpdateManyWithWhereWithoutChapterInput | TranslationUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutChapterNestedInput = {
    create?: XOR<CommentCreateWithoutChapterInput, CommentUncheckedCreateWithoutChapterInput> | CommentCreateWithoutChapterInput[] | CommentUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutChapterInput | CommentCreateOrConnectWithoutChapterInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutChapterInput | CommentUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: CommentCreateManyChapterInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutChapterInput | CommentUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutChapterInput | CommentUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type ReadingProgressUpdateManyWithoutChapterNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutChapterInput, ReadingProgressUncheckedCreateWithoutChapterInput> | ReadingProgressCreateWithoutChapterInput[] | ReadingProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutChapterInput | ReadingProgressCreateOrConnectWithoutChapterInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutChapterInput | ReadingProgressUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: ReadingProgressCreateManyChapterInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutChapterInput | ReadingProgressUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutChapterInput | ReadingProgressUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type ChapterBookmarkUpdateManyWithoutChapterNestedInput = {
    create?: XOR<ChapterBookmarkCreateWithoutChapterInput, ChapterBookmarkUncheckedCreateWithoutChapterInput> | ChapterBookmarkCreateWithoutChapterInput[] | ChapterBookmarkUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutChapterInput | ChapterBookmarkCreateOrConnectWithoutChapterInput[]
    upsert?: ChapterBookmarkUpsertWithWhereUniqueWithoutChapterInput | ChapterBookmarkUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: ChapterBookmarkCreateManyChapterInputEnvelope
    set?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    disconnect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    delete?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    update?: ChapterBookmarkUpdateWithWhereUniqueWithoutChapterInput | ChapterBookmarkUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: ChapterBookmarkUpdateManyWithWhereWithoutChapterInput | ChapterBookmarkUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: ChapterBookmarkScalarWhereInput | ChapterBookmarkScalarWhereInput[]
  }

  export type TranslationUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: XOR<TranslationCreateWithoutChapterInput, TranslationUncheckedCreateWithoutChapterInput> | TranslationCreateWithoutChapterInput[] | TranslationUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutChapterInput | TranslationCreateOrConnectWithoutChapterInput[]
    upsert?: TranslationUpsertWithWhereUniqueWithoutChapterInput | TranslationUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: TranslationCreateManyChapterInputEnvelope
    set?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    disconnect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    delete?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    update?: TranslationUpdateWithWhereUniqueWithoutChapterInput | TranslationUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: TranslationUpdateManyWithWhereWithoutChapterInput | TranslationUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: XOR<CommentCreateWithoutChapterInput, CommentUncheckedCreateWithoutChapterInput> | CommentCreateWithoutChapterInput[] | CommentUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutChapterInput | CommentCreateOrConnectWithoutChapterInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutChapterInput | CommentUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: CommentCreateManyChapterInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutChapterInput | CommentUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutChapterInput | CommentUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: XOR<ReadingProgressCreateWithoutChapterInput, ReadingProgressUncheckedCreateWithoutChapterInput> | ReadingProgressCreateWithoutChapterInput[] | ReadingProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ReadingProgressCreateOrConnectWithoutChapterInput | ReadingProgressCreateOrConnectWithoutChapterInput[]
    upsert?: ReadingProgressUpsertWithWhereUniqueWithoutChapterInput | ReadingProgressUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: ReadingProgressCreateManyChapterInputEnvelope
    set?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    disconnect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    delete?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    connect?: ReadingProgressWhereUniqueInput | ReadingProgressWhereUniqueInput[]
    update?: ReadingProgressUpdateWithWhereUniqueWithoutChapterInput | ReadingProgressUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: ReadingProgressUpdateManyWithWhereWithoutChapterInput | ReadingProgressUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
  }

  export type ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: XOR<ChapterBookmarkCreateWithoutChapterInput, ChapterBookmarkUncheckedCreateWithoutChapterInput> | ChapterBookmarkCreateWithoutChapterInput[] | ChapterBookmarkUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: ChapterBookmarkCreateOrConnectWithoutChapterInput | ChapterBookmarkCreateOrConnectWithoutChapterInput[]
    upsert?: ChapterBookmarkUpsertWithWhereUniqueWithoutChapterInput | ChapterBookmarkUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: ChapterBookmarkCreateManyChapterInputEnvelope
    set?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    disconnect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    delete?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    connect?: ChapterBookmarkWhereUniqueInput | ChapterBookmarkWhereUniqueInput[]
    update?: ChapterBookmarkUpdateWithWhereUniqueWithoutChapterInput | ChapterBookmarkUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: ChapterBookmarkUpdateManyWithWhereWithoutChapterInput | ChapterBookmarkUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: ChapterBookmarkScalarWhereInput | ChapterBookmarkScalarWhereInput[]
  }

  export type ChapterCreateNestedOneWithoutTranslationsInput = {
    create?: XOR<ChapterCreateWithoutTranslationsInput, ChapterUncheckedCreateWithoutTranslationsInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutTranslationsInput
    connect?: ChapterWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTranslationsInput = {
    create?: XOR<UserCreateWithoutTranslationsInput, UserUncheckedCreateWithoutTranslationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTranslationsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumLanguageFieldUpdateOperationsInput = {
    set?: $Enums.Language
  }

  export type ChapterUpdateOneRequiredWithoutTranslationsNestedInput = {
    create?: XOR<ChapterCreateWithoutTranslationsInput, ChapterUncheckedCreateWithoutTranslationsInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutTranslationsInput
    upsert?: ChapterUpsertWithoutTranslationsInput
    connect?: ChapterWhereUniqueInput
    update?: XOR<XOR<ChapterUpdateToOneWithWhereWithoutTranslationsInput, ChapterUpdateWithoutTranslationsInput>, ChapterUncheckedUpdateWithoutTranslationsInput>
  }

  export type UserUpdateOneWithoutTranslationsNestedInput = {
    create?: XOR<UserCreateWithoutTranslationsInput, UserUncheckedCreateWithoutTranslationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTranslationsInput
    upsert?: UserUpsertWithoutTranslationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTranslationsInput, UserUpdateWithoutTranslationsInput>, UserUncheckedUpdateWithoutTranslationsInput>
  }

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    connect?: UserWhereUniqueInput
  }

  export type ChapterCreateNestedOneWithoutCommentsInput = {
    create?: XOR<ChapterCreateWithoutCommentsInput, ChapterUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutCommentsInput
    connect?: ChapterWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    upsert?: UserUpsertWithoutCommentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type ChapterUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<ChapterCreateWithoutCommentsInput, ChapterUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutCommentsInput
    upsert?: ChapterUpsertWithoutCommentsInput
    connect?: ChapterWhereUniqueInput
    update?: XOR<XOR<ChapterUpdateToOneWithWhereWithoutCommentsInput, ChapterUpdateWithoutCommentsInput>, ChapterUncheckedUpdateWithoutCommentsInput>
  }

  export type UserCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarksInput
    connect?: UserWhereUniqueInput
  }

  export type MangaCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<MangaCreateWithoutBookmarksInput, MangaUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: MangaCreateOrConnectWithoutBookmarksInput
    connect?: MangaWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarksInput
    upsert?: UserUpsertWithoutBookmarksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookmarksInput, UserUpdateWithoutBookmarksInput>, UserUncheckedUpdateWithoutBookmarksInput>
  }

  export type MangaUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<MangaCreateWithoutBookmarksInput, MangaUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: MangaCreateOrConnectWithoutBookmarksInput
    upsert?: MangaUpsertWithoutBookmarksInput
    connect?: MangaWhereUniqueInput
    update?: XOR<XOR<MangaUpdateToOneWithWhereWithoutBookmarksInput, MangaUpdateWithoutBookmarksInput>, MangaUncheckedUpdateWithoutBookmarksInput>
  }

  export type UserCreateNestedOneWithoutChapter_bookmarksInput = {
    create?: XOR<UserCreateWithoutChapter_bookmarksInput, UserUncheckedCreateWithoutChapter_bookmarksInput>
    connectOrCreate?: UserCreateOrConnectWithoutChapter_bookmarksInput
    connect?: UserWhereUniqueInput
  }

  export type ChapterCreateNestedOneWithoutChapter_bookmarksInput = {
    create?: XOR<ChapterCreateWithoutChapter_bookmarksInput, ChapterUncheckedCreateWithoutChapter_bookmarksInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutChapter_bookmarksInput
    connect?: ChapterWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutChapter_bookmarksNestedInput = {
    create?: XOR<UserCreateWithoutChapter_bookmarksInput, UserUncheckedCreateWithoutChapter_bookmarksInput>
    connectOrCreate?: UserCreateOrConnectWithoutChapter_bookmarksInput
    upsert?: UserUpsertWithoutChapter_bookmarksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChapter_bookmarksInput, UserUpdateWithoutChapter_bookmarksInput>, UserUncheckedUpdateWithoutChapter_bookmarksInput>
  }

  export type ChapterUpdateOneRequiredWithoutChapter_bookmarksNestedInput = {
    create?: XOR<ChapterCreateWithoutChapter_bookmarksInput, ChapterUncheckedCreateWithoutChapter_bookmarksInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutChapter_bookmarksInput
    upsert?: ChapterUpsertWithoutChapter_bookmarksInput
    connect?: ChapterWhereUniqueInput
    update?: XOR<XOR<ChapterUpdateToOneWithWhereWithoutChapter_bookmarksInput, ChapterUpdateWithoutChapter_bookmarksInput>, ChapterUncheckedUpdateWithoutChapter_bookmarksInput>
  }

  export type UserCreateNestedOneWithoutReading_progressInput = {
    create?: XOR<UserCreateWithoutReading_progressInput, UserUncheckedCreateWithoutReading_progressInput>
    connectOrCreate?: UserCreateOrConnectWithoutReading_progressInput
    connect?: UserWhereUniqueInput
  }

  export type ChapterCreateNestedOneWithoutReading_progressInput = {
    create?: XOR<ChapterCreateWithoutReading_progressInput, ChapterUncheckedCreateWithoutReading_progressInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutReading_progressInput
    connect?: ChapterWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutReading_progressNestedInput = {
    create?: XOR<UserCreateWithoutReading_progressInput, UserUncheckedCreateWithoutReading_progressInput>
    connectOrCreate?: UserCreateOrConnectWithoutReading_progressInput
    upsert?: UserUpsertWithoutReading_progressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReading_progressInput, UserUpdateWithoutReading_progressInput>, UserUncheckedUpdateWithoutReading_progressInput>
  }

  export type ChapterUpdateOneRequiredWithoutReading_progressNestedInput = {
    create?: XOR<ChapterCreateWithoutReading_progressInput, ChapterUncheckedCreateWithoutReading_progressInput>
    connectOrCreate?: ChapterCreateOrConnectWithoutReading_progressInput
    upsert?: ChapterUpsertWithoutReading_progressInput
    connect?: ChapterWhereUniqueInput
    update?: XOR<XOR<ChapterUpdateToOneWithWhereWithoutReading_progressInput, ChapterUpdateWithoutReading_progressInput>, ChapterUncheckedUpdateWithoutReading_progressInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumArcStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ArcStatus | EnumArcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArcStatusFilter<$PrismaModel> | $Enums.ArcStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumArcStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArcStatus | EnumArcStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArcStatus[] | ListEnumArcStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArcStatusWithAggregatesFilter<$PrismaModel> | $Enums.ArcStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArcStatusFilter<$PrismaModel>
    _max?: NestedEnumArcStatusFilter<$PrismaModel>
  }

  export type NestedEnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language
  }

  export type NestedEnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLanguageFilter<$PrismaModel>
    _max?: NestedEnumLanguageFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    issuer: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    issuer: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MangaCreateWithoutAuthorInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    arcs?: ArcCreateNestedManyWithoutMangaInput
    chapters?: ChapterCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkCreateNestedManyWithoutMangaInput
  }

  export type MangaUncheckedCreateWithoutAuthorInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    arcs?: ArcUncheckedCreateNestedManyWithoutMangaInput
    chapters?: ChapterUncheckedCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutMangaInput
  }

  export type MangaCreateOrConnectWithoutAuthorInput = {
    where: MangaWhereUniqueInput
    create: XOR<MangaCreateWithoutAuthorInput, MangaUncheckedCreateWithoutAuthorInput>
  }

  export type MangaCreateManyAuthorInputEnvelope = {
    data: MangaCreateManyAuthorInput | MangaCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type TranslationCreateWithoutTranslatorInput = {
    id?: string
    language: $Enums.Language
    file_url: string
    created_at?: Date | string
    chapter: ChapterCreateNestedOneWithoutTranslationsInput
  }

  export type TranslationUncheckedCreateWithoutTranslatorInput = {
    id?: string
    chapter_id: string
    language: $Enums.Language
    file_url: string
    created_at?: Date | string
  }

  export type TranslationCreateOrConnectWithoutTranslatorInput = {
    where: TranslationWhereUniqueInput
    create: XOR<TranslationCreateWithoutTranslatorInput, TranslationUncheckedCreateWithoutTranslatorInput>
  }

  export type TranslationCreateManyTranslatorInputEnvelope = {
    data: TranslationCreateManyTranslatorInput | TranslationCreateManyTranslatorInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutUserInput = {
    id?: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
    chapter: ChapterCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: string
    chapter_id: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
  }

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutBookmarksInput
  }

  export type BookmarkUncheckedCreateWithoutUserInput = {
    id?: string
    manga_id: string
    created_at?: Date | string
  }

  export type BookmarkCreateOrConnectWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkCreateManyUserInputEnvelope = {
    data: BookmarkCreateManyUserInput | BookmarkCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChapterBookmarkCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string
    chapter: ChapterCreateNestedOneWithoutChapter_bookmarksInput
  }

  export type ChapterBookmarkUncheckedCreateWithoutUserInput = {
    id?: string
    chapter_id: string
    created_at?: Date | string
  }

  export type ChapterBookmarkCreateOrConnectWithoutUserInput = {
    where: ChapterBookmarkWhereUniqueInput
    create: XOR<ChapterBookmarkCreateWithoutUserInput, ChapterBookmarkUncheckedCreateWithoutUserInput>
  }

  export type ChapterBookmarkCreateManyUserInputEnvelope = {
    data: ChapterBookmarkCreateManyUserInput | ChapterBookmarkCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReadingProgressCreateWithoutUserInput = {
    id?: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
    chapter: ChapterCreateNestedOneWithoutReading_progressInput
  }

  export type ReadingProgressUncheckedCreateWithoutUserInput = {
    id?: string
    chapter_id: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
  }

  export type ReadingProgressCreateOrConnectWithoutUserInput = {
    where: ReadingProgressWhereUniqueInput
    create: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput>
  }

  export type ReadingProgressCreateManyUserInputEnvelope = {
    data: ReadingProgressCreateManyUserInput | ReadingProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    issuer?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type MangaUpsertWithWhereUniqueWithoutAuthorInput = {
    where: MangaWhereUniqueInput
    update: XOR<MangaUpdateWithoutAuthorInput, MangaUncheckedUpdateWithoutAuthorInput>
    create: XOR<MangaCreateWithoutAuthorInput, MangaUncheckedCreateWithoutAuthorInput>
  }

  export type MangaUpdateWithWhereUniqueWithoutAuthorInput = {
    where: MangaWhereUniqueInput
    data: XOR<MangaUpdateWithoutAuthorInput, MangaUncheckedUpdateWithoutAuthorInput>
  }

  export type MangaUpdateManyWithWhereWithoutAuthorInput = {
    where: MangaScalarWhereInput
    data: XOR<MangaUpdateManyMutationInput, MangaUncheckedUpdateManyWithoutAuthorInput>
  }

  export type MangaScalarWhereInput = {
    AND?: MangaScalarWhereInput | MangaScalarWhereInput[]
    OR?: MangaScalarWhereInput[]
    NOT?: MangaScalarWhereInput | MangaScalarWhereInput[]
    id?: StringFilter<"Manga"> | string
    author_id?: StringFilter<"Manga"> | string
    manga_title?: StringFilter<"Manga"> | string
    manga_synopsis?: StringFilter<"Manga"> | string
    cover_image_url?: StringNullableFilter<"Manga"> | string | null
    banner_image_url?: StringNullableFilter<"Manga"> | string | null
    created_at?: DateTimeFilter<"Manga"> | Date | string
    updated_at?: DateTimeFilter<"Manga"> | Date | string
  }

  export type TranslationUpsertWithWhereUniqueWithoutTranslatorInput = {
    where: TranslationWhereUniqueInput
    update: XOR<TranslationUpdateWithoutTranslatorInput, TranslationUncheckedUpdateWithoutTranslatorInput>
    create: XOR<TranslationCreateWithoutTranslatorInput, TranslationUncheckedCreateWithoutTranslatorInput>
  }

  export type TranslationUpdateWithWhereUniqueWithoutTranslatorInput = {
    where: TranslationWhereUniqueInput
    data: XOR<TranslationUpdateWithoutTranslatorInput, TranslationUncheckedUpdateWithoutTranslatorInput>
  }

  export type TranslationUpdateManyWithWhereWithoutTranslatorInput = {
    where: TranslationScalarWhereInput
    data: XOR<TranslationUpdateManyMutationInput, TranslationUncheckedUpdateManyWithoutTranslatorInput>
  }

  export type TranslationScalarWhereInput = {
    AND?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
    OR?: TranslationScalarWhereInput[]
    NOT?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
    id?: StringFilter<"Translation"> | string
    chapter_id?: StringFilter<"Translation"> | string
    language?: EnumLanguageFilter<"Translation"> | $Enums.Language
    file_url?: StringFilter<"Translation"> | string
    translator_id?: StringNullableFilter<"Translation"> | string | null
    created_at?: DateTimeFilter<"Translation"> | Date | string
  }

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: StringFilter<"Comment"> | string
    user_id?: StringFilter<"Comment"> | string
    chapter_id?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    hidden_at?: DateTimeNullableFilter<"Comment"> | Date | string | null
    created_at?: DateTimeFilter<"Comment"> | Date | string
  }

  export type BookmarkUpsertWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutUserInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutUserInput>
  }

  export type BookmarkScalarWhereInput = {
    AND?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    OR?: BookmarkScalarWhereInput[]
    NOT?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    id?: StringFilter<"Bookmark"> | string
    user_id?: StringFilter<"Bookmark"> | string
    manga_id?: StringFilter<"Bookmark"> | string
    created_at?: DateTimeFilter<"Bookmark"> | Date | string
  }

  export type ChapterBookmarkUpsertWithWhereUniqueWithoutUserInput = {
    where: ChapterBookmarkWhereUniqueInput
    update: XOR<ChapterBookmarkUpdateWithoutUserInput, ChapterBookmarkUncheckedUpdateWithoutUserInput>
    create: XOR<ChapterBookmarkCreateWithoutUserInput, ChapterBookmarkUncheckedCreateWithoutUserInput>
  }

  export type ChapterBookmarkUpdateWithWhereUniqueWithoutUserInput = {
    where: ChapterBookmarkWhereUniqueInput
    data: XOR<ChapterBookmarkUpdateWithoutUserInput, ChapterBookmarkUncheckedUpdateWithoutUserInput>
  }

  export type ChapterBookmarkUpdateManyWithWhereWithoutUserInput = {
    where: ChapterBookmarkScalarWhereInput
    data: XOR<ChapterBookmarkUpdateManyMutationInput, ChapterBookmarkUncheckedUpdateManyWithoutUserInput>
  }

  export type ChapterBookmarkScalarWhereInput = {
    AND?: ChapterBookmarkScalarWhereInput | ChapterBookmarkScalarWhereInput[]
    OR?: ChapterBookmarkScalarWhereInput[]
    NOT?: ChapterBookmarkScalarWhereInput | ChapterBookmarkScalarWhereInput[]
    id?: StringFilter<"ChapterBookmark"> | string
    user_id?: StringFilter<"ChapterBookmark"> | string
    chapter_id?: StringFilter<"ChapterBookmark"> | string
    created_at?: DateTimeFilter<"ChapterBookmark"> | Date | string
  }

  export type ReadingProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: ReadingProgressWhereUniqueInput
    update: XOR<ReadingProgressUpdateWithoutUserInput, ReadingProgressUncheckedUpdateWithoutUserInput>
    create: XOR<ReadingProgressCreateWithoutUserInput, ReadingProgressUncheckedCreateWithoutUserInput>
  }

  export type ReadingProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: ReadingProgressWhereUniqueInput
    data: XOR<ReadingProgressUpdateWithoutUserInput, ReadingProgressUncheckedUpdateWithoutUserInput>
  }

  export type ReadingProgressUpdateManyWithWhereWithoutUserInput = {
    where: ReadingProgressScalarWhereInput
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type ReadingProgressScalarWhereInput = {
    AND?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
    OR?: ReadingProgressScalarWhereInput[]
    NOT?: ReadingProgressScalarWhereInput | ReadingProgressScalarWhereInput[]
    id?: StringFilter<"ReadingProgress"> | string
    user_id?: StringFilter<"ReadingProgress"> | string
    chapter_id?: StringFilter<"ReadingProgress"> | string
    last_page_read?: IntFilter<"ReadingProgress"> | number
    completed?: BoolFilter<"ReadingProgress"> | boolean
    updated_at?: DateTimeFilter<"ReadingProgress"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutMangaInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMangaInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMangaInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMangaInput, UserUncheckedCreateWithoutMangaInput>
  }

  export type ArcCreateWithoutMangaInput = {
    id?: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
    chapters?: ChapterCreateNestedManyWithoutArcInput
  }

  export type ArcUncheckedCreateWithoutMangaInput = {
    id?: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
    chapters?: ChapterUncheckedCreateNestedManyWithoutArcInput
  }

  export type ArcCreateOrConnectWithoutMangaInput = {
    where: ArcWhereUniqueInput
    create: XOR<ArcCreateWithoutMangaInput, ArcUncheckedCreateWithoutMangaInput>
  }

  export type ArcCreateManyMangaInputEnvelope = {
    data: ArcCreateManyMangaInput | ArcCreateManyMangaInput[]
    skipDuplicates?: boolean
  }

  export type ChapterCreateWithoutMangaInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    arc?: ArcCreateNestedOneWithoutChaptersInput
    translations?: TranslationCreateNestedManyWithoutChapterInput
    comments?: CommentCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateWithoutMangaInput = {
    id?: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    translations?: TranslationUncheckedCreateNestedManyWithoutChapterInput
    comments?: CommentUncheckedCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterCreateOrConnectWithoutMangaInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutMangaInput, ChapterUncheckedCreateWithoutMangaInput>
  }

  export type ChapterCreateManyMangaInputEnvelope = {
    data: ChapterCreateManyMangaInput | ChapterCreateManyMangaInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkCreateWithoutMangaInput = {
    id?: string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutBookmarksInput
  }

  export type BookmarkUncheckedCreateWithoutMangaInput = {
    id?: string
    user_id: string
    created_at?: Date | string
  }

  export type BookmarkCreateOrConnectWithoutMangaInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutMangaInput, BookmarkUncheckedCreateWithoutMangaInput>
  }

  export type BookmarkCreateManyMangaInputEnvelope = {
    data: BookmarkCreateManyMangaInput | BookmarkCreateManyMangaInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutMangaInput = {
    update: XOR<UserUpdateWithoutMangaInput, UserUncheckedUpdateWithoutMangaInput>
    create: XOR<UserCreateWithoutMangaInput, UserUncheckedCreateWithoutMangaInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMangaInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMangaInput, UserUncheckedUpdateWithoutMangaInput>
  }

  export type UserUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ArcUpsertWithWhereUniqueWithoutMangaInput = {
    where: ArcWhereUniqueInput
    update: XOR<ArcUpdateWithoutMangaInput, ArcUncheckedUpdateWithoutMangaInput>
    create: XOR<ArcCreateWithoutMangaInput, ArcUncheckedCreateWithoutMangaInput>
  }

  export type ArcUpdateWithWhereUniqueWithoutMangaInput = {
    where: ArcWhereUniqueInput
    data: XOR<ArcUpdateWithoutMangaInput, ArcUncheckedUpdateWithoutMangaInput>
  }

  export type ArcUpdateManyWithWhereWithoutMangaInput = {
    where: ArcScalarWhereInput
    data: XOR<ArcUpdateManyMutationInput, ArcUncheckedUpdateManyWithoutMangaInput>
  }

  export type ArcScalarWhereInput = {
    AND?: ArcScalarWhereInput | ArcScalarWhereInput[]
    OR?: ArcScalarWhereInput[]
    NOT?: ArcScalarWhereInput | ArcScalarWhereInput[]
    id?: StringFilter<"Arc"> | string
    manga_id?: StringFilter<"Arc"> | string
    arc_name?: StringFilter<"Arc"> | string
    arc_order?: IntFilter<"Arc"> | number
    arc_status?: EnumArcStatusFilter<"Arc"> | $Enums.ArcStatus
    arc_image_url?: StringNullableFilter<"Arc"> | string | null
    created_at?: DateTimeFilter<"Arc"> | Date | string
  }

  export type ChapterUpsertWithWhereUniqueWithoutMangaInput = {
    where: ChapterWhereUniqueInput
    update: XOR<ChapterUpdateWithoutMangaInput, ChapterUncheckedUpdateWithoutMangaInput>
    create: XOR<ChapterCreateWithoutMangaInput, ChapterUncheckedCreateWithoutMangaInput>
  }

  export type ChapterUpdateWithWhereUniqueWithoutMangaInput = {
    where: ChapterWhereUniqueInput
    data: XOR<ChapterUpdateWithoutMangaInput, ChapterUncheckedUpdateWithoutMangaInput>
  }

  export type ChapterUpdateManyWithWhereWithoutMangaInput = {
    where: ChapterScalarWhereInput
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyWithoutMangaInput>
  }

  export type ChapterScalarWhereInput = {
    AND?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
    OR?: ChapterScalarWhereInput[]
    NOT?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
    id?: StringFilter<"Chapter"> | string
    manga_id?: StringFilter<"Chapter"> | string
    arc_id?: StringNullableFilter<"Chapter"> | string | null
    chapter_number?: IntFilter<"Chapter"> | number
    chapter_name?: StringFilter<"Chapter"> | string
    cover_image_url?: StringNullableFilter<"Chapter"> | string | null
    published_date?: DateTimeFilter<"Chapter"> | Date | string
    view_count?: IntFilter<"Chapter"> | number
    comment_count?: IntFilter<"Chapter"> | number
    created_at?: DateTimeFilter<"Chapter"> | Date | string
  }

  export type BookmarkUpsertWithWhereUniqueWithoutMangaInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutMangaInput, BookmarkUncheckedUpdateWithoutMangaInput>
    create: XOR<BookmarkCreateWithoutMangaInput, BookmarkUncheckedCreateWithoutMangaInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutMangaInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutMangaInput, BookmarkUncheckedUpdateWithoutMangaInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutMangaInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutMangaInput>
  }

  export type MangaCreateWithoutArcsInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    author: UserCreateNestedOneWithoutMangaInput
    chapters?: ChapterCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkCreateNestedManyWithoutMangaInput
  }

  export type MangaUncheckedCreateWithoutArcsInput = {
    id?: string
    author_id: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    chapters?: ChapterUncheckedCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutMangaInput
  }

  export type MangaCreateOrConnectWithoutArcsInput = {
    where: MangaWhereUniqueInput
    create: XOR<MangaCreateWithoutArcsInput, MangaUncheckedCreateWithoutArcsInput>
  }

  export type ChapterCreateWithoutArcInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutChaptersInput
    translations?: TranslationCreateNestedManyWithoutChapterInput
    comments?: CommentCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateWithoutArcInput = {
    id?: string
    manga_id: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    translations?: TranslationUncheckedCreateNestedManyWithoutChapterInput
    comments?: CommentUncheckedCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterCreateOrConnectWithoutArcInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutArcInput, ChapterUncheckedCreateWithoutArcInput>
  }

  export type ChapterCreateManyArcInputEnvelope = {
    data: ChapterCreateManyArcInput | ChapterCreateManyArcInput[]
    skipDuplicates?: boolean
  }

  export type MangaUpsertWithoutArcsInput = {
    update: XOR<MangaUpdateWithoutArcsInput, MangaUncheckedUpdateWithoutArcsInput>
    create: XOR<MangaCreateWithoutArcsInput, MangaUncheckedCreateWithoutArcsInput>
    where?: MangaWhereInput
  }

  export type MangaUpdateToOneWithWhereWithoutArcsInput = {
    where?: MangaWhereInput
    data: XOR<MangaUpdateWithoutArcsInput, MangaUncheckedUpdateWithoutArcsInput>
  }

  export type MangaUpdateWithoutArcsInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutMangaNestedInput
    chapters?: ChapterUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUpdateManyWithoutMangaNestedInput
  }

  export type MangaUncheckedUpdateWithoutArcsInput = {
    id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUncheckedUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutMangaNestedInput
  }

  export type ChapterUpsertWithWhereUniqueWithoutArcInput = {
    where: ChapterWhereUniqueInput
    update: XOR<ChapterUpdateWithoutArcInput, ChapterUncheckedUpdateWithoutArcInput>
    create: XOR<ChapterCreateWithoutArcInput, ChapterUncheckedCreateWithoutArcInput>
  }

  export type ChapterUpdateWithWhereUniqueWithoutArcInput = {
    where: ChapterWhereUniqueInput
    data: XOR<ChapterUpdateWithoutArcInput, ChapterUncheckedUpdateWithoutArcInput>
  }

  export type ChapterUpdateManyWithWhereWithoutArcInput = {
    where: ChapterScalarWhereInput
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyWithoutArcInput>
  }

  export type MangaCreateWithoutChaptersInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    author: UserCreateNestedOneWithoutMangaInput
    arcs?: ArcCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkCreateNestedManyWithoutMangaInput
  }

  export type MangaUncheckedCreateWithoutChaptersInput = {
    id?: string
    author_id: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    arcs?: ArcUncheckedCreateNestedManyWithoutMangaInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutMangaInput
  }

  export type MangaCreateOrConnectWithoutChaptersInput = {
    where: MangaWhereUniqueInput
    create: XOR<MangaCreateWithoutChaptersInput, MangaUncheckedCreateWithoutChaptersInput>
  }

  export type ArcCreateWithoutChaptersInput = {
    id?: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutArcsInput
  }

  export type ArcUncheckedCreateWithoutChaptersInput = {
    id?: string
    manga_id: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
  }

  export type ArcCreateOrConnectWithoutChaptersInput = {
    where: ArcWhereUniqueInput
    create: XOR<ArcCreateWithoutChaptersInput, ArcUncheckedCreateWithoutChaptersInput>
  }

  export type TranslationCreateWithoutChapterInput = {
    id?: string
    language: $Enums.Language
    file_url: string
    created_at?: Date | string
    translator?: UserCreateNestedOneWithoutTranslationsInput
  }

  export type TranslationUncheckedCreateWithoutChapterInput = {
    id?: string
    language: $Enums.Language
    file_url: string
    translator_id?: string | null
    created_at?: Date | string
  }

  export type TranslationCreateOrConnectWithoutChapterInput = {
    where: TranslationWhereUniqueInput
    create: XOR<TranslationCreateWithoutChapterInput, TranslationUncheckedCreateWithoutChapterInput>
  }

  export type TranslationCreateManyChapterInputEnvelope = {
    data: TranslationCreateManyChapterInput | TranslationCreateManyChapterInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutChapterInput = {
    id?: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutChapterInput = {
    id?: string
    user_id: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
  }

  export type CommentCreateOrConnectWithoutChapterInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutChapterInput, CommentUncheckedCreateWithoutChapterInput>
  }

  export type CommentCreateManyChapterInputEnvelope = {
    data: CommentCreateManyChapterInput | CommentCreateManyChapterInput[]
    skipDuplicates?: boolean
  }

  export type ReadingProgressCreateWithoutChapterInput = {
    id?: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutReading_progressInput
  }

  export type ReadingProgressUncheckedCreateWithoutChapterInput = {
    id?: string
    user_id: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
  }

  export type ReadingProgressCreateOrConnectWithoutChapterInput = {
    where: ReadingProgressWhereUniqueInput
    create: XOR<ReadingProgressCreateWithoutChapterInput, ReadingProgressUncheckedCreateWithoutChapterInput>
  }

  export type ReadingProgressCreateManyChapterInputEnvelope = {
    data: ReadingProgressCreateManyChapterInput | ReadingProgressCreateManyChapterInput[]
    skipDuplicates?: boolean
  }

  export type ChapterBookmarkCreateWithoutChapterInput = {
    id?: string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutChapter_bookmarksInput
  }

  export type ChapterBookmarkUncheckedCreateWithoutChapterInput = {
    id?: string
    user_id: string
    created_at?: Date | string
  }

  export type ChapterBookmarkCreateOrConnectWithoutChapterInput = {
    where: ChapterBookmarkWhereUniqueInput
    create: XOR<ChapterBookmarkCreateWithoutChapterInput, ChapterBookmarkUncheckedCreateWithoutChapterInput>
  }

  export type ChapterBookmarkCreateManyChapterInputEnvelope = {
    data: ChapterBookmarkCreateManyChapterInput | ChapterBookmarkCreateManyChapterInput[]
    skipDuplicates?: boolean
  }

  export type MangaUpsertWithoutChaptersInput = {
    update: XOR<MangaUpdateWithoutChaptersInput, MangaUncheckedUpdateWithoutChaptersInput>
    create: XOR<MangaCreateWithoutChaptersInput, MangaUncheckedCreateWithoutChaptersInput>
    where?: MangaWhereInput
  }

  export type MangaUpdateToOneWithWhereWithoutChaptersInput = {
    where?: MangaWhereInput
    data: XOR<MangaUpdateWithoutChaptersInput, MangaUncheckedUpdateWithoutChaptersInput>
  }

  export type MangaUpdateWithoutChaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutMangaNestedInput
    arcs?: ArcUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUpdateManyWithoutMangaNestedInput
  }

  export type MangaUncheckedUpdateWithoutChaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    arcs?: ArcUncheckedUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutMangaNestedInput
  }

  export type ArcUpsertWithoutChaptersInput = {
    update: XOR<ArcUpdateWithoutChaptersInput, ArcUncheckedUpdateWithoutChaptersInput>
    create: XOR<ArcCreateWithoutChaptersInput, ArcUncheckedCreateWithoutChaptersInput>
    where?: ArcWhereInput
  }

  export type ArcUpdateToOneWithWhereWithoutChaptersInput = {
    where?: ArcWhereInput
    data: XOR<ArcUpdateWithoutChaptersInput, ArcUncheckedUpdateWithoutChaptersInput>
  }

  export type ArcUpdateWithoutChaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutArcsNestedInput
  }

  export type ArcUncheckedUpdateWithoutChaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationUpsertWithWhereUniqueWithoutChapterInput = {
    where: TranslationWhereUniqueInput
    update: XOR<TranslationUpdateWithoutChapterInput, TranslationUncheckedUpdateWithoutChapterInput>
    create: XOR<TranslationCreateWithoutChapterInput, TranslationUncheckedCreateWithoutChapterInput>
  }

  export type TranslationUpdateWithWhereUniqueWithoutChapterInput = {
    where: TranslationWhereUniqueInput
    data: XOR<TranslationUpdateWithoutChapterInput, TranslationUncheckedUpdateWithoutChapterInput>
  }

  export type TranslationUpdateManyWithWhereWithoutChapterInput = {
    where: TranslationScalarWhereInput
    data: XOR<TranslationUpdateManyMutationInput, TranslationUncheckedUpdateManyWithoutChapterInput>
  }

  export type CommentUpsertWithWhereUniqueWithoutChapterInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutChapterInput, CommentUncheckedUpdateWithoutChapterInput>
    create: XOR<CommentCreateWithoutChapterInput, CommentUncheckedCreateWithoutChapterInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutChapterInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutChapterInput, CommentUncheckedUpdateWithoutChapterInput>
  }

  export type CommentUpdateManyWithWhereWithoutChapterInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutChapterInput>
  }

  export type ReadingProgressUpsertWithWhereUniqueWithoutChapterInput = {
    where: ReadingProgressWhereUniqueInput
    update: XOR<ReadingProgressUpdateWithoutChapterInput, ReadingProgressUncheckedUpdateWithoutChapterInput>
    create: XOR<ReadingProgressCreateWithoutChapterInput, ReadingProgressUncheckedCreateWithoutChapterInput>
  }

  export type ReadingProgressUpdateWithWhereUniqueWithoutChapterInput = {
    where: ReadingProgressWhereUniqueInput
    data: XOR<ReadingProgressUpdateWithoutChapterInput, ReadingProgressUncheckedUpdateWithoutChapterInput>
  }

  export type ReadingProgressUpdateManyWithWhereWithoutChapterInput = {
    where: ReadingProgressScalarWhereInput
    data: XOR<ReadingProgressUpdateManyMutationInput, ReadingProgressUncheckedUpdateManyWithoutChapterInput>
  }

  export type ChapterBookmarkUpsertWithWhereUniqueWithoutChapterInput = {
    where: ChapterBookmarkWhereUniqueInput
    update: XOR<ChapterBookmarkUpdateWithoutChapterInput, ChapterBookmarkUncheckedUpdateWithoutChapterInput>
    create: XOR<ChapterBookmarkCreateWithoutChapterInput, ChapterBookmarkUncheckedCreateWithoutChapterInput>
  }

  export type ChapterBookmarkUpdateWithWhereUniqueWithoutChapterInput = {
    where: ChapterBookmarkWhereUniqueInput
    data: XOR<ChapterBookmarkUpdateWithoutChapterInput, ChapterBookmarkUncheckedUpdateWithoutChapterInput>
  }

  export type ChapterBookmarkUpdateManyWithWhereWithoutChapterInput = {
    where: ChapterBookmarkScalarWhereInput
    data: XOR<ChapterBookmarkUpdateManyMutationInput, ChapterBookmarkUncheckedUpdateManyWithoutChapterInput>
  }

  export type ChapterCreateWithoutTranslationsInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutChaptersInput
    arc?: ArcCreateNestedOneWithoutChaptersInput
    comments?: CommentCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateWithoutTranslationsInput = {
    id?: string
    manga_id: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterCreateOrConnectWithoutTranslationsInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutTranslationsInput, ChapterUncheckedCreateWithoutTranslationsInput>
  }

  export type UserCreateWithoutTranslationsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTranslationsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTranslationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTranslationsInput, UserUncheckedCreateWithoutTranslationsInput>
  }

  export type ChapterUpsertWithoutTranslationsInput = {
    update: XOR<ChapterUpdateWithoutTranslationsInput, ChapterUncheckedUpdateWithoutTranslationsInput>
    create: XOR<ChapterCreateWithoutTranslationsInput, ChapterUncheckedCreateWithoutTranslationsInput>
    where?: ChapterWhereInput
  }

  export type ChapterUpdateToOneWithWhereWithoutTranslationsInput = {
    where?: ChapterWhereInput
    data: XOR<ChapterUpdateWithoutTranslationsInput, ChapterUncheckedUpdateWithoutTranslationsInput>
  }

  export type ChapterUpdateWithoutTranslationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutChaptersNestedInput
    arc?: ArcUpdateOneWithoutChaptersNestedInput
    comments?: CommentUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateWithoutTranslationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type UserUpsertWithoutTranslationsInput = {
    update: XOR<UserUpdateWithoutTranslationsInput, UserUncheckedUpdateWithoutTranslationsInput>
    create: XOR<UserCreateWithoutTranslationsInput, UserUncheckedCreateWithoutTranslationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTranslationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTranslationsInput, UserUncheckedUpdateWithoutTranslationsInput>
  }

  export type UserUpdateWithoutTranslationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTranslationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCommentsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
  }

  export type ChapterCreateWithoutCommentsInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutChaptersInput
    arc?: ArcCreateNestedOneWithoutChaptersInput
    translations?: TranslationCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateWithoutCommentsInput = {
    id?: string
    manga_id: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    translations?: TranslationUncheckedCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterCreateOrConnectWithoutCommentsInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutCommentsInput, ChapterUncheckedCreateWithoutCommentsInput>
  }

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChapterUpsertWithoutCommentsInput = {
    update: XOR<ChapterUpdateWithoutCommentsInput, ChapterUncheckedUpdateWithoutCommentsInput>
    create: XOR<ChapterCreateWithoutCommentsInput, ChapterUncheckedCreateWithoutCommentsInput>
    where?: ChapterWhereInput
  }

  export type ChapterUpdateToOneWithWhereWithoutCommentsInput = {
    where?: ChapterWhereInput
    data: XOR<ChapterUpdateWithoutCommentsInput, ChapterUncheckedUpdateWithoutCommentsInput>
  }

  export type ChapterUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutChaptersNestedInput
    arc?: ArcUpdateOneWithoutChaptersNestedInput
    translations?: TranslationUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translations?: TranslationUncheckedUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type UserCreateWithoutBookmarksInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBookmarksInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBookmarksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
  }

  export type MangaCreateWithoutBookmarksInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    author: UserCreateNestedOneWithoutMangaInput
    arcs?: ArcCreateNestedManyWithoutMangaInput
    chapters?: ChapterCreateNestedManyWithoutMangaInput
  }

  export type MangaUncheckedCreateWithoutBookmarksInput = {
    id?: string
    author_id: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    arcs?: ArcUncheckedCreateNestedManyWithoutMangaInput
    chapters?: ChapterUncheckedCreateNestedManyWithoutMangaInput
  }

  export type MangaCreateOrConnectWithoutBookmarksInput = {
    where: MangaWhereUniqueInput
    create: XOR<MangaCreateWithoutBookmarksInput, MangaUncheckedCreateWithoutBookmarksInput>
  }

  export type UserUpsertWithoutBookmarksInput = {
    update: XOR<UserUpdateWithoutBookmarksInput, UserUncheckedUpdateWithoutBookmarksInput>
    create: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookmarksInput, UserUncheckedUpdateWithoutBookmarksInput>
  }

  export type UserUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MangaUpsertWithoutBookmarksInput = {
    update: XOR<MangaUpdateWithoutBookmarksInput, MangaUncheckedUpdateWithoutBookmarksInput>
    create: XOR<MangaCreateWithoutBookmarksInput, MangaUncheckedCreateWithoutBookmarksInput>
    where?: MangaWhereInput
  }

  export type MangaUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: MangaWhereInput
    data: XOR<MangaUpdateWithoutBookmarksInput, MangaUncheckedUpdateWithoutBookmarksInput>
  }

  export type MangaUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutMangaNestedInput
    arcs?: ArcUpdateManyWithoutMangaNestedInput
    chapters?: ChapterUpdateManyWithoutMangaNestedInput
  }

  export type MangaUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    arcs?: ArcUncheckedUpdateManyWithoutMangaNestedInput
    chapters?: ChapterUncheckedUpdateManyWithoutMangaNestedInput
  }

  export type UserCreateWithoutChapter_bookmarksInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChapter_bookmarksInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChapter_bookmarksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChapter_bookmarksInput, UserUncheckedCreateWithoutChapter_bookmarksInput>
  }

  export type ChapterCreateWithoutChapter_bookmarksInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutChaptersInput
    arc?: ArcCreateNestedOneWithoutChaptersInput
    translations?: TranslationCreateNestedManyWithoutChapterInput
    comments?: CommentCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateWithoutChapter_bookmarksInput = {
    id?: string
    manga_id: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    translations?: TranslationUncheckedCreateNestedManyWithoutChapterInput
    comments?: CommentUncheckedCreateNestedManyWithoutChapterInput
    reading_progress?: ReadingProgressUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterCreateOrConnectWithoutChapter_bookmarksInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutChapter_bookmarksInput, ChapterUncheckedCreateWithoutChapter_bookmarksInput>
  }

  export type UserUpsertWithoutChapter_bookmarksInput = {
    update: XOR<UserUpdateWithoutChapter_bookmarksInput, UserUncheckedUpdateWithoutChapter_bookmarksInput>
    create: XOR<UserCreateWithoutChapter_bookmarksInput, UserUncheckedCreateWithoutChapter_bookmarksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChapter_bookmarksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChapter_bookmarksInput, UserUncheckedUpdateWithoutChapter_bookmarksInput>
  }

  export type UserUpdateWithoutChapter_bookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChapter_bookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChapterUpsertWithoutChapter_bookmarksInput = {
    update: XOR<ChapterUpdateWithoutChapter_bookmarksInput, ChapterUncheckedUpdateWithoutChapter_bookmarksInput>
    create: XOR<ChapterCreateWithoutChapter_bookmarksInput, ChapterUncheckedCreateWithoutChapter_bookmarksInput>
    where?: ChapterWhereInput
  }

  export type ChapterUpdateToOneWithWhereWithoutChapter_bookmarksInput = {
    where?: ChapterWhereInput
    data: XOR<ChapterUpdateWithoutChapter_bookmarksInput, ChapterUncheckedUpdateWithoutChapter_bookmarksInput>
  }

  export type ChapterUpdateWithoutChapter_bookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutChaptersNestedInput
    arc?: ArcUpdateOneWithoutChaptersNestedInput
    translations?: TranslationUpdateManyWithoutChapterNestedInput
    comments?: CommentUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateWithoutChapter_bookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translations?: TranslationUncheckedUpdateManyWithoutChapterNestedInput
    comments?: CommentUncheckedUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type UserCreateWithoutReading_progressInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    manga?: MangaCreateNestedManyWithoutAuthorInput
    translations?: TranslationCreateNestedManyWithoutTranslatorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReading_progressInput = {
    id?: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    role?: $Enums.Role
    created_at?: Date | string
    updated_at?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    manga?: MangaUncheckedCreateNestedManyWithoutAuthorInput
    translations?: TranslationUncheckedCreateNestedManyWithoutTranslatorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReading_progressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReading_progressInput, UserUncheckedCreateWithoutReading_progressInput>
  }

  export type ChapterCreateWithoutReading_progressInput = {
    id?: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    manga: MangaCreateNestedOneWithoutChaptersInput
    arc?: ArcCreateNestedOneWithoutChaptersInput
    translations?: TranslationCreateNestedManyWithoutChapterInput
    comments?: CommentCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkCreateNestedManyWithoutChapterInput
  }

  export type ChapterUncheckedCreateWithoutReading_progressInput = {
    id?: string
    manga_id: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
    translations?: TranslationUncheckedCreateNestedManyWithoutChapterInput
    comments?: CommentUncheckedCreateNestedManyWithoutChapterInput
    chapter_bookmarks?: ChapterBookmarkUncheckedCreateNestedManyWithoutChapterInput
  }

  export type ChapterCreateOrConnectWithoutReading_progressInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutReading_progressInput, ChapterUncheckedCreateWithoutReading_progressInput>
  }

  export type UserUpsertWithoutReading_progressInput = {
    update: XOR<UserUpdateWithoutReading_progressInput, UserUncheckedUpdateWithoutReading_progressInput>
    create: XOR<UserCreateWithoutReading_progressInput, UserUncheckedCreateWithoutReading_progressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReading_progressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReading_progressInput, UserUncheckedUpdateWithoutReading_progressInput>
  }

  export type UserUpdateWithoutReading_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    manga?: MangaUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReading_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    manga?: MangaUncheckedUpdateManyWithoutAuthorNestedInput
    translations?: TranslationUncheckedUpdateManyWithoutTranslatorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChapterUpsertWithoutReading_progressInput = {
    update: XOR<ChapterUpdateWithoutReading_progressInput, ChapterUncheckedUpdateWithoutReading_progressInput>
    create: XOR<ChapterCreateWithoutReading_progressInput, ChapterUncheckedCreateWithoutReading_progressInput>
    where?: ChapterWhereInput
  }

  export type ChapterUpdateToOneWithWhereWithoutReading_progressInput = {
    where?: ChapterWhereInput
    data: XOR<ChapterUpdateWithoutReading_progressInput, ChapterUncheckedUpdateWithoutReading_progressInput>
  }

  export type ChapterUpdateWithoutReading_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutChaptersNestedInput
    arc?: ArcUpdateOneWithoutChaptersNestedInput
    translations?: TranslationUpdateManyWithoutChapterNestedInput
    comments?: CommentUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateWithoutReading_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translations?: TranslationUncheckedUpdateManyWithoutChapterNestedInput
    comments?: CommentUncheckedUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    accountId: string
    providerId: string
    issuer: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MangaCreateManyAuthorInput = {
    id?: string
    manga_title: string
    manga_synopsis: string
    cover_image_url?: string | null
    banner_image_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TranslationCreateManyTranslatorInput = {
    id?: string
    chapter_id: string
    language: $Enums.Language
    file_url: string
    created_at?: Date | string
  }

  export type CommentCreateManyUserInput = {
    id?: string
    chapter_id: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
  }

  export type BookmarkCreateManyUserInput = {
    id?: string
    manga_id: string
    created_at?: Date | string
  }

  export type ChapterBookmarkCreateManyUserInput = {
    id?: string
    chapter_id: string
    created_at?: Date | string
  }

  export type ReadingProgressCreateManyUserInput = {
    id?: string
    chapter_id: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MangaUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    arcs?: ArcUpdateManyWithoutMangaNestedInput
    chapters?: ChapterUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUpdateManyWithoutMangaNestedInput
  }

  export type MangaUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    arcs?: ArcUncheckedUpdateManyWithoutMangaNestedInput
    chapters?: ChapterUncheckedUpdateManyWithoutMangaNestedInput
    bookmarks?: BookmarkUncheckedUpdateManyWithoutMangaNestedInput
  }

  export type MangaUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_title?: StringFieldUpdateOperationsInput | string
    manga_synopsis?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    banner_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationUpdateWithoutTranslatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapter?: ChapterUpdateOneRequiredWithoutTranslationsNestedInput
  }

  export type TranslationUncheckedUpdateWithoutTranslatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationUncheckedUpdateManyWithoutTranslatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapter?: ChapterUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapter?: ChapterUpdateOneRequiredWithoutChapter_bookmarksNestedInput
  }

  export type ChapterBookmarkUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapter?: ChapterUpdateOneRequiredWithoutReading_progressNestedInput
  }

  export type ReadingProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArcCreateManyMangaInput = {
    id?: string
    arc_name: string
    arc_order: number
    arc_status?: $Enums.ArcStatus
    arc_image_url?: string | null
    created_at?: Date | string
  }

  export type ChapterCreateManyMangaInput = {
    id?: string
    arc_id?: string | null
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
  }

  export type BookmarkCreateManyMangaInput = {
    id?: string
    user_id: string
    created_at?: Date | string
  }

  export type ArcUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUpdateManyWithoutArcNestedInput
  }

  export type ArcUncheckedUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUncheckedUpdateManyWithoutArcNestedInput
  }

  export type ArcUncheckedUpdateManyWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_name?: StringFieldUpdateOperationsInput | string
    arc_order?: IntFieldUpdateOperationsInput | number
    arc_status?: EnumArcStatusFieldUpdateOperationsInput | $Enums.ArcStatus
    arc_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    arc?: ArcUpdateOneWithoutChaptersNestedInput
    translations?: TranslationUpdateManyWithoutChapterNestedInput
    comments?: CommentUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translations?: TranslationUncheckedUpdateManyWithoutChapterNestedInput
    comments?: CommentUncheckedUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateManyWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc_id?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyWithoutMangaInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterCreateManyArcInput = {
    id?: string
    manga_id: string
    chapter_number: number
    chapter_name: string
    cover_image_url?: string | null
    published_date: Date | string
    view_count?: number
    comment_count?: number
    created_at?: Date | string
  }

  export type ChapterUpdateWithoutArcInput = {
    id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    manga?: MangaUpdateOneRequiredWithoutChaptersNestedInput
    translations?: TranslationUpdateManyWithoutChapterNestedInput
    comments?: CommentUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateWithoutArcInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translations?: TranslationUncheckedUpdateManyWithoutChapterNestedInput
    comments?: CommentUncheckedUpdateManyWithoutChapterNestedInput
    reading_progress?: ReadingProgressUncheckedUpdateManyWithoutChapterNestedInput
    chapter_bookmarks?: ChapterBookmarkUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type ChapterUncheckedUpdateManyWithoutArcInput = {
    id?: StringFieldUpdateOperationsInput | string
    manga_id?: StringFieldUpdateOperationsInput | string
    chapter_number?: IntFieldUpdateOperationsInput | number
    chapter_name?: StringFieldUpdateOperationsInput | string
    cover_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    published_date?: DateTimeFieldUpdateOperationsInput | Date | string
    view_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationCreateManyChapterInput = {
    id?: string
    language: $Enums.Language
    file_url: string
    translator_id?: string | null
    created_at?: Date | string
  }

  export type CommentCreateManyChapterInput = {
    id?: string
    user_id: string
    body: string
    hidden_at?: Date | string | null
    created_at?: Date | string
  }

  export type ReadingProgressCreateManyChapterInput = {
    id?: string
    user_id: string
    last_page_read?: number
    completed?: boolean
    updated_at?: Date | string
  }

  export type ChapterBookmarkCreateManyChapterInput = {
    id?: string
    user_id: string
    created_at?: Date | string
  }

  export type TranslationUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    translator?: UserUpdateOneWithoutTranslationsNestedInput
  }

  export type TranslationUncheckedUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    translator_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslationUncheckedUpdateManyWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    file_url?: StringFieldUpdateOperationsInput | string
    translator_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    hidden_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReading_progressNestedInput
  }

  export type ReadingProgressUncheckedUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingProgressUncheckedUpdateManyWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    last_page_read?: IntFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChapter_bookmarksNestedInput
  }

  export type ChapterBookmarkUncheckedUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterBookmarkUncheckedUpdateManyWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



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