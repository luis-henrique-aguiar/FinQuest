package br.edu.ifsp.prsi.finquest.annotation;

import br.edu.ifsp.prsi.finquest.validator.StrongPasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StrongPasswordValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {
    String message() default "A senha deve ter no mínimo 6 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula e um número.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
