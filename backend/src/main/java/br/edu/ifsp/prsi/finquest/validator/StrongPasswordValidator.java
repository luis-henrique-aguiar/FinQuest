package br.edu.ifsp.prsi.finquest.validator;

import br.edu.ifsp.prsi.finquest.annotation.StrongPassword;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isBlank()) {
            return false;
        }

        if (password.length() < 6) return false;

        boolean hasLower = password.matches(".*[a-z].*");

        boolean hasUpper = password.matches(".*[A-Z].*");

        boolean hasDigit = password.matches(".*\\d.*");

        return hasLower && hasUpper && hasDigit;
    }
}
