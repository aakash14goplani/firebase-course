import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  loading: boolean = false;
  lastPageLoaded: number = 0;
  course: Course;
  lessons!: Lesson[];
  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {
    this.course = this.route.snapshot.data['course'];
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchDataFromLessons();
  }

  loadMoreData() {
    this.lastPageLoaded++;
    this.fetchDataFromLessons('asc');
  }

  private fetchDataFromLessons(sortingOrder: any = 'asc') {
    this.coursesService.findLessons(this.course.id, sortingOrder, this.lastPageLoaded).pipe(
      finalize(() => this.loading = false)
    ).subscribe((lessons) => {
      this.lessons = this.lessons ? this.lessons.concat(lessons) : lessons;
    });
  }
}
