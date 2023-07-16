// import {
//   DocumentSnapshot,
//   DocumentData,
//   DocumentReference,
//   QueryDocumentSnapshot,
//   SnapshotOptions,
//   FirestoreDataConverter,
//   Timestamp,
//   FieldValue,
// } from "firebase/firestore";
// import { immerable, produce } from "immer";
//
// export type FirestoreDocumentInitializeParams<T> = {
//   initialValues?: Partial<T>;
//   snapshot?: DocumentSnapshot<DocumentData>;
// };
//
// export default class FirestoreDocumentBase<T extends FirestoreDocumentBase<T>> {
//   [immerable] = true;
//
//   protected init(args?: {
//     initialValues?: Partial<T>;
//     snapshot?: DocumentSnapshot<DocumentData>;
//     ref: DocumentReference;
//   }): FirestoreDocumentBase<T> {
//     const { initialValues, snapshot, ref } = args ?? {};
//
//     const data = fromTimestampToDate({ ...snapshot?.data(), ...initialValues });
//
//     return produce<T>(this as any, (draft) => {
//       Object.entries(data).forEach(([key, value]) => {
//         draft[key] = value;
//       });
//       draft.id = snapshot?.id ?? "";
//       draft.ref = snapshot?.ref ?? ref ?? null;
//       draft.createdAt =
//         snapshot?.get("createdAt")?.toDate().toLocaleString() ?? null;
//       draft.updatedAt =
//         snapshot?.get("updatedAt")?.toDate().toLocaleString() ?? null;
//     });
//   }
//
//   readonly id: string = "";
//   readonly ref: DocumentReference | null = null;
//   readonly createdAt?: Date | null = null;
//   readonly updatedAt?: Date | null = null;
//
//   async save(values: Partial<T> | undefined = {}): Promise<void> {
//     if (!this.ref) return;
//
//     const { ref, ...data } = this;
//
//     await ref
//       .withConverter(this.CommonConverter)
//       .set({ ...data, ...values }, { merge: true });
//   }
//
//   async delete(): Promise<void> {
//     if (!this.ref) return;
//     await this.ref.delete();
//   }
//
//   setData(data: Partial<T>): this {
//     return produce(this, (draft) => {
//       Object.entries(data).forEach(([key, value]) => {
//         draft[key] = value;
//       });
//     });
//   }
//
//   private get CommonConverter(): FirestoreDataConverter<T> {
//     return {
//       fromFirestore: (
//         snapshot: QueryDocumentSnapshot,
//         options: SnapshotOptions
//       ): T => {
//         const data = snapshot.data(options);
//         const dateConverted = fromTimestampToDate(data);
//
//         return {
//           ...dateConverted,
//           id: snapshot.id,
//           ref: snapshot.ref,
//         } as T;
//       },
//       toFirestore: (values: Partial<T>): DocumentData => {
//         const data = omitUndefined(values);
//
//         // update existing document
//         if (data.id) {
//           return {
//             ...data,
//             createdAt: Timestamp.fromDate(new Date(data.createdAt)),
//             updatedAt: firestore.FieldValue.serverTimestamp(),
//           };
//         }
//
//         // create new document
//         return {
//           ...data,
//           createdAt: FieldValue.serverTimestamp(),
//           updatedAt: firestore.FieldValue.serverTimestamp(),
//         };
//       },
//     };
//   }
// }
//
// function omitUndefined(obj: { [key: string]: any }): any {
//   // 日付データはtypeofが'object'になるので先に処理する。なければnullを返す
//   if (obj instanceof Date) {
//     return obj ?? null;
//   }
//
//   // 配列の場合は各要素に対して再帰的にundefinedを除外する
//   if (Array.isArray(obj)) {
//     return obj
//       .map(omitUndefined)
//       .filter((value) => value !== undefined)
//       .map((value) =>
//         typeof value === "object" ? omitUndefined(value) : value
//       );
//   }
//
//   // オブジェクト { key: value } は各値に対して再帰的にundefinedを除外する
//   if (typeof obj === "object") {
//     const result: { [key: string]: any } = {};
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const value = omitUndefined(obj[key]);
//         if (value !== undefined) {
//           result[key] = value;
//         }
//       }
//     }
//
//     return result;
//   }
//
//   // 上記以外のプリミティブなデータ型
//   return obj ?? null;
// }
//
// function fromTimestampToDate(obj: { [key: string]: any }): any {
//   if (obj instanceof firestore.Timestamp) {
//     return obj.toDate();
//   }
//
//   if (Array.isArray(obj)) {
//     return obj.map(fromTimestampToDate);
//   }
//
//   if (typeof obj === "object") {
//     const result: { [key: string]: any } = {};
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const value = fromTimestampToDate(obj[key]);
//         result[key] = value;
//       }
//     }
//
//     return result;
//   }
//
//   return obj;
// }
