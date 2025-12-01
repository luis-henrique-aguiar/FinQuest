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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseServiceImpl.class);

    private final CourseRepository courseRepository;
    private final UserEnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final UserLessonCompletionRepository completionRepository;

    public CourseServiceImpl(
            CourseRepository courseRepository,
            UserEnrollmentRepository enrollmentRepository,
            LessonRepository lessonRepository,
            UserLessonCompletionRepository completionRepository
    ) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.completionRepository = completionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseProgressDTO> getCoursesForUser(String userId) {
        logger.debug("Buscando lista de cursos e progresso: userId={}", userId);

        Map<String, Integer> progressMap = buildProgressMap(userId);
        List<Course> allCourses = courseRepository.findAll();

        List<CourseProgressDTO> result = allCourses.stream()
                .map(course -> mapToCourseProgressDTO(course, progressMap))
                .toList();

        logger.debug("Cursos retornados: userId={}, totalCursos={}, cursosIniciados={}",
                userId, result.size(), progressMap.size());

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailsDTO getCourseDetailsForUser(String courseId, String userId) {
        logger.debug("Buscando detalhes do curso: courseId={}, userId={}", courseId, userId);

        Course course = findCourseOrThrow(courseId);

        List<Lesson> lessons = lessonRepository.findAllByCourseIdOrderByLessonOrderAsc(courseId);
        Set<String> completedLessonIds = getCompletedLessonIds(userId, courseId);

        List<LessonProgressDTO> lessonDTOs = lessons.stream()
                .map(lesson -> mapToLessonProgressDTO(lesson, completedLessonIds))
                .toList();

        logger.debug("Detalhes carregados: courseId={}, totalLições={}, liçõesCompletas={}",
                courseId, lessons.size(), completedLessonIds.size());

        return new CourseDetailsDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                lessonDTOs
        );
    }

    private Map<String, Integer> buildProgressMap(String userId) {
        List<UserEnrollment> enrollments = enrollmentRepository.findByIdUserId(userId);
        return enrollments.stream()
                .collect(Collectors.toMap(
                        enrollment -> enrollment.getId().getCourseId(),
                        UserEnrollment::getProgress
                ));
    }

    private Set<String> getCompletedLessonIds(String userId, String courseId) {
        return completionRepository.findUserCompletionsByCourse(userId, courseId)
                .stream()
                .map(completion -> completion.getId().getLessonId())
                .collect(Collectors.toSet());
    }

    private CourseProgressDTO mapToCourseProgressDTO(Course course, Map<String, Integer> progressMap) {
        return new CourseProgressDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getIcon(),
                progressMap.getOrDefault(course.getId(), null)
        );
    }

    private LessonProgressDTO mapToLessonProgressDTO(Lesson lesson, Set<String> completedIds) {
        return new LessonProgressDTO(
                lesson.getId(),
                lesson.getTitle(),
                completedIds.contains(lesson.getId())
        );
    }

    private Course findCourseOrThrow(String courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> {
                    logger.warn("Curso não encontrado: id={}", courseId);
                    return new EntityNotFoundException("Curso nao encontrado: " + courseId);
                });
    }
}