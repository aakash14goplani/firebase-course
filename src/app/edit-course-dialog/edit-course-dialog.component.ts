import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {

  form: FormGroup;
  private editedcourse: Course;

  constructor(
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private formBuilder: FormBuilder,
    private coursesService: CoursesService
  ) {
    this.form = this.formBuilder.group({
      description: [course.description, Validators.required],
      longDescription: [course.longDescription, Validators.required],
      promo: [!!course.promo]
    });
    this.editedcourse = course;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      const courseToDelete: Partial<Course> = {
        ...this.form.value,
        id: this.editedcourse.id
      };
      this.coursesService.updateCourse(courseToDelete).pipe(
        tap(() => this.dialogRef.close(courseToDelete)),
        catchError(err => throwError(() => {
          this.dialogRef.close();
          alert('Could not update the course.');
          return new Error(err);
        }))
      ).subscribe();
    }
  }
}

