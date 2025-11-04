package br.edu.ifsp.prsi.finquest.service.impl;

import br.edu.ifsp.prsi.finquest.exception.BusinessException;
import br.edu.ifsp.prsi.finquest.model.Course;
import br.edu.ifsp.prsi.finquest.model.User;
import br.edu.ifsp.prsi.finquest.model.UserEnrollment;
import br.edu.ifsp.prsi.finquest.model.UserEnrollmentId;
import br.edu.ifsp.prsi.finquest.repository.CourseRepository;
import br.edu.ifsp.prsi.finquest.repository.UserEnrollmentRepository;
import br.edu.ifsp.prsi.finquest.repository.UserRepository;
import br.edu.ifsp.prsi.finquest.service.EnrollmentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final UserEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentServiceImpl(UserEnrollmentRepository enrollmentRepository,
                             UserRepository userRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public boolean enrollUserInCourse(String userId, String courseId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("Usuário não encontrado com ID: " + userId);
        }
        if (!courseRepository.existsById(courseId)) {
            throw new EntityNotFoundException("Curso não encontrado com ID: " + courseId);
        }

        UserEnrollmentId id = new UserEnrollmentId(userId, courseId);

        if (enrollmentRepository.existsById(id)) {
            throw new BusinessException("Usuário com " + userId + " já está matriculado no curso.");
        }

        User userReference = userRepository.getReferenceById(userId);
        Course courseReference = courseRepository.getReferenceById(courseId);

        UserEnrollment newEnrollment = new UserEnrollment();
        newEnrollment.setId(id);
        newEnrollment.setStartDate(LocalDate.now());
        newEnrollment.setProgress(0);
        newEnrollment.setUser(userReference);
        newEnrollment.setCourse(courseReference);
        enrollmentRepository.save(newEnrollment);

        return true;
    }
}
