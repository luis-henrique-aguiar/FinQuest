package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;
import br.edu.ifsp.prsi.finquest.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseProgressDTO>> getAllCoursesForUser(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<CourseProgressDTO> courses = courseService.getCoursesForUser(userId);
        return ResponseEntity.ok(courses);
    }
}
