package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.*;
import br.edu.ifsp.prsi.finquest.service.AdminService;
import br.edu.ifsp.prsi.finquest.service.LessonService;
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
}
