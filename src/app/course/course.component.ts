import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {

  loading = false;
  course: Course;
  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {
    this.course = this.route.snapshot.data['course'];
  }

}
