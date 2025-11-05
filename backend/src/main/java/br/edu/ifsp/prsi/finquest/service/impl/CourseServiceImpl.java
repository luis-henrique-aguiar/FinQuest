package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.CourseDetailsDTO;
import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;
import br.edu.ifsp.prsi.finquest.dto.LessonProgressDTO;
import br.edu.ifsp.prsi.finquest.model.Course;
import br.edu.ifsp.prsi.finquest.model.Lesson;
import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.repository.CourseRepository;
import br.edu.ifsp.prsi.finquest.repository.LessonRepository;
import br.edu.ifsp.prsi.finquest.repository.UserEnrollmentRepository;
import br.edu.ifsp.prsi.finquest.repository.UserLessonCompletionRepository;
import br.edu.ifsp.prsi.finquest.service.CourseService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserEnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final UserLessonCompletionRepository completionRepository;

    public CourseServiceImpl(CourseRepository courseRepository,
                             UserEnrollmentRepository enrollmentRepository,
                             LessonRepository lessonRepository,
                             UserLessonCompletionRepository completionRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.completionRepository = completionRepository;
    }

    public List<CourseProgressDTO> getCoursesForUser(String userId) {
        List<UserEnrollment> enrollments = enrollmentRepository.findByIdUserId(userId);

        Map<String, Integer> progressMap = enrollments.stream()
                .collect(Collectors.toMap(
                        enrollment -> enrollment.getId().getCourseId(),
                        UserEnrollment::getProgress
                ));

        List<Course> allCourses = courseRepository.findAll();

        return allCourses.stream()
                .map(course -> new CourseProgressDTO(
                        course.getId(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getIcon(),
                        progressMap.getOrDefault(course.getId(), null)
                ))
                .toList();
    }

    public CourseDetailsDTO getCourseDetailsForUser(String courseId, String userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado: " + courseId));

        List<Lesson> lessons = lessonRepository.findAllByCourseId(courseId);

        Set<String> completedLessonIds = completionRepository.findUserCompletionsByCourse(userId, courseId)
                .stream()
                .map(completion -> completion.getId().getLessonId())
                .collect(Collectors.toSet());

        List<LessonProgressDTO> lessonDTOs = lessons.stream()
                .map(lesson -> new LessonProgressDTO(
                        lesson.getId(),
                        lesson.getTitle(),
                        completedLessonIds.contains(lesson.getId())
                ))
                .collect(Collectors.toList());

        return new CourseDetailsDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                lessonDTOs
        );
    }
}
