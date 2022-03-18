/* eslint-disable no-console */
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, distinctUntilChanged } from 'rxjs';
import { COURSES, findLessonsForCourse } from './db-data';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  constructor(private db: AngularFirestore) {
  }

  async uploadData() {
    const coursesCollection = this.db.collection('courses');
    const courses = await this.db.collection('courses').get();
    for (const course of Object.values(COURSES)) {
      const newCourse = this.removeId(course);
      const courseRef = await coursesCollection.add(newCourse);
      const lessons = await courseRef.collection('lessons');
      const courseLessons = findLessonsForCourse((course as any)['id']);

      for (const lesson of courseLessons) {
        const newLesson = this.removeId(lesson);
        delete newLesson.courseId;
        await lessons.add(newLesson);
      }
    }
  }

  onReadDoc() {
    /* this.db.doc('/courses/0z2EQKJrrSGAuQ3NlZ3U').get().subscribe(data => console.log('GET', data.id, data.data()));
    this.db.doc('/courses/0z2EQKJrrSGAuQ3NlZ3U').snapshotChanges().subscribe(data => console.log('snapshot changes: ', data.payload.id, data.payload.data()));
    this.db.doc('/courses/0z2EQKJrrSGAuQ3NlZ3U').valueChanges().subscribe(data => console.log('valueChanges: ', data)); */
    combineLatest([
      this.db.doc('/courses/0z2EQKJrrSGAuQ3NlZ3U').get(),
      this.db.doc('/courses/0z2EQKJrrSGAuQ3NlZ3U').snapshotChanges(),
      this.db.doc('/courses/0z2EQKJrrSGAuQ3NlZ3U').valueChanges()
    ]).pipe(
      distinctUntilChanged()
    ).subscribe({
      next: ([doc, snapshotChanges, valueChanges]) => {
        /* console.log('Document Change: ', doc.id, doc.data());
        console.log('Snapshot Change: ', snapshotChanges.payload.id, snapshotChanges.payload.data());
        console.log('Value Change: ', valueChanges); */
      },
      error: err => console.error('Error: ', err)
    });
  }

  onReadCollection() {
    this.db.collection(
      '/courses/CXi7Ofey9sMYKdYAGLez/lessons',
      ref => ref.where('seqNo', '>=', 1).where('url', '==', 'angular-forms-course').orderBy('seqNo')
    ).get()
      .subscribe({
        next: data => data.forEach(doc => console.log(doc.id, doc.data())),
        error: err => console.error('Error: ', err)
      });
  }

  onReadCollectionGroup() {
    this.db.collectionGroup(
      'lessons',
      ref => ref.where('seqNo', '==', 1)
    ).get()
      .subscribe({
        next: data => data.forEach(doc => console.log(doc.id, doc.data())),
        error: err => console.error('Error: ', err)
      });
  }

  removeId(data: any) {
    const newData: any = { ...data };
    delete newData.id;
    return newData;
  }

}
