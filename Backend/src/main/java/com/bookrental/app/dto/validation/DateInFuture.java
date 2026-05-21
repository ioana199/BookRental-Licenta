package com.bookrental.app.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = {InFutureDateValidator.class})
@Target(ElementType.TYPE)
@Retention(RUNTIME)
public @interface DateInFuture {
    String message() default "Start date and and date must be in future";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
