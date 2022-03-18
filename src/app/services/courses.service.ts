import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Course } from '../model/course';
import { convertSnapshotToArray } from './db-utils';

@Injectable({ providedIn: 'root' })
export class CoursesService {

  constructor(
    private db: AngularFirestore
  ) { }

  loadCoursesByCategory(category: string): Observable<Course[]> {
    return this.db.collection<Course>(
      'courses',
      ref => ref.where('categories', 'array-contains', category).orderBy('seqNo')
    ).get().pipe(
      map(snapshot => convertSnapshotToArray<Course>(snapshot)),
      catchError((err) => {
        console.error('Error loading courses', err);
        return EMPTY;
      })
    );
  }
}
