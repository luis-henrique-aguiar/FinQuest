package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.service.AdminService;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;
    private final LessonService lessonService;

    public AdminController(AdminService adminService, LessonService lessonService) {
        this.adminService = adminService;
        this.lessonService = lessonService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getSystemStats() {
        AdminStatsDTO stats = adminService.getSystemStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserSummaryDTO>> getAllUsers(
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<UserSummaryDTO> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{userId}/promote")
    public ResponseEntity<Void> promoteUserToAdmin(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable String userId
    ) {
        String adminId = userDetails.getUsername();
        adminService.promoteUserToAdmin(userId, adminId);
        return ResponseEntity.ok().build();
    }

    // ========================================
    // Content Management Endpoints
    // ========================================

    @GetMapping("/lessons")
    public ResponseEntity<List<LessonSummaryDTO>> getAllLessons(
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) Boolean isDraft
    ) {
        List<LessonSummaryDTO> lessons = lessonService.getAllLessonsForAdmin(courseId, isDraft);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/lessons/{lessonId}/content")
    public ResponseEntity<String> getLessonContent(@PathVariable String lessonId) {
        logger.debug("Fetching content for lesson: {}", lessonId);
        String content = lessonService.getLessonContentForAdmin(lessonId);
        return ResponseEntity.ok(content);
    }

    @PostMapping("/lessons")
    public ResponseEntity<LessonDetailsDTO> createLesson(@Valid @RequestBody LessonCreateDTO dto) {
        LessonDetailsDTO lesson = lessonService.createLesson(dto);
        return ResponseEntity.status(201).body(lesson);
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<LessonDetailsDTO> updateLesson(
            @PathVariable String lessonId,
            @Valid @RequestBody LessonUpdateDTO dto
    ) {
        LessonDetailsDTO lesson = lessonService.updateLesson(lessonId, dto);
        return ResponseEntity.ok(lesson);
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(@PathVariable String lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/lessons/{lessonId}/quiz")
    public ResponseEntity<Void> updateLessonQuiz(
            @PathVariable String lessonId,
            @Valid @RequestBody List<QuizCreateDTO> questions
    ) {
        lessonService.updateLessonQuiz(lessonId, questions);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseSimpleDTO>> getAllCourses() {
        List<CourseSimpleDTO> courses = adminService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/courses-with-lessons")
    public ResponseEntity<List<CourseWithLessonsDTO>> getAllCoursesWithLessons() {
        logger.debug("Fetching all courses with lessons for admin content dashboard");
        List<CourseWithLessonsDTO> courses = adminService.getAllCoursesWithLessons();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/courses/{courseId}/lesson-orders")
    public ResponseEntity<List<Integer>> getOccupiedLessonOrders(@PathVariable String courseId) {
        List<Integer> occupiedOrders = lessonService.getOccupiedLessonOrders(courseId);
        return ResponseEntity.ok(occupiedOrders);
    }

    @PutMapping("/courses/{courseId}/lessons/reorder")
    public ResponseEntity<Void> reorderLessons(
            @PathVariable String courseId,
            @Valid @RequestBody List<LessonReorderDTO> reorders
    ) {
        lessonService.reorderLessons(courseId, reorders);
        return ResponseEntity.ok().build();
    }
}
