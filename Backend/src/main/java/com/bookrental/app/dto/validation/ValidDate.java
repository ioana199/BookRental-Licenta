package com.bookrental.app.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = {DateValidator.class}) //DateValidator trebuie sa implementeze ConstraintValidator
// --> ii spune lui Spring sa foloseasca clasa DateValidator pentru a verifica regula
@Target(ElementType.TYPE) //specifica unde se pune adnotarea
//.TYPE --> adnotarea se pune pe clasa - pentru ca validatorul sa vada obiectul intreg (strat + end date)
@Retention(RUNTIME) //specifica faptul ca adnotarea exista si cat timp aplicatia ruleaza
public @interface ValidDate {
    String message() default "Start date must be before end date"; //setarea mesajului default care apare daca conditia nu e respectata

    Class<?>[] groups() default {}; //se foloseste pentru mai multe tipuri de validari - permite gruparea mai multor validari

    Class<? extends Payload>[] payload() default {};
}
