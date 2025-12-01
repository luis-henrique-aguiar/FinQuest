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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private static final Logger logger = LoggerFactory.getLogger(EnrollmentServiceImpl.class);

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

    @Override
    @Transactional
    public boolean enrollUserInCourse(String userId, String courseId) {
        logger.info("Iniciando solicitação de matrícula: userId={}, courseId={}", userId, courseId);

        if (!userRepository.existsById(userId)) {
            logger.warn("Falha na matrícula: Usuário inexistente. userId={}", userId);
            throw new EntityNotFoundException("Usuário não encontrado com ID: " + userId);
        }

        if (!courseRepository.existsById(courseId)) {
            logger.warn("Falha na matrícula: Curso inexistente. courseId={}", courseId);
            throw new EntityNotFoundException("Curso não encontrado com ID: " + courseId);
        }

        UserEnrollmentId id = new UserEnrollmentId(userId, courseId);

        if (enrollmentRepository.existsById(id)) {
            logger.warn("Tentativa de matrícula duplicada ignorada: userId={}, courseId={}", userId, courseId);
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

        logger.info("Matrícula realizada com sucesso: userId={}, courseId={}", userId, courseId);
        return true;
    }
}