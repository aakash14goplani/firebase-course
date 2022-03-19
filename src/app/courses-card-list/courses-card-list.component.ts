import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { tap, catchError, throwError } from 'rxjs';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent {

  @Input() courses!: Course[] | null;

  @Output() courseEdited = new EventEmitter();
  @Output() courseDeleted = new EventEmitter<Course>();

  constructor(
    private dialog: MatDialog,
    private coursesService: CoursesService
  ) { }

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '400px';

    dialogConfig.data = course;

    this.dialog.open(EditCourseDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.courseEdited.emit();
        }
      });
  }

  deleteCourse(course: Course) {
    this.coursesService.deleteCoursesAndLessons(course.id).pipe(
      tap(() => this.courseDeleted.emit(course)),
      catchError(err => throwError(() => new Error(err)))
    ).subscribe();
  }

}
