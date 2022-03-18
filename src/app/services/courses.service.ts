import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { concatMap, EMPTY, from, map, Observable } from 'rxjs';
import { Course } from '../model/course';
import { convertSnapshotToArray } from './db-utils';

@Injectable({ providedIn: 'root' })
export class CoursesService {

  constructor(
    private db: AngularFirestore
  ) { }

  /**
   * Loads courses from the database for a given category.
   * @param category { string } - The category of the course
   * @returns { Observable<Course[]> } - An observable of the courses
   */
  loadCoursesByCategory(category: string): Observable<Course[]> {
    try {
      return this.db.collection<Course>(
        'courses',
        ref => ref.where('categories', 'array-contains', category).orderBy('seqNo')
      ).get().pipe(
        map(snapshot => convertSnapshotToArray<Course>(snapshot))
      );
    } catch (e) {
      return EMPTY;
    }
  }

  /**
   * Creates a course in the database.
   * @param course { Partial<Course> } - The course to be saved
   * @param course.id { string } - The id of the course
   * @returns { Observable<Course> } - An observable of the course
   */
  createCourse(newCourse: Partial<Course>, courseId?: string): Observable<Partial<Course>> {
    return this.db.collection<Course>(
      'courses',
      ref => ref.orderBy('seqNo', 'desc').limit(1)
    ).get().pipe(
      concatMap((snapshot) => {
        const courses = convertSnapshotToArray<Course>(snapshot);
        const seqNo = courses[0]?.seqNo + 1 ?? 0;

        const course: Partial<Course> = {
          ...newCourse,
          seqNo
        };

        let result$: Observable<void | DocumentReference<Partial<Course>>>;
        if (courseId) {
          result$ = from(this.db.doc<Partial<Course>>(`courses/${courseId}`).set(course));
        } else {
          result$ = from(this.db.collection<Partial<Course>>('courses').add(course));
        }

        return result$.pipe(
          map(res => ({
            id: (courseId ?? res?.id) || '0',
            ...course
          }))
        );
      })
    );
  }

  /**
   * Updates a course in the database.
   * @param course { Partial<Course> } - The course to be saved
   * @returns { Observable<void> } - An observable of the course
   */
  updateCourse(course: Partial<Course>): Observable<void> {
    return from(this.db.doc<Partial<Course>>(`courses/${course.id}`).update(course));
  }

  /**
   * Deletes a course in the database.
   * @param courseId { string } - The id of the course
   * @returns { Observable<void> } - An observable of the course
   */
  deleteCourse(courseId: string): Observable<void> {
    return from(this.db.doc<Partial<Course>>(`courses/${courseId}`).delete());
  }

  /**
   * Generates unique course id.
   * @returns { string } - The id of the course
   */
  createUniqueId(): string {
    return this.db.createId();
  }
}
