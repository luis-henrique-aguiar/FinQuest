package br.edu.ifsp.prsi.finquest.exception;

import br.edu.ifsp.prsi.finquest.dto.ErrorResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex,
                                                                                  HttpServletRequest request) {
        List<String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        var errorResponse = ErrorResponseDTO.validation(
                "Dados inválidos. Verifique os campos e tente novamente.",
                fieldErrors,
                request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponseDTO> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        logger.warn("Business Error: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        var errorResponse = ErrorResponseDTO.business(
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {
        var errorResponse = ErrorResponseDTO.business(
                "Erro ao processar a requisição devido a conflito de dados.",
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericError(Exception ex, HttpServletRequest request) {
        logger.error("Unexpected Error on {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        var errorResponse = ErrorResponseDTO.internal(
                "Erro interno do servidor",
                request.getRequestURI()
        );

        return ResponseEntity.internalServerError().body(errorResponse);
    }

    @ExceptionHandler({AccessDeniedException.class, AuthorizationDeniedException.class})
    public ResponseEntity<ErrorResponseDTO> handleAccessDeniedException(Exception ex, HttpServletRequest request) {
        var errorResponse = new ErrorResponseDTO(
                HttpStatus.FORBIDDEN.value(),
                "FORBIDDEN",
                "Acesso negado. Você não tem permissão para realizar esta ação.",
                null,
                request.getRequestURI(),
                java.time.LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> handleJsonError(HttpMessageNotReadableException ex, HttpServletRequest request) {
        var errorResponse = ErrorResponseDTO.validation(
                "JSON inválido ou malformado.",
                null,
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message = String.format("Parâmetro '%s' inválido. Valor recebido: '%s'",
                ex.getName(), ex.getValue());

        var errorResponse = ErrorResponseDTO.validation(
                "Erro de formatação na requisição",
                List.of(message),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityNotFoundException(
            EntityNotFoundException ex,
            HttpServletRequest request) {

        var errorResponse = ErrorResponseDTO.notFound(
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
}
