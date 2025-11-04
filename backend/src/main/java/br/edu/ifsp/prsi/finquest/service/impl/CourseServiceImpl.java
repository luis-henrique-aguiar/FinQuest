package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.dto.CourseProgressDTO;
import br.edu.ifsp.prsi.finquest.model.Course;
import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.repository.CourseRepository;
import br.edu.ifsp.prsi.finquest.repository.UserEnrollmentRepository;
import br.edu.ifsp.prsi.finquest.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserEnrollmentRepository enrollmentRepository;

    public CourseServiceImpl(CourseRepository courseRepository, UserEnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<CourseProgressDTO> getCoursesForUser(String userId) {
        List<UserEnrollment> enrollments = enrollmentRepository.findByIdUserId(userId);

        Map<UUID, Integer> progressMap = enrollments.stream()
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
}
