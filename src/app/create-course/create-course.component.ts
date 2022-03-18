import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import { Course } from '../model/course';
import { Router } from '@angular/router';
import { catchError, take, tap, throwError } from 'rxjs';

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})
export class CreateCourseComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      categories: ['BEGINEER', Validators.required],
      url: ['', Validators.required],
      description: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: [false],
      promoStartAt: [null]
    });
  }

  onSubmit() {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      const course: Partial<Course> = {
        ...this.form.value,
        promoStartAt: Timestamp.fromDate(this.form.value.promoStartAt ?? new Date()),
        categories: [this.form.value.categories]
      };
      this.coursesService.createCourse(course, this.coursesService.createUniqueId()).pipe(
        tap(_ => this.router.navigateByUrl('/courses')),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error(err));
        }),
        take(1)
      ).subscribe();
    }
  }

}
