package br.edu.ifsp.prsi.finquest.controller;

import br.edu.ifsp.prsi.finquest.dto.LessonDetailsDTO;
import br.edu.ifsp.prsi.finquest.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDetailsDTO> getLessonById(@PathVariable String lessonId) {
        LessonDetailsDTO lessonDetails = lessonService.getLessonDetails(lessonId);
        return ResponseEntity.ok(lessonDetails);
    }
}
