import { Injectable } from '@angular/core';
import { concatMap, EMPTY, from, map, Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import OrderByDirection = firebase.firestore.OrderByDirection;
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
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
   * For data structure with nested collection we need to perform CURD with help of BATCH
   * @param courseId { string } - The id of the course
   * @returns { Observable<void> } - An observable of the course
   */
  deleteCoursesAndLessons(courseId: string): Observable<void> {
    return this.db.collection<Course>(`courses/${courseId}/lessons`)
      .get()
      .pipe(
        concatMap((snapshot) => {
          const lessons = convertSnapshotToArray<Course>(snapshot);
          const batch = this.db.firestore.batch();
          const courseRef = this.db.doc(`courses/${courseId}`).ref;

          batch.delete(courseRef);

          for (const lesson of lessons) {
            const lessonRef = this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;
            batch.delete(lessonRef);
          }

          return from(batch.commit());
        })
      );
  }

  /**
   * Finds a course by URL.
   * @param courseUrl { string } - The url of the course
   * @returns { Observable<Course | null> } - An observable of the course, null if none found
   */
  findCourseByURL(courseUrl: string): Observable<Course | null> {
    return this.db.collection<Course>('courses', ref => ref.where('url', '==', courseUrl))
      .get()
      .pipe(
        map((snapshot) => {
          const courses = convertSnapshotToArray<Course>(snapshot);
          return courses?.length === 1 ? courses[0] : null;
        })
      );
  }

  /**
   * Fetches the lessons for a course & enables pagination.
   * @param courseId { string } - The id of the course
   * @param sortOrder { OrderByDirection } - The sort order 'asc' or 'desc'
   * @param pageNumber { number } - The page number
   * @param pageSize { number } - The page size
   * @returns { Observable<Lesson[]> } - An observable of the lessons with course with id courseId
   */
  findLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber: number = 0, pageSize: number = 3): Observable<Lesson[]> {
    return this.db.collection<Lesson>(
      `courses/${courseId}/lessons`,
      ref => ref.orderBy('seqNo', sortOrder).limit(pageSize).startAfter(pageNumber * pageSize)
    )
      .get()
      .pipe(
        map(snapshot => convertSnapshotToArray<Lesson>(snapshot))
      );
  }

  /**
   * Generates unique course id.
   * @returns { string } - The id of the course
   */
  createUniqueId(): string {
    return this.db.createId();
  }
}
