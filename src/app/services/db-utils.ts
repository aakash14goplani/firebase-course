import { QuerySnapshot } from '@angular/fire/compat/firestore';

export function convertSnapshotToArray<T>(snapshot: QuerySnapshot<T>): T[] {
  return snapshot.docs.map(doc => ({
    ...doc.data() as T,
    id: doc.id
  }));
}
