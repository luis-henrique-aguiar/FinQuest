package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;
import br.edu.ifsp.prsi.finquest.service.CourseService;
import br.edu.ifsp.prsi.finquest.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public CourseController(CourseService courseService, EnrollmentService enrollmentService) {
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<List<CourseProgressDTO>> getAllCoursesForUser(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<CourseProgressDTO> courses = courseService.getCoursesForUser(userId);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Void> enrollInCourse(@PathVariable String courseId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        enrollmentService.enrollUserInCourse(userId, courseId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
