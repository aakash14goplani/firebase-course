import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import { Course } from '../model/course';
import { Router } from '@angular/router';
import { catchError, concatMap, last, Observable, take, tap, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})
export class CreateCourseComponent {

  form: FormGroup;
  iconUrl: string = '';
  private courseId: string;
  private filePath: string = '';
  private file!: File;
  percentageChanges$!: Observable<number | undefined>;

  constructor(
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.form = this.formBuilder.group({
      categories: ['BEGINEER', Validators.required],
      url: ['', Validators.required],
      description: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: [false],
      promoStartAt: [null]
    });

    this.courseId = this.coursesService.createUniqueId();
  }

  uploadThumbnail(event: Event) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    this.filePath = `courses/${this.courseId}/${this.file.name}`;
    this.uploadFileToFireStorage();
  }

  private uploadFileToFireStorage(): void {
    const uploadTask = this.storage.upload(this.filePath, this.file, {
      cacheControl: 'max-age=31536000, public'
    });
    this.percentageChanges$ = uploadTask.percentageChanges();

    uploadTask.snapshotChanges().pipe(
      last(),
      concatMap(() => this.storage.ref(this.filePath).getDownloadURL()),
      tap(url => this.iconUrl = url),
      catchError((err) => {
        alert('Could not create thumbnail url.');
        return throwError(() => new Error(err));
      })
    ).subscribe();
  }

  onSubmit() {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      // this.uploadFileToFireStorage();
      const course: Partial<Course> = {
        ...this.form.value,
        promoStartAt: Timestamp.fromDate(this.form.value.promoStartAt ?? new Date()),
        categories: [this.form.value.categories]
      };
      this.coursesService.createCourse(course, this.courseId).pipe(
        tap(_ => this.router.navigateByUrl('/courses')),
        catchError((err) => {
          alert('Could not create the course.');
          return throwError(() => new Error(err));
        }),
        take(1)
      ).subscribe();
    }
  }

}
